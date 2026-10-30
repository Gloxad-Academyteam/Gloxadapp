"use client";

import React, { useState } from "react";
import { FiChevronDown, FiPlay } from "react-icons/fi";
import { formatLength, formatTimestamp } from "@utils/youtube";

type TChapter = { _id?: string; title: string; videoUrl?: string; youtubeId?: string; startSeconds?: number; endSeconds?: number; duration?: string };

type TProps = {
  modules: any[];
  // The chapter currently in the page's video, so it can be highlighted
  activeUrl?: string | null;
  onPlay: (lesson: TChapter) => void;
};

const secondsOf = (lesson: TChapter) => Math.max(0, (lesson.endSeconds || 0) - (lesson.startSeconds || 0));

// The course's modules (one per video) with their chapters. Picking a chapter plays it in the page's video.
const CourseContent = ({ modules, activeUrl, onPlay }: TProps) => {
  const [open, setOpen] = useState<number | null>(0);

  if (!modules.length) {
    return <p className="text-[14px] text-[#717480]">The lessons for this course will appear here.</p>;
  }

  return (
    <div className="divide-y divide-[#eceef5] overflow-hidden rounded-2xl border border-[#e5e7ef] bg-white">
      {modules.map((mod, index) => {
        const lessons: TChapter[] = mod.lessons || [];
        const seconds = lessons.reduce((total, lesson) => total + secondsOf(lesson), 0);
        const isOpen = open === index;
        return (
          <div key={mod._id || index}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#f9fafd] sm:px-6"
            >
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#3e6ab3]">Module {index + 1}</span>
                <span className="mt-0.5 block truncate text-[15px] font-semibold text-[#201633]">{String(mod.title || "").replace(/^Module \d+:\s*/, "")}</span>
                <span className="mt-0.5 block text-[13px] text-[#717480]">
                  {lessons.length} {lessons.length === 1 ? "chapter" : "chapters"}
                  {seconds > 0 ? ` · ${formatLength(seconds)}` : mod.duration ? ` · ${mod.duration}` : ""}
                </span>
              </span>
              <FiChevronDown className={`shrink-0 text-[18px] text-[#8a8c95] transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <ul className="max-h-[440px] overflow-y-auto border-t border-[#eceef5] bg-[#fafbfe] py-2">
                {lessons.map((lesson, lIndex) => {
                  const playable = !!lesson.videoUrl;
                  const isActive = !!activeUrl && lesson.videoUrl === activeUrl;
                  return (
                    <li key={lesson._id || lIndex}>
                      <button
                        type="button"
                        disabled={!playable}
                        onClick={() => onPlay(lesson)}
                        className={`group flex w-full items-center gap-3 px-5 py-2.5 text-left transition sm:px-6 ${
                          isActive ? "bg-[#eef2ff]" : "hover:bg-white"
                        } ${playable ? "" : "cursor-default opacity-60"}`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] ${
                            isActive ? "bg-[#07004d] text-white" : "bg-white text-[#07004d] ring-1 ring-[#d7d9e4] group-hover:ring-[#07004d]"
                          }`}
                        >
                          <FiPlay className="ml-[1px]" />
                        </span>
                        <span className={`min-w-0 flex-1 truncate text-[14px] ${isActive ? "font-semibold text-[#07004d]" : "text-[#201633]"}`}>
                          {lesson.title}
                        </span>
                        <span className="shrink-0 text-[12px] tabular-nums text-[#8a8c95]">
                          {lesson.youtubeId ? formatTimestamp(lesson.startSeconds || 0) : lesson.duration || ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContent;
