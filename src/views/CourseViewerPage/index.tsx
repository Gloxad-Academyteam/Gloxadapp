"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiStar, FiClock, FiCheckCircle, FiPlayCircle, FiChevronLeft, FiChevronRight, FiMenu, FiDownload, FiFileText } from "react-icons/fi";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import LessonVideo, { getYouTubeId } from "@components/LessonVideo";
import YouTubePlayer, { TPlayerState, TYouTubePlayerHandle } from "@components/YouTubePlayer";
import { formatTimestamp, getYouTubeStart } from "@utils/youtube";
import FullscreenButton from "@components/FullscreenButton";
import { getMyEnrollment, getCourseProgress, saveLessonProgress } from "@services/enrollments";

export default function CourseViewerPage() {
  const { id: courseId } = useParams<{ id: string }>()!;
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("notes");
  const [showMenu, setShowMenu] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  
  const [newNoteText, setNewNoteText] = useState("");

  const queryClient = useQueryClient();

  const { data: enrollment, isLoading, isError } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      const match = await getMyEnrollment(courseId);
      if (!match) throw new Error("Not enrolled");
      return match;
    },
    enabled: !!courseId
  });

  const { data: courseData } = useQuery({
    queryKey: ["course.detail", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      // GET /courses/:slugOrId answers { course, isEnrolled }
      return res.data?.course ?? res.data;
    },
    enabled: !!courseId
  });


  const { data: notes } = useQuery({
    queryKey: ["course.notes", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/learning/${courseId}/notes`);
      // The answer is a list, or { notes: [...] }
      return Array.isArray(res.data) ? res.data : res.data?.notes ?? [];
    },
    enabled: !!courseId && activeTab === 'notes'
  });



  const addNoteMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await axiosInstance.post(`/learning/${courseId}/notes`, {
        text,
        timestamp: "0:00",
        lectureId: activeLesson?._id
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course.notes", courseId] });
      setNewNoteText("");
    }
  });

  // One entry per lesson. A lesson is a chapter of a YouTube video: _vid is the video, and _start and _end
  // are where the chapter begins and ends in it, in seconds.
  const lessons: any[] = useMemo(
    () =>
      (courseData?.modules || []).flatMap((mod: any) =>
        (mod.lessons || []).map((lesson: any) => ({
          ...lesson,
          _vid: lesson.youtubeId || getYouTubeId(lesson.videoUrl),
          _start: lesson.youtubeId ? lesson.startSeconds ?? 0 : getYouTubeStart(lesson.videoUrl),
          _end: lesson.endSeconds || 0,
        }))
      ),
    [courseData]
  );
  const lessonById = useMemo(() => new Map(lessons.map((l) => [String(l._id), l])), [lessons]);

  // Chapters finished in this visit show at once, before the server has answered
  const [liveCompleted, setLiveCompleted] = useState<Set<string>>(new Set());
  const [videoStart, setVideoStart] = useState(0);
  const playerRef = useRef<TYouTubePlayerHandle>(null);
  const lastTimeRef = useRef(0);
  const lastSaveRef = useRef(0);
  const activeRef = useRef<any>(null);
  activeRef.current = activeLesson;

  const completedIds = useMemo(() => {
    const ids = new Set<string>((enrollment?.completedLessons || []).map(String));
    liveCompleted.forEach((id) => ids.add(id));
    return ids;
  }, [enrollment, liveCompleted]);

  const progressMutation = useMutation({
    mutationFn: (vars: { lessonId: string; completed?: boolean; playbackPosition?: number }) => saveLessonProgress(courseId, vars),
    onSuccess: (_data, vars) => {
      if (!vars.completed) return;
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
  });

  // The chapters of one video in order, each with the time it ends
  const chaptersOf = (videoId: string) => {
    const list = lessons.filter((l) => l._vid === videoId).sort((x, y) => x._start - y._start);
    return list.map((lesson, i) => ({ lesson, end: lesson._end || list[i + 1]?._start || Infinity }));
  };

  const completeChapter = (lesson: any) => {
    if (!lesson || lesson.isQuiz || !lesson._id) return;
    const id = String(lesson._id);
    setLiveCompleted((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
    if (!completedIds.has(id)) progressMutation.mutate({ lessonId: lesson._id, completed: true });
  };

  // Pick a chapter: the same video jumps to it, another video loads and starts there
  const playLesson = (lesson: any) => {
    const current = activeRef.current;
    setActiveLesson(lesson);
    if (lesson.isQuiz || !lesson._vid) return;
    lastTimeRef.current = lesson._start;
    if (current && !current.isQuiz && current._vid === lesson._vid) {
      playerRef.current?.seekTo(lesson._start);
    } else {
      setVideoStart(lesson._start);
    }
    if (lesson._id) progressMutation.mutate({ lessonId: lesson._id, playbackPosition: lesson._start });
  };

  // Called about once a second while the video plays
  const handleTime = (t: number) => {
    const lesson = activeRef.current;
    if (!lesson?._vid || lesson.isQuiz) return;
    const chapters = chaptersOf(lesson._vid);
    const last = lastTimeRef.current;
    // A chapter counts as watched when playback runs past its end. Skipping around the timeline does not count.
    chapters.forEach(({ lesson: chapter, end }) => {
      if (end !== Infinity && last < end && t >= end && t - last < 5) completeChapter(chapter);
    });
    lastTimeRef.current = t;
    // The highlighted chapter follows the video
    const playing = [...chapters].reverse().find(({ lesson: chapter }) => chapter._start <= t + 0.5)?.lesson;
    if (playing && playing._id !== lesson._id) setActiveLesson(playing);
    // Remember where the learner is, so "Resume" returns here
    const now = Date.now();
    if (playing?._id && now - lastSaveRef.current > 15000) {
      lastSaveRef.current = now;
      saveLessonProgress(courseId, { lessonId: playing._id, playbackPosition: Math.floor(t) }).catch(() => undefined);
    }
  };

  // When a video ends, finish its last chapter and carry on with the next lesson
  const handleState = (state: TPlayerState) => {
    const lesson = activeRef.current;
    if (state !== "ended" || !lesson || lesson.isQuiz) return;
    completeChapter(lesson);
    const next = lessons[lessons.findIndex((l) => l._id === lesson._id) + 1];
    if (next) playLesson(next);
  };

  // Open the chapter the learner stopped at, at the moment they stopped; otherwise the first unfinished one
  useEffect(() => {
    if (activeLesson || !enrollment || lessons.length === 0) return;
    const saved = lessons.find((l) => String(l._id) === String(enrollment.lastAccessedLesson));
    const resume = saved || lessons.find((l) => !completedIds.has(String(l._id))) || lessons[0];
    const position = Number(enrollment.lastPlaybackPosition) || 0;
    const inside = !!saved && position >= resume._start && (!resume._end || position < resume._end);
    setVideoStart(inside ? position : resume._start);
    lastTimeRef.current = inside ? position : resume._start;
    setActiveLesson(resume);
  }, [activeLesson, enrollment, lessons, completedIds]);

  // Keep the playing chapter in view in the list
  useEffect(() => {
    if (activeLesson?._id) document.getElementById(`lesson-${activeLesson._id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeLesson?._id]);

  const activeIndex = lessons.findIndex((l) => l._id === activeLesson?._id);
  const nextLesson = activeIndex >= 0 ? lessons[activeIndex + 1] : undefined;
  const isActiveDone = !!activeLesson && completedIds.has(String(activeLesson._id));


  useEffect(() => {
    if (isError) {
      // If not enrolled or error, redirect to landing page
      router.push(`/courses/${courseId}`);
    }
  }, [isError, courseId, router]);

  if (isError) {
    return null;
  }

  if (isLoading || !courseData) {
    return <div className="p-20 text-center text-[#717480]">Loading course...</div>;
  }

  const { completed: completedCount, total: totalCount, percent: progressPercent } = getCourseProgress({ completedLessons: Array.from(completedIds) }, courseData);
  const isCompleted = totalCount > 0 && completedCount >= totalCount;

  const lessonTitle = activeLesson?.title || "";
  const activeModule = (courseData.modules || []).find((m: any) =>
    (m.lessons || []).some((l: any) => String(l._id) === String(activeLesson?._id)) || (m.quizzes || []).some((q: any) => String(q._id) === String(activeLesson?._id))
  );
  const activeModuleIndex = (courseData.modules || []).findIndex((m: any) => m === activeModule);
  const moduleName = (mod: any) => String(mod?.title || "").replace(/^Module \d+:\s*/, "");
  const prevLesson = activeIndex > 0 ? lessons[activeIndex - 1] : undefined;
  const materials: any[] = activeLesson?.resources || activeLesson?.attachments || courseData.resources || [];
  const TABS = [
    { id: "transcript", label: "Transcript" },
    { id: "notes", label: "Notes" },
    { id: "materials", label: "Course Materials" },
    { id: "review", label: "Review" },
  ];

  return (
    <div className="w-full bg-white text-[#201633]">
      <div className="flex min-h-[calc(100vh-140px)] flex-col lg:flex-row">
        {/* Left: course menu */}
        <aside className={`order-2 w-full shrink-0 border-t border-[#e5e7ef] lg:order-1 lg:border-r lg:border-t-0 ${showMenu ? "lg:w-[320px]" : "lg:w-[64px]"}`}>
          <button
            type="button"
            onClick={() => setShowMenu((v) => !v)}
            className="flex w-full items-center gap-3 px-5 py-5 text-left text-[13px] font-semibold text-[#07004d]"
          >
            <FiMenu className="text-[16px]" />
            {showMenu && "Hide Menu"}
          </button>

          {showMenu && (
            <nav className="px-5 pb-8">
              {(courseData.modules || []).map((mod: any, idx: number) => (
                <div key={mod._id} className="mb-5">
                  <h3 className="mb-3 text-[14px] font-bold leading-snug text-[#07004d]">
                    Module {idx + 1}: {moduleName(mod)}
                  </h3>
                  <ul className="space-y-3">
                    {(mod.lessons || []).map((lesson: any) => {
                      const item = lessonById.get(String(lesson._id)) ?? lesson;
                      const isActive = activeLesson?._id === lesson._id;
                      const done = completedIds.has(String(lesson._id));
                      return (
                        <li key={lesson._id} id={`lesson-${lesson._id}`}>
                          <button
                            type="button"
                            onClick={() => playLesson(item)}
                            className={`flex w-full items-start gap-2.5 text-left text-[13px] leading-snug transition ${isActive ? "font-semibold text-[#07004d]" : "text-[#201633] hover:text-[#07004d]"}`}
                          >
                            {done ? (
                              <FaCheckCircle className="mt-[2px] shrink-0 text-[15px] text-[#22a559]" />
                            ) : (
                              <FaRegCircle className={`mt-[2px] shrink-0 text-[15px] ${isActive ? "text-[#07004d]" : "text-[#6b6e7a]"}`} />
                            )}
                            <span>{lesson.title}</span>
                          </button>
                        </li>
                      );
                    })}
                    {(mod.quizzes || []).map((quiz: any) => {
                      const isActiveQuiz = activeLesson?.isQuiz && activeLesson?._id === quiz._id;
                      return (
                        <li key={quiz._id}>
                          <button
                            type="button"
                            onClick={() => setActiveLesson({ ...quiz, isQuiz: true, moduleId: mod._id, questionsCount: quiz.questions?.length ?? 0 })}
                            className={`flex w-full items-start gap-2.5 text-left text-[13px] leading-snug ${isActiveQuiz ? "font-semibold text-[#07004d]" : "text-[#201633] hover:text-[#07004d]"}`}
                          >
                            <FaRegCircle className="mt-[2px] shrink-0 text-[15px] text-[#6b6e7a]" />
                            <span>{quiz.title || "Quiz"}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <div className="mt-6 space-y-3 text-[14px] font-bold text-[#201633]">
                <p>Summary</p>
                <p>Quiz</p>
              </div>
            </nav>
          )}
        </aside>

        {/* Right: lesson */}
        <section className="order-1 min-w-0 flex-1 bg-[radial-gradient(ellipse_at_bottom_right,#e8f0ff_0%,transparent_55%)] px-5 py-5 sm:px-8 lg:order-2">
          <div className="mx-auto max-w-[760px]">
            <div className="mb-4 flex items-center justify-between gap-3 text-[12px] text-[#4e515c]">
              <p className="min-w-0 truncate">
                <span className="text-[#201633]">{courseData.title}</span>
                <span className="mx-2 text-[#a0a3ae]">/</span>
                <span className="text-[#07004d]">Module {Math.max(activeModuleIndex + 1, 1)}</span>
                <span className="mx-2 text-[#a0a3ae]">›</span>
                <span>{activeLesson?.isQuiz ? "Quiz" : lessonTitle}</span>
              </p>
              <div className="flex shrink-0 items-center gap-4 font-semibold text-[#07004d]">
                <button type="button" disabled={!prevLesson} onClick={() => prevLesson && playLesson(prevLesson)} className="flex items-center gap-1 disabled:opacity-40">
                  <FiChevronLeft /> Previous
                </button>
                <button
                  type="button"
                  disabled={!nextLesson}
                  onClick={() => {
                    if (!nextLesson) return;
                    completeChapter(activeLesson);
                    playLesson(nextLesson);
                  }}
                  className="flex items-center gap-1 disabled:opacity-40"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            </div>

            {/* Video, or the quiz introduction */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-[0_12px_40px_rgba(7,0,77,0.12)]">
              {activeLesson?.isQuiz ? (
                <div className="flex h-full w-full flex-col overflow-y-auto bg-white p-6 sm:p-10">
                  <h2 className="mb-3 text-[22px] font-bold text-[#202127]">Welcome to the {activeLesson.title}</h2>
                  <p className="mb-6 max-w-[620px] text-[14px] leading-relaxed text-[#4e515c]">
                    {activeLesson.description || "This quiz tests your understanding of the concepts in this module. Take your time and good luck!"}
                  </p>
                  <div className="mb-6 flex flex-wrap gap-6 text-[13px] text-[#4e515c]">
                    <span className="flex items-center gap-2"><FiStar className="text-[#07004d]" /> {activeLesson.questionsCount ?? 0} questions</span>
                    <span className="flex items-center gap-2"><FiClock className="text-[#07004d]" /> 15 minutes</span>
                    <span className="flex items-center gap-2"><FiCheckCircle className="text-[#07004d]" /> Pass mark {activeLesson.passingScore ?? 70}%</span>
                  </div>
                  <button
                    onClick={() => router.push(`/learning/${courseId}/quiz/${activeLesson._id}`)}
                    className="h-[44px] w-fit rounded-full bg-[#07004d] px-8 text-[14px] font-semibold text-white transition hover:bg-[#111456]"
                  >
                    Start Quiz
                  </button>
                </div>
              ) : activeLesson?._vid ? (
                <YouTubePlayer
                  ref={playerRef}
                  videoId={activeLesson._vid}
                  startSeconds={videoStart}
                  title={activeLesson.title || "Lesson video"}
                  className="h-full w-full"
                  onTime={handleTime}
                  onStateChange={handleState}
                />
              ) : activeLesson?.videoUrl ? (
                <LessonVideo url={activeLesson.videoUrl} title={activeLesson.title || "Lesson video"} className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-white">
                  <FiPlayCircle className="mb-3 text-[56px] opacity-50" />
                  <p className="text-[15px] font-semibold">Select a lesson to start learning</p>
                </div>
              )}
            </div>

            {/* Title, progress and the few things you can do with the chapter */}
            {activeLesson && !activeLesson.isQuiz && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="truncate text-[14px] font-bold text-[#201633]">{lessonTitle}</h1>
                  <p className="mt-0.5 text-[12px] text-[#717480]">{progressPercent}% of the course complete</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {activeLesson._vid && <FullscreenButton onClick={() => playerRef.current?.toggleFullscreen()} />}
                  <button
                    type="button"
                    onClick={() => completeChapter(activeLesson)}
                    disabled={isActiveDone || progressMutation.isPending}
                    className="h-[36px] rounded-full border border-[#07004d] px-4 text-[12px] font-semibold text-[#07004d] transition hover:bg-[#eef2ff] disabled:cursor-default disabled:border-[#dedee7] disabled:text-[#8a8c95] disabled:hover:bg-transparent"
                  >
                    {isActiveDone ? "Completed" : "Mark as complete"}
                  </button>
                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => router.push(`/learning/${courseId}/completed`)}
                      className="h-[36px] rounded-full bg-[#07004d] px-4 text-[12px] font-semibold text-white transition hover:bg-[#111456]"
                    >
                      Get certificate
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="mt-5 flex items-center gap-6 border-b border-[#e5e7ef] text-[13px]">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-2.5 font-medium transition ${activeTab === tab.id ? "text-[#3d92cf]" : "text-[#201633] hover:text-[#07004d]"}`}
                >
                  {tab.label}
                  {activeTab === tab.id && <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#3d92cf]" />}
                </button>
              ))}
            </div>

            <div className="py-6 text-[13px] leading-[1.7] text-[#201633]">
              {activeTab === "transcript" && (
                <p className="text-[#717480]">{activeLesson?.transcript || "The transcript for this lesson isn't available yet. YouTube's own captions can be turned on from the video's settings."}</p>
              )}

              {activeTab === "notes" && (
                <div>
                  <div className="mb-5 flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write a note for this lesson"
                      className="h-[40px] flex-1 rounded-[8px] border border-[#dedee7] bg-white px-4 outline-none focus:border-[#07004d]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newNoteText.trim()) addNoteMutation.mutate(newNoteText);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => newNoteText.trim() && addNoteMutation.mutate(newNoteText)}
                      disabled={addNoteMutation.isPending}
                      className="h-[40px] rounded-[8px] bg-[#07004d] px-5 text-[12px] font-semibold text-white disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                  {(notes || []).length === 0 ? (
                    <p className="text-[#717480]">No notes yet. Notes you save here are private to you.</p>
                  ) : (
                    <ul className="space-y-3">
                      {(notes || []).map((note: any) => (
                        <li key={note._id} className="rounded-[10px] bg-white/80 p-4 ring-1 ring-[#e5e7ef]">
                          <p className="whitespace-pre-wrap">{note.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === "materials" && (
                <div>
                  <p className="mb-3 font-medium">Attached Materials</p>
                  {materials.length === 0 ? (
                    <p className="text-[#717480]">There are no attached materials for this lesson.</p>
                  ) : (
                    <ul className="space-y-3">
                      {materials.map((file: any, i: number) => (
                        <li key={file._id || i}>
                          <a
                            href={file.url || file.fileUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-3 rounded-[10px] bg-white/80 px-4 py-3 ring-1 ring-[#e5e7ef] transition hover:ring-[#07004d]"
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <FiFileText className="shrink-0 text-[#07004d]" />
                              <span className="truncate">{file.name || file.title || "Course material"}</span>
                            </span>
                            <FiDownload className="shrink-0 text-[#07004d]" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === "review" && (
                <div>
                  <p className="mb-2 font-medium">{courseData.level ? `${String(courseData.level).charAt(0).toUpperCase()}${String(courseData.level).slice(1)} level` : "About this course"}</p>
                  <p className="whitespace-pre-wrap text-[#4e515c]">{String(courseData.description || "").replace(/<[^>]+>/g, "")}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
