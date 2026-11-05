"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiAward, FiBarChart2, FiCheck, FiClock, FiLayers, FiPlayCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { enrollInFreeCourse, getMyEnrollment } from "@services/enrollments";
import { getYouTubeSourceName, getYouTubeSourceUrl, isYouTubeCourse } from "@utils/courseSource";
import LessonVideo from "@components/LessonVideo";
import FullscreenButton from "@components/FullscreenButton";
import { toggleFullscreen } from "@utils/fullscreen";
import { formatLength } from "@utils/youtube";
import CourseContent from "./CourseContent";
import CourseReviews from "./CourseReviews";
import CourseRecommendations from "./CourseRecommendations";

type TProps = {
  course: any;
};

type TPreview = { url: string; title: string; start?: number; end?: number };

const FreeCourseLayout = ({ course }: TProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authenticatedUser, isLoading: authLoading } = useAuth();
  const frameRef = useRef<HTMLDivElement>(null);
  const autoEnrollHandled = useRef<string | null>(null);

  const coursePath = `/courses/${course.slug || course._id}`;
  const enrollmentQuery = useQuery({
    queryKey: ["enrollment.for-course", course._id],
    queryFn: () => getMyEnrollment(String(course._id)),
    enabled: !!authenticatedUser && !!course._id && !course.isCatalog,
    retry: false,
  });
  const isEnrolled = Boolean(course.isEnrolled || enrollmentQuery.data);
  const enrollMutation = useMutation({
    mutationFn: () => enrollInFreeCourse(String(course._id)),
    onSuccess: async () => {
      toast.success("You are enrolled. Your course is ready.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["enrollment.for-course", course._id] }),
        queryClient.invalidateQueries({ queryKey: ["my-courses"] }),
        queryClient.invalidateQueries({ queryKey: ["enrollment", course._id] }),
      ]);
      router.push(`/learning/${course._id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Could not enrol in this course. Please try again.");
    },
  });

  const modules: any[] = course.modules || [];
  const lessons = modules.flatMap((mod) => mod.lessons || []);
  const totalSeconds = lessons.reduce((total, lesson) => total + Math.max(0, (lesson.endSeconds || 0) - (lesson.startSeconds || 0)), 0);
  const hoursText = course.videoHours ? `${course.videoHours} hours` : totalSeconds > 0 ? formatLength(totalSeconds) : "";

  // The video in the page's player: the trailer at first, then whichever chapter the visitor picks
  const firstLesson = lessons.find((lesson) => lesson.videoUrl);
  const [preview, setPreview] = useState<TPreview | null>(
    course.trailerVideoUrl
      ? { url: course.trailerVideoUrl, title: course.title }
      : firstLesson
        ? { url: firstLesson.videoUrl, title: firstLesson.title, start: firstLesson.startSeconds, end: firstLesson.endSeconds }
        : null
  );

  const playChapter = (lesson: { videoUrl?: string; title: string; startSeconds?: number; endSeconds?: number }) => {
    if (!lesson.videoUrl) return;
    setPreview({ url: lesson.videoUrl, title: lesson.title, start: lesson.startSeconds, end: lesson.endSeconds });
    frameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleEnrollClick = useCallback(() => {
    if (!authenticatedUser) {
      const returnTo = `${coursePath}?enrol=1`;
      router.push(`/auth/signin?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }

    // A course that exists only in the bundled catalogue has no database record to enrol in yet
    if (course.isCatalog) {
      toast.info("This course is not open for enrolment yet. Please check back soon.");
      return;
    }

    if (isEnrolled) {
      router.push(`/learning/${course._id}`);
      return;
    }

    enrollMutation.mutate();
  }, [authenticatedUser, course._id, course.isCatalog, coursePath, enrollMutation, isEnrolled, router]);

  useEffect(() => {
    if (authLoading || !authenticatedUser || enrollmentQuery.isLoading || autoEnrollHandled.current === String(course._id)) return;
    if (typeof window === "undefined" || new URLSearchParams(window.location.search).get("enrol") !== "1") return;
    if (course.isCatalog) return;

    autoEnrollHandled.current = String(course._id);
    router.replace(coursePath, { scroll: false });
    handleEnrollClick();
  }, [authLoading, authenticatedUser, course.isCatalog, coursePath, enrollmentQuery.isLoading, handleEnrollClick, router]);

  const facts = [
    { icon: FiBarChart2, label: course.level || "Beginner" },
    { icon: FiLayers, label: `${modules.length} ${modules.length === 1 ? "module" : "modules"}` },
    { icon: FiPlayCircle, label: `${lessons.length} ${lessons.length === 1 ? "chapter" : "chapters"}` },
    ...(hoursText ? [{ icon: FiClock, label: hoursText }] : []),
  ];
  const sourceName = getYouTubeSourceName(course);
  const sourceUrl = getYouTubeSourceUrl(course);
  const isExternalYouTubeCourse = isYouTubeCourse(course);
  const quizCandidates = modules.flatMap((module) => [
    ...(Array.isArray(module.quizzes) ? module.quizzes : []),
    ...(module.quiz ? [module.quiz] : []),
  ]).filter((item: any) => {
    const status = String(item?.status || "").toLowerCase();
    return item?.isDraft !== true && item?.isPublished !== false && !["draft", "pending", "rejected"].includes(status);
  });
  const quizzes = Array.from(new Map(quizCandidates.map((item: any, index: number) => [String(item._id || item.id || `${item.title || "quiz"}-${index}`), item])).values());
  const assessmentCandidates = Array.isArray(course.assessments) ? course.assessments : course.assessment ? [course.assessment] : [];
  const assessments = assessmentCandidates.filter((item: any) => {
    const status = String(item?.status || "").toLowerCase();
    return item?.isDraft !== true && item?.isPublished !== false && !["draft", "pending", "rejected"].includes(status);
  });
  const requirementEntries = Array.isArray(course.requirements)
    ? course.requirements
    : course.entry
      ? [course.entry]
      : ["No prior experience is required."];
  const requirements = requirementEntries.map((item: any) => typeof item === "string" ? item : item?.title || item?.description || "").filter(Boolean);
  const enrollLabel = enrollMutation.isPending
    ? "Enrolling…"
    : enrollmentQuery.isLoading
      ? "Checking enrolment…"
      : isEnrolled
        ? "Continue learning"
        : "Enrol for free";

  return (
    <div className="w-full bg-white pb-24 text-[#201633]">
      {/* Top: what the course is, and the video */}
      <section className="border-b border-[#eceef5] bg-[#f7f8fc]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center lg:gap-14 lg:py-16">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-[13px] text-[#717480]">
              <Link href="/free" className="hover:text-[#07004d]">Free courses</Link>
              {course.category && (
                <>
                  <span>/</span>
                  <span>{course.category}</span>
                </>
              )}
            </nav>

            {course.programme && (
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#3e6ab3]">{course.programme}</p>
            )}
            <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.01em] sm:text-[40px]">{course.title}</h1>
            {course.subtitle && <p className="mt-4 max-w-[560px] text-[16px] leading-[1.65] text-[#5b5e6b]">{course.subtitle}</p>}

            <ul className="mt-6 flex flex-wrap gap-2">
              <li className="inline-flex items-center rounded-full bg-[#e8f7ee] px-3 py-1.5 text-[13px] font-semibold text-[#15803d]">Free</li>
              {facts.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#4e515c] ring-1 ring-[#e1e3ee]">
                  <Icon className="text-[14px] text-[#07004d]" /> {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleEnrollClick}
                disabled={enrollMutation.isPending || enrollmentQuery.isLoading}
                className="h-[52px] rounded-full bg-[#07004d] px-9 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#111456] disabled:cursor-wait disabled:opacity-70"
              >
                {enrollLabel}
              </button>
              <a href="#course-content" className="text-[14px] font-semibold text-[#07004d] underline-offset-4 hover:underline">
                See what's inside
              </a>
            </div>

            {isExternalYouTubeCourse && (
              <p className="mt-6 text-[13px] text-[#717480]">
                Video lessons by{" "}
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#07004d] hover:underline">
                  {sourceName}
                </a>
              </p>
            )}
          </div>

          <div>
            <div
              ref={frameRef}
              className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-[0_18px_50px_rgba(7,0,77,0.18)] [&:fullscreen]:aspect-auto [&:fullscreen]:rounded-none"
            >
              {preview ? (
                <LessonVideo url={preview.url} title={preview.title} startSeconds={preview.start} endSeconds={preview.end} className="h-full w-full" />
              ) : (
                <div className="flex h-full items-center justify-center text-[14px] text-white/70">No video yet</div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-[13px] text-[#5b5e6b]">
                {preview ? (
                  <>
                    <span className="text-[#8a8c95]">Now playing: </span>
                    <span className="font-medium text-[#201633]">{preview.title}</span>
                  </>
                ) : null}
              </p>
              {preview && <FullscreenButton onClick={() => toggleFullscreen(frameRef.current)} className="shrink-0" />}
            </div>
          </div>
        </div>
      </section>

      {/* Body: content on the left, a summary on the right */}
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div className="min-w-0 space-y-14">
          {course.whatYouWillTeach?.length > 0 && (
            <section>
              <h2 className="mb-5 text-[22px] font-bold">What you'll learn</h2>
              <ul className="grid gap-x-8 gap-y-4 rounded-2xl border border-[#e5e7ef] p-6 sm:grid-cols-2">
                {course.whatYouWillTeach.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-[14px] leading-[1.6] text-[#4e515c]">
                    <FiCheck className="mt-1 shrink-0 text-[#15803d]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section id="course-content" className="scroll-mt-24">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-[22px] font-bold">Course content</h2>
              <p className="text-[13px] text-[#717480]">
                {modules.length} {modules.length === 1 ? "module" : "modules"} · {lessons.length} {lessons.length === 1 ? "chapter" : "chapters"}
                {hoursText ? ` · ${hoursText}` : ""}
              </p>
            </div>
            <CourseContent modules={modules} activeUrl={preview?.url} onPlay={playChapter} />
          </section>

          {course.description && (
            <section>
              <h2 className="mb-4 text-[22px] font-bold">About this course</h2>
              <div
                className="max-w-[760px] space-y-4 text-[15px] leading-[1.75] text-[#4e515c]"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
              {course.skills?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {course.skills.map((skill: string) => (
                    <span key={skill} className="rounded-full bg-[#f0f2f8] px-3 py-1.5 text-[13px] font-medium text-[#4e515c]">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          <section>
            <h2 className="mb-4 text-[22px] font-bold">Requirements</h2>
            <ul className="space-y-2 rounded-2xl border border-[#e5e7ef] p-5 text-[14px] leading-[1.6] text-[#4e515c]">
              {requirements.map((requirement: string, index: number) => (
                <li key={`${requirement}-${index}`} className="flex items-start gap-2.5">
                  <FiCheck className="mt-1 shrink-0 text-[#15803d]" aria-hidden="true" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-bold">Assessments and completion</h2>
            <div className="rounded-2xl border border-[#e5e7ef] p-5 text-[14px] leading-[1.65] text-[#4e515c]">
              {quizzes.length > 0 || assessments.length > 0 ? (
                <>
                  <p>This course includes {quizzes.length ? `${quizzes.length} module ${quizzes.length === 1 ? "quiz" : "quizzes"}` : "learning activities"}{assessments.length ? ` and ${assessments.length} ${assessments.length === 1 ? "assessment" : "assessments"}` : ""}.</p>
                  <ul className="mt-3 space-y-1.5">
                    {[...quizzes, ...assessments].map((item: any, index: number) => (
                      <li key={item._id || item.id || item.title || index} className="flex flex-wrap gap-x-2">
                        <span className="font-semibold text-[#202127]">{item.title || `Assessment ${index + 1}`}</span>
                        {(item.passMark ?? item.passingScore) != null && <span>Pass mark: {item.passMark ?? item.passingScore}%</span>}
                        {(item.maxAttempts ?? item.attemptsAllowed) != null && <span>Attempts: {item.maxAttempts ?? item.attemptsAllowed}</span>}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Complete the required course lessons to track your progress. This course has no graded assessments listed.</p>
              )}
              <p className="mt-3 font-medium text-[#202127]">A completion certificate is included at no charge when course requirements are met.</p>
            </div>
          </section>

          <section>
            <CourseReviews
              courseId={course._id}
              reviews={course.reviews || []}
              averageRating={course.averageRating ?? 0}
              reviewCount={course.reviewCount ?? course.reviews?.length ?? 0}
            />
          </section>
        </div>

        <aside className="min-w-0">
          <div className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#e5e7ef] bg-white p-6 shadow-sm">
              <p className="text-[24px] font-bold text-[#15803d]">Free</p>
              <p className="mt-1 text-[13px] text-[#717480]">No payment or card details required</p>
              <ul className="mt-5 space-y-3 text-[14px] text-[#4e515c]">
                <li className="flex items-center gap-3">
                  <FiPlayCircle className="text-[16px] text-[#07004d]" /> {lessons.length} video chapters
                </li>
                <li className="flex items-center gap-3">
                  <FiClock className="text-[16px] text-[#07004d]" /> Self-paced, learn any time
                </li>
                <li className="flex items-center gap-3">
                  <FiBarChart2 className="text-[16px] text-[#07004d]" /> Your progress is tracked as you watch
                </li>
                <li className="flex items-center gap-3">
                  <FiAward className="text-[16px] text-[#07004d]" /> Certificate when you finish
                </li>
              </ul>
              <button
                type="button"
                onClick={handleEnrollClick}
                disabled={enrollMutation.isPending || enrollmentQuery.isLoading}
                className="mt-6 h-[48px] w-full rounded-full bg-[#07004d] text-[14px] font-semibold text-white transition hover:bg-[#111456] disabled:cursor-wait disabled:opacity-70"
              >
                {enrollLabel}
              </button>
            </div>

            {isExternalYouTubeCourse && (
              <div className="rounded-2xl bg-[#f7f8fc] p-6">
                <h3 className="text-[14px] font-bold">External learning resource</h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-[#5b5e6b]">
                  Creator/channel: {sourceName}. Source: YouTube, where each lesson plays in its original player.
                </p>
                <p className="mt-2 text-[12px] leading-[1.65] text-[#717480]">
                  This content is created and owned by its respective creator. Gloxad Academy links to the original YouTube player and does not claim authorship or ownership.
                </p>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[13px] font-semibold text-[#07004d] hover:underline">
                  Original source: {sourceName} on YouTube
                </a>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <CourseRecommendations course={course} />
      </div>
    </div>
  );
};

export default FreeCourseLayout;
