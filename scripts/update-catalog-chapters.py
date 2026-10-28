#!/usr/bin/env python3
"""Collects each catalogue video's YouTube chapters into src/constants/catalog/gloxadChapters.json.

    python3 scripts/update-catalog-chapters.py                    # fetch chapters for videos not in that file yet
    python3 scripts/update-catalog-chapters.py --refresh          # fetch every video again
    python3 scripts/update-catalog-chapters.py --cache saved.json # reuse results from an earlier run (repeatable)
    python3 scripts/update-catalog-chapters.py --backend ../gloxard-backend/src/data/gloxadCourses2026.json

Chapters are the ones the creator published on YouTube, read from the video's public page: the chapter list
when YouTube has one, otherwise the timestamps in the description. The output maps a video id to a list of
{ title, start, end } in seconds. A video with no chapters maps to an empty list and plays as one lesson.

The website loads the chapters file only on course pages, so the course list stays small. The backend needs
the chapters inside its own copy of the catalogue: pass --backend to write that merged copy.

Be gentle with YouTube: the script waits between requests, and fast bursts can get blocked.
"""
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

CATALOG = Path(__file__).resolve().parent.parent / "src/constants/catalog/gloxadCourses.json"
CHAPTERS = CATALOG.parent / "gloxadChapters.json"
DELAY_SECONDS = 1.5


def fetch_page(video_id):
    request = urllib.request.Request(
        f"https://www.youtube.com/watch?v={video_id}&hl=en",
        headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9", "Cookie": "CONSENT=YES+1"},
    )
    return urllib.request.urlopen(request, timeout=40).read().decode("utf-8", "ignore")


def to_seconds(stamp):
    seconds = 0
    for part in stamp.split(":"):
        seconds = seconds * 60 + int(part)
    return seconds


def parse_page(html):
    """Returns { length, source, chapters: [{start, title}] } for one video page."""
    chapters = []
    match = re.search(r"var ytInitialData = (\{.*?\});</script>", html, re.S)
    if match:
        data = json.loads(match.group(1))

        def walk(node):
            if isinstance(node, dict):
                if "chapterRenderer" in node:
                    chapter = node["chapterRenderer"]
                    chapters.append({"start": int(chapter["timeRangeStartMillis"]) // 1000, "title": chapter["title"]["simpleText"].strip()})
                for value in node.values():
                    walk(value)
            elif isinstance(node, list):
                for value in node:
                    walk(value)

        walk(data)
    source = "youtube-chapters"
    if not chapters:
        found = re.search(r'"shortDescription":"((?:[^"\\]|\\.)*)"', html)
        description = json.loads('"' + found.group(1) + '"') if found else ""
        pattern = r"(?m)^[^\n]{0,12}?\(?((?:\d{1,2}:)?\d{1,2}:\d{2})\)?[\s\-–:)]*([^\n]+)$"
        for stamp, title in re.findall(pattern, description):
            chapters.append({"start": to_seconds(stamp), "title": title.strip()})
        source = "description"
    forward = []
    for chapter in sorted(chapters, key=lambda c: c["start"]):
        if forward and chapter["start"] <= forward[-1]["start"]:
            continue
        if chapter["title"]:
            forward.append(chapter)
    length = re.search(r'"lengthSeconds":"(\d+)"', html)
    return {"length": int(length.group(1)) if length else None, "source": source if forward else "none", "chapters": forward}


def with_ends(chapters, length):
    """Adds each chapter's end (the next chapter's start, or the end of the video) and covers the video from 0:00."""
    chapters = [c for c in chapters if c["start"] < length]
    if not chapters:
        return []
    if chapters[0]["start"] > 0:
        if chapters[0]["start"] < 60:
            chapters[0] = {**chapters[0], "start": 0}
        else:
            chapters.insert(0, {"start": 0, "title": "Introduction"})
    result = []
    for index, chapter in enumerate(chapters):
        end = chapters[index + 1]["start"] if index + 1 < len(chapters) else length
        if end > chapter["start"]:
            result.append({"title": chapter["title"], "start": chapter["start"], "end": end})
    return result


def main():
    args = sys.argv[1:]
    refresh = "--refresh" in args
    backend = Path(args[args.index("--backend") + 1]) if "--backend" in args else None
    cache = {}
    for index, arg in enumerate(args):
        if arg == "--cache":
            cache.update(json.loads(Path(args[index + 1]).read_text()))

    catalog = json.loads(CATALOG.read_text())
    saved = json.loads(CHAPTERS.read_text()) if CHAPTERS.exists() else {}
    lengths = {}
    for course in catalog["courses"]:
        for video in course["videos"]:
            lengths.setdefault(video["youtubeId"], sum(int(p) * 60 ** i for i, p in enumerate(reversed(video["length"].split(":")))))

    todo = [vid for vid in lengths if vid not in cache and (refresh or vid not in saved)]
    print(f"{len(lengths)} videos, {len(todo)} to fetch")
    for number, video_id in enumerate(todo, 1):
        for attempt in range(4):
            try:
                cache[video_id] = parse_page(fetch_page(video_id))
                break
            except Exception:
                time.sleep(5 * (attempt + 1))
        else:
            print(f"  could not read {video_id}; leaving it as one lesson")
            continue
        print(f"  {number}/{len(todo)} {video_id}: {len(cache[video_id]['chapters'])} chapters ({cache[video_id]['source']})")
        time.sleep(DELAY_SECONDS)

    chapters = {}
    for video_id, catalogue_length in lengths.items():
        info = cache.get(video_id)
        chapters[video_id] = with_ends(info["chapters"], info.get("length") or catalogue_length) if info else saved.get(video_id, [])

    CHAPTERS.write_text(json.dumps(chapters, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"Wrote {CHAPTERS.name}: {sum(len(c) for c in chapters.values())} chapters across {len(chapters)} videos")

    if backend:
        for course in catalog["courses"]:
            for video in course["videos"]:
                video["chapters"] = chapters.get(video["youtubeId"], [])
        backend.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n")
        print(f"Wrote {backend} with chapters included")


if __name__ == "__main__":
    main()
