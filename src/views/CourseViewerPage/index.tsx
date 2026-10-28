"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiChevronLeft, FiStar, FiClock, FiCheckCircle, FiPlayCircle, FiSearch, FiChevronDown, FiPlus, FiMoreVertical, FiChevronUp } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import LessonVideo, { getYouTubeId } from "@components/LessonVideo";
import YouTubePlayer, { TPlayerState, TYouTubePlayerHandle } from "@components/YouTubePlayer";
import { formatTimestamp, getYouTubeStart } from "@utils/youtube";
import { getMyEnrollment, getCourseProgress, saveLessonProgress } from "@services/enrollments";

export default function CourseViewerPage() {
  const { id: courseId } = useParams<{ id: string }>()!;
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [activeLesson, setActiveLesson] = useState<any>(null);
  
  const [newQuestionText, setNewQuestionText] = useState("");
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

  const { data: questions } = useQuery({
    queryKey: ["course.questions", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/learning/${courseId}/questions`);
      return res.data;
    },
    enabled: !!courseId && activeTab === 'q&a'
  });

  const { data: notes } = useQuery({
    queryKey: ["course.notes", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/learning/${courseId}/notes`);
      return res.data;
    },
    enabled: !!courseId && activeTab === 'notes'
  });

  const { data: announcements } = useQuery({
    queryKey: ["course.announcements", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/learning/${courseId}/announcements`);
      return res.data;
    },
    enabled: !!courseId && activeTab === 'announcements'
  });

  const askQuestionMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await axiosInstance.post(`/learning/${courseId}/questions`, {
        title: text.substring(0, 50),
        text,
        lectureId: activeLesson?._id
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course.questions", courseId] });
      setNewQuestionText("");
    }
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

  const toggleModule = (modId: string, isOpen: boolean) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !isOpen }));
  };

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

  return (
    <div className="w-full h-screen bg-[#f8fafc] flex flex-col text-[#202127] overflow-hidden">
      
      {/* Header */}
      <header className="h-[64px] bg-white border-b border-[#dedee7] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/dashboard/courses")} className="flex items-center gap-2 text-[#4e515c] hover:text-[#07006f] transition-colors font-bold text-[14px]">
            <FiChevronLeft className="text-[20px]" /> Back
          </button>
          <div className="h-6 w-[1px] bg-[#dedee7]"></div>
          <h1 className="font-bold text-[16px] truncate max-w-[400px]">{courseData.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[12px] font-bold text-[#07006f]">{progressPercent}% Completed</span>
            <div className="w-[120px] h-[4px] bg-[#eef2ff] rounded-full mt-1">
              <div className="h-full bg-[#07006f] rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          {isCompleted && (
            <button 
              onClick={() => router.push(`/learning/${courseId}/completed`)}
              className="px-4 py-2 bg-[#07006f] text-white rounded-[6px] text-[13px] font-bold ml-4"
            >
              Get Certificate
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Area - Video Player/Quiz Intro & Tabs */}
        <div className="flex-1 flex flex-col bg-[#fcfcfd] overflow-y-auto">
          {/* Main Content Viewer (Video or Quiz) */}
          <div className="w-full bg-black aspect-video relative flex flex-col justify-center items-center group shrink-0 border-b border-[#dedee7]">
            {activeLesson?.isQuiz ? (
              <div className="w-full h-full bg-white flex flex-col p-12 overflow-y-auto">
                <h2 className="text-[28px] font-bold text-[#202127] mb-6">Welcome to the {activeLesson.title}</h2>
                <p className="text-[15px] text-[#4e515c] mb-12 leading-relaxed max-w-[800px]">
                  {activeLesson.description || "This quiz is designed to test your understanding of the concepts covered in this module. Take your time and good luck!"}
                </p>

                <h3 className="text-[18px] font-bold text-[#202127] mb-6">Quiz Details</h3>
                <div className="flex flex-wrap gap-8 mb-12">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#07006f] text-[20px]">
                      <FiStar />
                    </div>
                    <div>
                      <div className="text-[12px] text-[#717480] uppercase tracking-wider font-bold mb-1">Questions</div>
                      <div className="text-[16px] font-bold text-[#202127]">{activeLesson.questionsCount ?? 0} Questions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#07006f] text-[20px]">
                      <FiClock />
                    </div>
                    <div>
                      <div className="text-[12px] text-[#717480] uppercase tracking-wider font-bold mb-1">Time Limit</div>
                      <div className="text-[16px] font-bold text-[#202127]">15 Minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#07006f] text-[20px]">
                      <FiCheckCircle />
                    </div>
                    <div>
                      <div className="text-[12px] text-[#717480] uppercase tracking-wider font-bold mb-1">Passing Score</div>
                      <div className="text-[16px] font-bold text-[#202127]">{activeLesson.passingScore ?? 70}%</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => router.push(`/learning/${courseId}/quiz/${activeLesson._id}`)}
                  className="w-fit px-8 h-[52px] bg-[#07006f] text-white rounded-[8px] font-bold text-[15px] hover:bg-[#0a0050] transition-colors"
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
              <LessonVideo
                url={activeLesson.videoUrl}
                title={activeLesson.title || "Lesson video"}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-white text-center">
                <FiPlayCircle className="text-[64px] mb-4 mx-auto opacity-50" />
                <p className="text-[16px] font-bold">Select a lesson to start learning</p>
              </div>
            )}
          </div>

          {/* Lesson toolbar: finish this lesson, or finish it and move on */}
          {activeLesson && !activeLesson.isQuiz && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dedee7] bg-white px-6 py-4">
              <p className="line-clamp-1 text-[14px] font-bold text-[#202127]">{activeLesson.title}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => completeChapter(activeLesson)}
                  disabled={isActiveDone || progressMutation.isPending}
                  className="h-[38px] rounded-[8px] border border-[#07006f] px-4 text-[13px] font-bold text-[#07006f] transition-colors hover:bg-[#eef2ff] disabled:cursor-default disabled:border-[#dedee7] disabled:text-[#8a8c95] disabled:hover:bg-transparent"
                >
                  {isActiveDone ? "Completed" : "Mark as complete"}
                </button>
                {nextLesson && (
                  <button
                    type="button"
                    onClick={() => { completeChapter(activeLesson); playLesson(nextLesson); }}
                    disabled={progressMutation.isPending}
                    className="h-[38px] rounded-[8px] bg-[#07006f] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#0a0050] disabled:opacity-60"
                  >
                    {isActiveDone ? "Next lesson" : "Complete and continue"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content Tabs */}
          <div className="flex-1 w-full max-w-[900px] mx-auto px-8 py-8">
            <div className="flex items-center gap-8 border-b border-[#dedee7] mb-8">
              {['overview', 'q&a', 'notes', 'announcements', 'reviews'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[14px] font-bold capitalize relative ${activeTab === tab ? 'text-[#07006f]' : 'text-[#717480] hover:text-[#4e515c]'}`}
                >
                  {tab === 'q&a' ? 'Q&A' : tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#07006f]"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="text-[14px] text-[#4e515c]">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2">
                    <h2 className="text-[20px] font-bold text-[#202127] mb-4">About this course</h2>
                    <p className="leading-relaxed mb-6 whitespace-pre-wrap">{courseData.description}</p>
                    <h3 className="text-[16px] font-bold text-[#202127] mb-4">What you'll learn</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {(courseData.learningOutcomes || ['Understand core concepts', 'Build real-world projects', 'Master advanced techniques', 'Gain industry insights']).map((outcome: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <FiCheckCircle className="text-[#07006f] mt-1 shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#202127] mb-4">By the numbers</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-[#dedee7] pb-2">
                        <span className="text-[#717480]">Skill level:</span>
                        <span className="font-medium text-[#202127] capitalize">{courseData.level || 'All Levels'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#dedee7] pb-2">
                        <span className="text-[#717480]">Students:</span>
                        <span className="font-medium text-[#202127]">{courseData.studentsEnrolled || 0}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#dedee7] pb-2">
                        <span className="text-[#717480]">Languages:</span>
                        <span className="font-medium text-[#202127]">English</span>
                      </div>
                      <div className="flex justify-between border-b border-[#dedee7] pb-2">
                        <span className="text-[#717480]">Lectures:</span>
                        <span className="font-medium text-[#202127]">{totalCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Q&A TAB */}
              {activeTab === 'q&a' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-full max-w-[400px]">
                        <input type="text" placeholder="Search all course questions" className="w-full h-[42px] border border-[#dedee7] rounded-[8px] pl-10 pr-4 outline-none focus:border-[#07006f]" />
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aab8]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="h-[42px] px-4 border border-[#dedee7] rounded-[8px] font-bold text-[13px] flex items-center gap-2 hover:bg-[#f8fafc]">
                          All lectures <FiChevronDown />
                        </button>
                        <button className="h-[42px] px-4 border border-[#dedee7] rounded-[8px] font-bold text-[13px] flex items-center gap-2 hover:bg-[#f8fafc]">
                          Sort by most recent <FiChevronDown />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Q&A List Mock */}
                  <div className="space-y-6">
                    {(questions || []).map((q: any) => (
                      <div key={q._id} className="flex gap-4">
                        <div className="w-10 h-10 bg-[#eef2ff] text-[#07006f] font-bold flex items-center justify-center rounded-full shrink-0">
                          {q.user?.firstName?.[0]}{q.user?.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[15px] text-[#202127]">{q.title}</h4>
                          <p className="text-[13px] mt-1 mb-2">{q.text}</p>
                          <div className="flex items-center gap-4 text-[12px] text-[#717480]">
                            <span>{q.user?.firstName} {q.user?.lastName} • {new Date(q.createdAt).toLocaleDateString()}</span>
                            <button className="text-[#07006f] font-bold hover:underline">{q.replies?.length || 0} Replies</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {questions?.length === 0 && <div className="text-center py-10 text-[#a0aab8]">No questions asked yet.</div>}
                  </div>

                  <div className="mt-8 relative">
                    <input 
                      type="text" 
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Ask a new question..."
                      className="w-full py-4 pl-4 pr-32 border-2 border-dashed border-[#dedee7] rounded-[8px] outline-none focus:border-[#07006f] transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newQuestionText.trim()) askQuestionMutation.mutate(newQuestionText);
                      }}
                    />
                    <button 
                      onClick={() => newQuestionText.trim() && askQuestionMutation.mutate(newQuestionText)}
                      disabled={askQuestionMutation.isPending}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#07006f] text-white font-bold text-[13px] rounded-[6px] hover:bg-[#0a0050] disabled:opacity-50"
                    >
                      Post Question
                    </button>
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <div>
                  <div className="flex gap-4 mb-8">
                    <button className="px-4 py-2 bg-black text-white font-bold text-[13px] rounded-[6px] flex items-center gap-2 shrink-0">
                      0:00 <FiPlus />
                    </button>
                    <input 
                      type="text" 
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Create a new note at 0:00" 
                      className="flex-1 h-[42px] border border-[#dedee7] rounded-[8px] px-4 outline-none focus:border-[#07006f]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newNoteText.trim()) addNoteMutation.mutate(newNoteText);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    {(notes || []).map((note: any) => (
                      <div key={note._id} className="flex gap-4 p-4 bg-[#f8fafc] rounded-[12px]">
                        <span className="px-3 py-1 bg-[#eef2ff] text-[#07006f] font-bold text-[12px] rounded-[4px] h-fit">{note.timestamp}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-[14px] text-[#202127] whitespace-pre-wrap">{note.text}</p>
                            <div className="flex gap-2">
                              <button className="text-[#a0aab8] hover:text-[#202127]"><FiMoreVertical /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {notes?.length === 0 && <div className="text-center py-10 text-[#a0aab8]">No notes yet. Create your first note!</div>}
                  </div>
                </div>
              )}

              {/* ANNOUNCEMENTS TAB */}
              {activeTab === 'announcements' && (
                <div className="space-y-8">
                  {(announcements || []).map((ann: any) => (
                    <div key={ann._id} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#07006f] text-white flex items-center justify-center font-bold">
                        {ann.instructor?.firstName?.[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#202127]">{ann.instructor?.firstName} {ann.instructor?.lastName}</span>
                          <span className="text-[12px] text-[#717480]">{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-[16px] text-[#202127] mb-2">{ann.title}</h4>
                        <p className="leading-relaxed">{ann.text}</p>
                      </div>
                    </div>
                  ))}
                  {announcements?.length === 0 && <div className="text-center py-10 text-[#a0aab8]">No announcements yet.</div>}
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-[20px] font-bold text-[#202127] mb-8">Student feedback</h2>
                  <div className="flex gap-12 mb-12 items-center">
                    <div className="text-center shrink-0">
                      <div className="text-[64px] font-bold text-[#202127] leading-none">4.8</div>
                      <div className="flex text-[#f59e0b] text-[18px] justify-center mt-2 mb-1">
                        <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                      </div>
                      <div className="text-[14px] font-bold text-[#07006f]">Course Rating</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[
                        { stars: 5, pct: 75 },
                        { stars: 4, pct: 20 },
                        { stars: 3, pct: 5 },
                        { stars: 2, pct: 0 },
                        { stars: 1, pct: 0 }
                      ].map(r => (
                        <div key={r.stars} className="flex items-center gap-4">
                          <div className="w-[120px] flex items-center justify-end text-[#f59e0b]">
                            {Array(r.stars).fill(0).map((_, i) => <FiStar key={i} className="fill-current" />)}
                          </div>
                          <div className="flex-1 h-[8px] bg-[#e2e8f0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#07006f]" style={{ width: `${r.pct}%` }}></div>
                          </div>
                          <div className="w-[40px] text-[13px] text-[#717480]">{r.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="border border-[#dedee7] rounded-[12px] p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">AS</div>
                          <div>
                            <div className="font-bold text-[#202127]">Alex Student</div>
                            <div className="flex items-center gap-2">
                              <div className="flex text-[#f59e0b] text-[12px]">
                                <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
                              </div>
                              <span className="text-[12px] text-[#717480]">2 days ago</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[14px] leading-relaxed">This course completely changed my perspective on web development. The instructor explains things very clearly and the projects are super helpful!</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Sidebar - Syllabus */}
        <div className="w-[380px] bg-white border-l border-[#dedee7] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-[#dedee7] flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="font-bold text-[16px]">Course Content</h2>
          </div>

          <div className="flex-1">
            {(courseData.modules || []).map((mod: any, idx: number) => {
              const isExpanded = expandedModules[mod._id] ?? (mod.lessons || []).some((l: any) => String(l._id) === String(activeLesson?._id));
              return (
                <div key={mod._id} className="border-b border-[#dedee7]">
                  <button 
                    onClick={() => toggleModule(mod._id, isExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors text-left"
                  >
                    <div>
                      <h3 className="font-bold text-[14px] text-[#202127] line-clamp-1">Section {idx + 1}: {mod.title}</h3>
                      <p className="text-[12px] text-[#717480] mt-1">
                        {(mod.lessons || []).filter((l: any) => completedIds.has(String(l._id))).length} / {mod.lessons?.length || 0} lessons
                      </p>
                    </div>
                    {isExpanded ? <FiChevronUp className="text-[#a0aab8]" /> : <FiChevronDown className="text-[#a0aab8]" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="bg-white">
                      {(mod.lessons || []).map((lesson: any, lIdx: number) => {
                        const item = lessonById.get(String(lesson._id)) ?? lesson;
                        const isActive = activeLesson?._id === lesson._id;
                        const isLessonCompleted = completedIds.has(String(lesson._id));
                        
                        return (
                          <button 
                            key={lesson._id}
                            id={`lesson-${lesson._id}`}
                            onClick={() => playLesson(item)}
                            className={`w-full flex items-start gap-3 p-4 hover:bg-[#f8fafc] transition-colors text-left ${isActive ? 'bg-[#eef2ff]' : ''}`}
                          >
                            <div className="mt-1 flex-shrink-0">
                              <input 
                                type="checkbox" 
                                checked={isLessonCompleted} 
                                readOnly
                                className="w-4 h-4 rounded border-[#dedee7] accent-[#07006f] cursor-pointer"
                              />
                            </div>
                            <div className="flex-1">
                              <p className={`text-[14px] leading-tight mb-1 ${isActive ? 'font-bold text-[#07006f]' : 'text-[#202127]'}`}>{lIdx + 1}. {lesson.title}</p>
                              <div className="flex items-center gap-2 text-[12px] text-[#717480]">
                                <FiPlayCircle /> {item._vid ? `${formatTimestamp(item._start)} · ${lesson.duration || ""}` : lesson.duration || "Video"}
                              </div>
                            </div>
                          </button>
                        );
                      })}

                      {(mod.quizzes || []).map((quiz: any) => {
                        const isActiveQuiz = activeLesson?.isQuiz && activeLesson?._id === quiz._id;
                        return (
                          <button
                            key={quiz._id}
                            type="button"
                            onClick={() => setActiveLesson({ ...quiz, isQuiz: true, moduleId: mod._id, questionsCount: quiz.questions?.length ?? 0 })}
                            className={`w-full flex items-start gap-3 p-4 hover:bg-[#f8fafc] transition-colors text-left border-t border-[#dedee7] ${isActiveQuiz ? "bg-[#eef2ff]" : ""}`}
                          >
                            <div className="mt-1 flex-shrink-0 text-[#07006f]">
                              <FiStar />
                            </div>
                            <div className="flex-1">
                              <p className={`text-[14px] leading-tight mb-1 ${isActiveQuiz ? "font-bold text-[#07006f]" : "font-bold text-[#202127]"}`}>
                                {quiz.title || "Quiz"}
                              </p>
                              <div className="flex items-center gap-2 text-[12px] text-[#717480]">{quiz.questions?.length ?? 0} Questions</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
