"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiStar, FiClock, FiCheckCircle, FiPlayCircle, FiChevronLeft, FiChevronRight, FiMenu, FiDownload, FiFileText, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import LessonVideo, { getYouTubeId } from "@components/LessonVideo";
import YouTubePlayer, { TPlayerState, TYouTubePlayerHandle } from "@components/YouTubePlayer";
import { formatTimestamp, getYouTubeStart } from "@utils/youtube";
import FullscreenButton from "@components/FullscreenButton";
import { getMyEnrollment, getCourseProgress, getModuleGates, getModuleProgress, saveLessonProgress } from "@services/enrollments";
import ModuleTask from "./ModuleTask";

const isLearnerVisibleQuiz = (quiz: any) => {
  const status = String(quiz?.status || "").toLowerCase();
  return quiz?.isDraft !== true && quiz?.isPublished !== false && !["draft", "pending", "rejected"].includes(status);
};

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


  // Courses that go module by module (the free catalogue): the server says which modules are open
  const strict = Boolean(courseData?.sequentialModules);
  const { data: gates } = useQuery({
    queryKey: ["module-gates", courseId],
    queryFn: () => getModuleGates(courseId),
    enabled: !!courseId && strict,
  });
  const gateByModule = useMemo(() => new Map((gates || []).map((gate) => [gate.moduleId, gate])), [gates]);

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
      queryClient.invalidateQueries({ queryKey: ["module-gates", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
    onError: (error: any) => {
      // The server keeps locked modules shut even if the page is out of date
      if (error?.response?.data?.code === "MODULE_LOCKED") {
        toast.info(error.response.data.error);
        queryClient.invalidateQueries({ queryKey: ["module-gates", courseId] });
      }
    },
  });

  // The chapters of one video in order, each with the time it ends
  const chaptersOf = (videoId: string) => {
    const list = lessons.filter((l) => l._vid === videoId).sort((x, y) => x._start - y._start);
    return list.map((lesson, i) => ({ lesson, end: lesson._end || list[i + 1]?._start || Infinity }));
  };

  const completeChapter = (lesson: any) => {
    if (!lesson || lesson.isQuiz || lesson.isTask || !lesson._id) return;
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
    if (current && !current.isQuiz && !current.isTask && current._vid === lesson._vid) {
      playerRef.current?.seekTo(lesson._start);
    } else {
      setVideoStart(lesson._start);
    }
    if (lesson._id) progressMutation.mutate({ lessonId: lesson._id, playbackPosition: lesson._start });
  };

  // Called about once a second while the video plays
  const handleTime = (t: number) => {
    const lesson = activeRef.current;
    if (!lesson?._vid || lesson.isQuiz || lesson.isTask) return;
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

  // The course in the order a learner takes it: each module's lessons, then its quiz, then its task
  type TStep = { kind: "lesson" | "quiz" | "task"; moduleIndex: number; mod: any; lesson?: any; quiz?: any };
  const modules: any[] = courseData?.modules || [];
  const steps: TStep[] = useMemo(
    () =>
      modules.flatMap((mod: any, moduleIndex: number) => [
        ...(mod.lessons || []).map((lesson: any) => ({ kind: "lesson" as const, moduleIndex, mod, lesson: lessonById.get(String(lesson._id)) ?? lesson })),
        ...(mod.quizzes || []).filter(isLearnerVisibleQuiz).map((quiz: any) => ({ kind: "quiz" as const, moduleIndex, mod, quiz })),
        ...(strict && mod.task ? [{ kind: "task" as const, moduleIndex, mod }] : []),
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [courseData, lessonById, strict]
  );

  const toItem = (step: TStep) =>
    step.kind === "lesson"
      ? step.lesson
      : step.kind === "quiz"
        ? { ...step.quiz, isQuiz: true, moduleId: step.mod._id, questionsCount: step.quiz.questions?.length ?? 0 }
        : { _id: `task-${step.mod._id}`, isTask: true, moduleId: step.mod._id, title: step.mod.task?.title };

  const stepIndexOf = (item: any) =>
    steps.findIndex((step) =>
      item?.isTask
        ? step.kind === "task" && String(step.mod._id) === String(item.moduleId)
        : item?.isQuiz
          ? step.kind === "quiz" && String(step.quiz._id) === String(item._id)
          : step.kind === "lesson" && String(step.lesson._id) === String(item?._id)
    );

  // What is open. The server decides for real; this only keeps the page from offering what it would refuse.
  const moduleOpen = (mod: any) => !strict || gateByModule.get(String(mod._id))?.unlocked !== false;
  const lessonsFinished = (mod: any, done: Set<string>) => (mod.lessons || []).every((lesson: any) => done.has(String(lesson._id)));
  const quizOpen = (mod: any, done: Set<string>) => moduleOpen(mod) && (!strict || lessonsFinished(mod, done));
  const taskOpen = (mod: any, done: Set<string>) => {
    const quiz = gateByModule.get(String(mod._id))?.quiz;
    return quizOpen(mod, done) && (!quiz || quiz.passed);
  };
  const canEnter = (step: TStep, done: Set<string>) =>
    step.kind === "lesson" ? moduleOpen(step.mod) : step.kind === "quiz" ? quizOpen(step.mod, done) : taskOpen(step.mod, done);
  const whyLocked = (step: TStep, done: Set<string>) => {
    if (!moduleOpen(step.mod)) return `Finish the quiz and task of Module ${step.moduleIndex} to open Module ${step.moduleIndex + 1}.`;
    if (!lessonsFinished(step.mod, done)) return `Finish every lesson in Module ${step.moduleIndex + 1} to unlock its ${step.kind}.`;
    return "Pass the module quiz to unlock the task.";
  };

  const goTo = (step: TStep, done: Set<string> = completedIds) => {
    if (!canEnter(step, done)) {
      toast.info(whyLocked(step, done));
      return;
    }
    if (step.kind === "lesson") playLesson(step.lesson);
    else setActiveLesson(toItem(step));
  };

  // When a video ends, finish its last chapter and carry on. After the last lesson of a module the quiz opens.
  const handleState = (state: TPlayerState) => {
    const lesson = activeRef.current;
    if (state !== "ended" || !lesson || lesson.isQuiz || lesson.isTask) return;
    completeChapter(lesson);
    const next = steps[stepIndexOf(lesson) + 1];
    if (!next) return;
    const done = new Set(completedIds).add(String(lesson._id));
    if (canEnter(next, done)) goTo(next, done);
  };

  // Open where the learner left off. On a module-by-module course that can be a quiz or a task waiting to be done.
  useEffect(() => {
    if (activeLesson || !enrollment || steps.length === 0) return;
    if (strict && !gates) return;

    const wanted = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("item") : null;
    if (wanted) {
      const [kind, key] = wanted.split(":");
      const step = steps.find((s) => (kind === "task" ? s.kind === "task" && String(s.mod._id) === key : kind === "quiz" && s.kind === "quiz" && String(s.quiz._id) === key));
      if (step) {
        setActiveLesson(toItem(step));
        return;
      }
    }
    const current = strict ? gates?.find((gate) => !gate.complete) : undefined;
    if (current && (current.stage === "quiz" || current.stage === "task")) {
      const step = steps.find((s) => s.kind === current.stage && String(s.mod._id) === current.moduleId);
      if (step) {
        setActiveLesson(toItem(step));
        return;
      }
    }

    const saved = lessons.find((l) => String(l._id) === String(enrollment.lastAccessedLesson));
    const resume = saved || lessons.find((l) => !completedIds.has(String(l._id))) || lessons[0];
    if (!resume) return;
    const position = Number(enrollment.lastPlaybackPosition) || 0;
    const inside = !!saved && position >= resume._start && (!resume._end || position < resume._end);
    setVideoStart(inside ? position : resume._start);
    lastTimeRef.current = inside ? position : resume._start;
    setActiveLesson(resume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLesson, enrollment, lessons, completedIds, steps, gates, strict]);

  // Keep the playing chapter in view in the list
  useEffect(() => {
    if (activeLesson?._id) document.getElementById(`lesson-${activeLesson._id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeLesson?._id]);

  const activeStepIndex = stepIndexOf(activeLesson);
  const nextStep = activeStepIndex >= 0 ? steps[activeStepIndex + 1] : undefined;
  const prevStep = activeStepIndex > 0 ? steps[activeStepIndex - 1] : undefined;
  const isLessonActive = !!activeLesson && !activeLesson.isQuiz && !activeLesson.isTask;
  const isActiveDone = isLessonActive && completedIds.has(String(activeLesson._id));
  // Pressing Next on a lesson finishes it, which can be what opens the quiz
  const doneWithActive = new Set(completedIds);
  if (isLessonActive && activeLesson._id) doneWithActive.add(String(activeLesson._id));


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

  const { completed: completedCount, total: totalCount, percent: progressPercent } = strict
    ? getModuleProgress(courseData, completedIds, gates)
    : getCourseProgress({ completedLessons: Array.from(completedIds) }, courseData);
  const isCompleted = strict
    ? Boolean(enrollment?.isCompleted) || (!!gates?.length && gates.every((gate) => gate.complete))
    : totalCount > 0 && completedCount >= totalCount;

  const lessonTitle = activeLesson?.title || "";
  const activeModule = (courseData.modules || []).find((m: any) =>
    (activeLesson?.isTask && String(m._id) === String(activeLesson.moduleId)) ||
    (m.lessons || []).some((l: any) => String(l._id) === String(activeLesson?._id)) ||
    (m.quizzes || []).some((q: any) => String(q._id) === String(activeLesson?._id))
  );
  const activeModuleIndex = (courseData.modules || []).findIndex((m: any) => m === activeModule);
  const moduleName = (mod: any) => String(mod?.title || "").replace(/^Module \d+:\s*/, "");
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
              {(courseData.modules || []).map((mod: any, idx: number) => {
                const gate = gateByModule.get(String(mod._id));
                const open = moduleOpen(mod);
                const quizzes = (mod.quizzes || []).filter(isLearnerVisibleQuiz);
                const quizReady = quizOpen(mod, completedIds);
                const taskReady = taskOpen(mod, completedIds);
                return (
                  <div key={mod._id} className="mb-5">
                    <h3 className="mb-3 flex items-start gap-2 text-[14px] font-bold leading-snug text-[#07004d]">
                      <span className="min-w-0">Module {idx + 1}: {moduleName(mod)}</span>
                      {strict && gate?.complete && <FaCheckCircle className="mt-[3px] shrink-0 text-[14px] text-[#22a559]" aria-label="Module complete" />}
                      {strict && !open && <FiLock className="mt-[3px] shrink-0 text-[14px] text-[#8a8c95]" aria-label="Locked" />}
                    </h3>
                    <ul className="space-y-3">
                      {(mod.lessons || []).map((lesson: any) => {
                        const item = lessonById.get(String(lesson._id)) ?? lesson;
                        const isActive = isLessonActive && activeLesson?._id === lesson._id;
                        const done = completedIds.has(String(lesson._id));
                        return (
                          <li key={lesson._id} id={`lesson-${lesson._id}`}>
                            <button
                              type="button"
                              onClick={() => goTo({ kind: "lesson", moduleIndex: idx, mod, lesson: item })}
                              className={`flex w-full items-start gap-2.5 text-left text-[13px] leading-snug transition ${!open ? "text-[#8a8c95]" : isActive ? "font-semibold text-[#07004d]" : "text-[#201633] hover:text-[#07004d]"}`}
                            >
                              {done ? (
                                <FaCheckCircle className="mt-[2px] shrink-0 text-[15px] text-[#22a559]" />
                              ) : !open ? (
                                <FiLock className="mt-[2px] shrink-0 text-[15px]" />
                              ) : (
                                <FaRegCircle className={`mt-[2px] shrink-0 text-[15px] ${isActive ? "text-[#07004d]" : "text-[#6b6e7a]"}`} />
                              )}
                              <span>{lesson.title}</span>
                            </button>
                          </li>
                        );
                      })}
                      {quizzes.map((quiz: any) => {
                        const isActiveQuiz = activeLesson?.isQuiz && activeLesson?._id === quiz._id;
                        const passed = strict && gate?.quiz?.passed;
                        return (
                          <li key={quiz._id}>
                            <button
                              type="button"
                              onClick={() => goTo({ kind: "quiz", moduleIndex: idx, mod, quiz })}
                              className={`flex w-full items-start gap-2.5 text-left text-[13px] leading-snug ${!quizReady ? "text-[#8a8c95]" : isActiveQuiz ? "font-semibold text-[#07004d]" : "text-[#201633] hover:text-[#07004d]"}`}
                            >
                              {passed ? (
                                <FaCheckCircle className="mt-[2px] shrink-0 text-[15px] text-[#22a559]" />
                              ) : !quizReady ? (
                                <FiLock className="mt-[2px] shrink-0 text-[15px]" />
                              ) : (
                                <FaRegCircle className="mt-[2px] shrink-0 text-[15px] text-[#6b6e7a]" />
                              )}
                              <span>
                                {quiz.title || "Quiz"}
                                {strict && gate?.quiz?.bestScore != null && <span className="ml-1 text-[11px] font-normal text-[#717480]">(best {gate.quiz.bestScore}%)</span>}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                      {strict && mod.task && (
                        <li>
                          <button
                            type="button"
                            onClick={() => goTo({ kind: "task", moduleIndex: idx, mod })}
                            className={`flex w-full items-start gap-2.5 text-left text-[13px] leading-snug ${!taskReady ? "text-[#8a8c95]" : activeLesson?.isTask && String(activeLesson.moduleId) === String(mod._id) ? "font-semibold text-[#07004d]" : "text-[#201633] hover:text-[#07004d]"}`}
                          >
                            {gate?.task?.submitted ? (
                              <FaCheckCircle className="mt-[2px] shrink-0 text-[15px] text-[#22a559]" />
                            ) : !taskReady ? (
                              <FiLock className="mt-[2px] shrink-0 text-[15px]" />
                            ) : (
                              <FaRegCircle className="mt-[2px] shrink-0 text-[15px] text-[#6b6e7a]" />
                            )}
                            <span>Module task</span>
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
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
                <span>{activeLesson?.isQuiz ? "Quiz" : activeLesson?.isTask ? "Task" : lessonTitle}</span>
              </p>
              <div className="flex shrink-0 items-center gap-4 font-semibold text-[#07004d]">
                <button type="button" disabled={!prevStep} onClick={() => prevStep && goTo(prevStep)} className="flex items-center gap-1 disabled:opacity-40">
                  <FiChevronLeft /> Previous
                </button>
                <button
                  type="button"
                  disabled={!nextStep}
                  onClick={() => {
                    if (!nextStep) return;
                    if (isLessonActive) completeChapter(activeLesson);
                    goTo(nextStep, doneWithActive);
                  }}
                  className="flex items-center gap-1 disabled:opacity-40"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            </div>

            {/* The module task, the quiz introduction, or the video */}
            {activeLesson?.isTask ? (
              <ModuleTask
                key={activeLesson.moduleId}
                courseId={courseId}
                moduleId={String(activeLesson.moduleId)}
                moduleNumber={Math.max(activeModuleIndex + 1, 1)}
                nextModuleNumber={activeModuleIndex + 1 < (courseData.modules || []).length ? activeModuleIndex + 2 : null}
                onContinue={() => {
                  const nextModule = (courseData.modules || [])[activeModuleIndex + 1];
                  const first = nextModule ? steps.find((step) => step.kind === "lesson" && step.mod === nextModule) : undefined;
                  if (first) goTo(first, completedIds);
                  else router.push(`/learning/${courseId}/completed`);
                }}
              />
            ) : activeLesson?.isQuiz ? (
              <div className="rounded-2xl border border-[#e5e7ef] bg-white p-5 shadow-[0_8px_30px_rgba(7,0,77,0.06)] sm:p-8">
                {(() => {
                  const gate = activeModule ? gateByModule.get(String(activeModule._id)) : undefined;
                  const ready = !activeModule || quizOpen(activeModule, completedIds);
                  const lessonsLeft = activeModule ? (activeModule.lessons || []).filter((l: any) => !completedIds.has(String(l._id))).length : 0;
                  return (
                    <>
                      <p className="text-[12px] font-bold uppercase tracking-wider text-[#2563eb]">Module {Math.max(activeModuleIndex + 1, 1)} quiz</p>
                      <h2 className="mt-1 mb-3 text-[22px] font-bold text-[#202127]">{activeLesson.title}</h2>
                      <p className="mb-6 max-w-[620px] text-[14px] leading-relaxed text-[#4e515c]">
                        {activeLesson.description || "Check what you learned in this module. You can retake the quiz as many times as you need."}
                      </p>
                      <div className="mb-6 flex flex-wrap gap-6 text-[13px] text-[#4e515c]">
                        <span className="flex items-center gap-2"><FiStar className="text-[#07004d]" /> {activeLesson.questionsCount ?? 0} questions</span>
                        <span className="flex items-center gap-2"><FiClock className="text-[#07004d]" /> No time limit</span>
                        <span className="flex items-center gap-2"><FiCheckCircle className="text-[#07004d]" /> Pass mark {activeLesson.passingScore ?? 70}%</span>
                        {strict && gate?.quiz?.bestScore != null && <span className="flex items-center gap-2 font-semibold text-[#15803d]">Best score {gate.quiz.bestScore}%</span>}
                      </div>
                      {ready ? (
                        <button
                          onClick={() => router.push(`/learning/${courseId}/quiz/${activeLesson._id}`)}
                          className="h-[44px] w-fit rounded-full bg-[#07004d] px-8 text-[14px] font-semibold text-white transition hover:bg-[#111456]"
                        >
                          {gate?.quiz?.attempts ? "Retake quiz" : "Start quiz"}
                        </button>
                      ) : (
                        <p className="rounded-xl bg-[#f4f5fa] p-4 text-[13px] text-[#4e515c]">
                          {lessonsLeft > 0 ? `Finish the ${lessonsLeft} remaining ${lessonsLeft === 1 ? "lesson" : "lessons"} in this module to unlock the quiz.` : "Finish the previous module to unlock this quiz."}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-[0_12px_40px_rgba(7,0,77,0.12)]">
              {activeLesson?._vid ? (
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
            )}

            {/* Title, progress and the few things you can do with the chapter */}
            {activeLesson && !activeLesson.isQuiz && !activeLesson.isTask && (
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
            {!activeLesson?.isQuiz && !activeLesson?.isTask && (
            <>
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
            </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
