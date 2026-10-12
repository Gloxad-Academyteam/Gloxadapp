"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MdArrowBack,
  MdOutlineBook,
  MdOutlineCheckCircle,
  MdOutlineChatBubbleOutline,
  MdOutlineFileDownload,
  MdOutlineGpsFixed,
  MdOutlineInfo,
  MdOutlinePauseCircle,
  MdOutlinePlayCircle,
  MdOutlineQuiz,
  MdOutlineRadioButtonUnchecked,
  MdOutlineReply,
  MdOutlineThumbUp,
  MdOutlineVideocam,
  MdThumbUp,
} from "react-icons/md";
import { LuFileText } from "react-icons/lu";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import LmsShell, { soon } from "./components/LmsShell";
import { cardClass, inputClass } from "./components/ui";
import { LESSON, LESSON_COMMENTS, TComment } from "./data";

const DURATION = 14 * 60 + 32;
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

const KIND_ICON = { video: MdOutlineVideocam, reading: MdOutlineBook, quiz: MdOutlineQuiz } as const;

const Person = ({ initials, tone }: { initials: string; tone?: "instructor" }) => (
  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${tone ? "bg-[#d3e8f8] text-[#1a1a7a]" : "bg-[#e7e8fb] text-[#1a1a7a]"}`}>{initials}</span>
);

const LessonPage = () => {
  const { authenticatedUser: user } = useAuth();
  const [objectives, setObjectives] = useState(LESSON.objectives);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [comments, setComments] = useState<TComment[]>(LESSON_COMMENTS);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const draftRef = useRef<HTMLTextAreaElement>(null);
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "ME";

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setSeconds((value) => (value >= DURATION ? (setPlaying(false), DURATION) : value + 1)), 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const toggleLike = (id: string) => setLiked((state) => ({ ...state, [id]: !state[id] }));

  const post = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setComments((list) => [
      { id: `c${Date.now()}`, initials, name: `${user?.firstName ?? "You"} ${user?.lastName ?? ""}`.trim(), time: "Just now", text: draft.trim(), likes: 0 },
      ...list,
    ]);
    setDraft("");
  };

  const reply = (name: string) => {
    setDraft(`@${name} `);
    draftRef.current?.focus();
  };

  const renderComment = (comment: TComment, isReply = false) => (
    <div key={comment.id} className={isReply ? "ml-0 mt-5 border-l border-[#dedcec] pl-5 sm:ml-12" : "mt-6"}>
      <div className="flex items-start gap-3">
        <Person initials={comment.initials} tone={comment.role ? "instructor" : undefined} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-bold text-[#14162b]">{comment.name}</span>
            {comment.role && <span className="rounded-[3px] bg-[#eceefd] px-1.5 py-0.5 text-[10px] font-medium text-[#1a1a7a]">{comment.role}</span>}
            <span className="text-[#4a4d66]">{comment.time}</span>
          </p>
          <p className="mt-1.5 text-[13px] leading-[1.7] text-[#2a2c42]">{comment.text}</p>
          <div className="mt-2 flex items-center gap-5 text-[12px] text-[#4a4d66]">
            <button type="button" onClick={() => toggleLike(comment.id)} aria-pressed={!!liked[comment.id]} className={`flex items-center gap-1.5 hover:text-[#1a1a7a] ${liked[comment.id] ? "font-bold text-[#1a1a7a]" : ""}`}>
              {liked[comment.id] ? <MdThumbUp size={15} /> : <MdOutlineThumbUp size={15} />} {comment.likes + (liked[comment.id] ? 1 : 0)}
            </button>
            <button type="button" onClick={() => reply(comment.name)} className="flex items-center gap-1.5 hover:text-[#1a1a7a]">
              <MdOutlineReply size={15} /> Reply
            </button>
          </div>
        </div>
      </div>
      {comment.replies?.map((item) => renderComment(item, true))}
    </div>
  );

  return (
    <LmsShell active="curriculum" topTab="trimesters" search="Search...">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="text-[12px] text-[#4a4d66]">
          <span className="uppercase tracking-wide">{LESSON.trimester}</span> <span className="mx-1.5">&rsaquo;</span> {LESSON.module}
        </nav>
        <h1 className="mt-2 text-[24px] font-bold leading-tight text-[#14162b] sm:text-[28px]">{LESSON.title}</h1>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-6">
            <div className={`${cardClass} overflow-hidden p-3 sm:p-4`}>
              <div className="relative aspect-video overflow-hidden rounded-[8px] bg-gradient-to-br from-[#1d3a63] via-[#27598a] to-[#14243f]">
                <div aria-hidden className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #5fb0ff 0, transparent 40%), radial-gradient(circle at 80% 70%, #7a6bff 0, transparent 45%)" }} />
                <div className="relative flex h-full flex-col justify-center px-6 sm:px-12">
                  <p className="text-[clamp(20px,4.4vw,44px)] font-bold uppercase leading-none tracking-tight text-white">Scalable Architecture</p>
                  <p className="mt-3 text-[11px] text-white/80 sm:text-[13px]">Lesson 4: Building Robust Systems &bull; Module: Cloud Infrastructure</p>
                </div>
                <button
                  type="button"
                  aria-label={playing ? "Pause lesson video" : "Play lesson video"}
                  onClick={() => setPlaying((value) => !value)}
                  className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1a7a] shadow-xl transition-transform hover:scale-105"
                >
                  {playing ? <MdOutlinePauseCircle size={44} /> : <MdOutlinePlayCircle size={44} />}
                </button>
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-[12px] text-white">
                  <span className="tabular-nums">{clock(seconds)}</span>
                  <input
                    type="range"
                    min={0}
                    max={DURATION}
                    value={seconds}
                    onChange={(event) => setSeconds(Number(event.target.value))}
                    aria-label="Seek"
                    className="h-1 flex-1 cursor-pointer accent-[#6cc1ff]"
                  />
                  <span className="tabular-nums">{clock(DURATION)}</span>
                </div>
              </div>
              <p className="mt-3 px-1 text-[11px] text-[#4a4d66]">Preview player. Lesson video streaming is connected when the course content is published.</p>
            </div>

            <section className={`${cardClass} p-6 sm:p-8`}>
              <h2 className="border-b border-[#e8e7f1] pb-4 text-[16px] font-medium text-[#14162b]">Lesson Notes &amp; Materials</h2>
              <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-[#2a2c42]">{LESSON.intro}</p>
              <h3 className="mt-5 text-[17px] font-medium text-[#14162b]">Key Concepts</h3>
              <ul className="mt-3 flex max-w-[560px] flex-col gap-4 pl-1">
                {LESSON.concepts.map(([term, text]) => (
                  <li key={term} className="text-[14px] leading-[1.7] text-[#14162b]">
                    <strong className="font-bold">{term}:</strong> {text}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex max-w-[560px] gap-3 border-l-[3px] border-[#c9c8dc] bg-[#faf9ff] py-3 pl-4 pr-3 text-[13px] leading-[1.7] text-[#14162b]">
                <MdOutlineInfo size={18} className="mt-0.5 shrink-0 text-[#4a4d66]" />
                <p>
                  <strong className="font-bold">Pro Tip:</strong> {LESSON.tip}
                </p>
              </div>
              <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-[#2a2c42]">{LESSON.outro}</p>
              <div className="mt-6 border-t border-[#e8e7f1] pt-5">
                <button
                  type="button"
                  onClick={() => toast.info("Downloads are available once course files are published.")}
                  className="flex items-center gap-4 rounded-[8px] border border-[#dedcec] bg-white px-4 py-3 text-left transition-colors hover:bg-[#f7f6fd]"
                >
                  <LuFileText size={18} className="text-[#4a4d66]" />
                  <span>
                    <span className="block text-[13px] text-[#14162b]">{LESSON.file.name}</span>
                    <span className="block text-[11px] text-[#4a4d66]">{LESSON.file.size}</span>
                  </span>
                  <MdOutlineFileDownload size={22} className="ml-6 text-[#14162b]" />
                </button>
              </div>
            </section>

            <section className={`${cardClass} p-6 sm:p-8`} aria-labelledby="discussion-title">
              <h2 id="discussion-title" className="flex items-center gap-2 text-[15px] font-medium text-[#14162b]">
                <MdOutlineChatBubbleOutline size={20} /> Class Discussion
              </h2>
              <form onSubmit={post} className="mt-5">
                <div className="flex items-start gap-3">
                  <Person initials={initials} />
                  <textarea
                    ref={draftRef}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    aria-label="Add to the discussion"
                    placeholder="Ask a question or share a thought..."
                    className={`${inputClass} resize-y !text-[13px]`}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button type="submit" disabled={!draft.trim()} className="rounded-[6px] px-4 py-2 text-[13px] font-medium text-[#14162b] transition-colors hover:bg-[#f1effa] disabled:text-[#8d8fa6] disabled:hover:bg-transparent">
                    Post Comment
                  </button>
                </div>
              </form>
              {comments.map((comment) => renderComment(comment))}
            </section>
          </div>

          <aside className="flex min-w-0 flex-col gap-5">
            <section className={`${cardClass} p-5`}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#14162b]">Progress</span>
                <span className="text-[#4a4d66]">{LESSON.progress}% Complete</span>
              </div>
              <div role="progressbar" aria-label="Lesson progress" aria-valuenow={LESSON.progress} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8e7f1]">
                <div className="h-full rounded-full bg-[#00658f]" style={{ width: `${LESSON.progress}%` }} />
              </div>
              <button type="button" onClick={() => soon("Previous lesson")} className="mt-5 inline-flex items-center gap-2 rounded-[6px] border border-[#dedcec] px-4 py-2 text-[13px] text-[#14162b] hover:bg-[#f7f6fd]">
                <MdArrowBack size={16} /> Previous
              </button>
            </section>

            <section className={`${cardClass} p-5`}>
              <h2 className="flex items-center gap-2 text-[15px] font-medium text-[#14162b]">
                <MdOutlineGpsFixed size={20} className="text-[#1a1a7a]" /> Learning Objectives
              </h2>
              <ul className="mt-4 flex flex-col gap-4">
                {objectives.map((objective, index) => (
                  <li key={objective.text}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={objective.done}
                      onClick={() => setObjectives((list) => list.map((item, i) => (i === index ? { ...item, done: !item.done } : item)))}
                      className="flex items-start gap-3 text-left text-[13px] leading-[1.6] text-[#14162b]"
                    >
                      {objective.done ? <MdOutlineCheckCircle size={20} className="mt-0.5 shrink-0 text-[#1a1a7a]" /> : <MdOutlineRadioButtonUnchecked size={20} className="mt-0.5 shrink-0 text-[#4a4d66]" />}
                      {objective.text}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${cardClass} p-5`}>
              <h2 className="border-b border-[#e8e7f1] pb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[#14162b]">Up Next in Module 4</h2>
              <ul className="mt-4 flex flex-col gap-4">
                {LESSON.upNext.map(({ title, meta, kind, href }) => {
                  const Icon = KIND_ICON[kind as keyof typeof KIND_ICON];
                  return (
                    <li key={title}>
                      <Link href={href} className="block rounded-[6px] px-1 py-0.5 hover:bg-[#f7f6fd]">
                        <span className="block text-[13px] text-[#14162b]">{title}</span>
                        <span className="mt-1 flex items-center gap-1.5 text-[12px] text-[#4a4d66]">
                          <Icon size={15} /> {meta}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </LmsShell>
  );
};

export default LessonPage;
