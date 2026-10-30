"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyEnrollments } from "@services/enrollments";
import { toast } from "react-toastify";
import { FaPlay, FaFlag } from "react-icons/fa";
import CertificatesPage from "@pages/CertificatesPage";
import useAuth from "@hooks/useAuth";

import FreePythonImg from "@assets/images/free-python.png";
import FreeGraphicDesignImg from "@assets/images/free-graphic-design.png";
import FreeSeoImg from "@assets/images/free-seo.png";
import CyberSecurityImg from "@assets/images/image-1.png";
import WebDevImg from "@assets/images/image.png";
import UiUxImg from "@assets/images/course-uiux-beginner.png";
import type { StaticImageData } from "next/image";

const imageMap: Record<string, StaticImageData> = {
  '/free-python.png': FreePythonImg,
  '/free-graphic-design.png': FreeGraphicDesignImg,
  '/free-seo.png': FreeSeoImg,
  '/image-1.png': CyberSecurityImg,
  '/image.png': WebDevImg,
  '/course-uiux-beginner.png': UiUxImg
};

const MyCoursesTab = () => {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePill, setActivePill] = useState("In Progress");
  const { authenticatedUser } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setEnrollments(await getMyEnrollments());
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        toast.error("Failed to load your courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const pills = ["In Progress", "Completed", "Certificates"];
  const percentOf = (enrollment: any) => enrollment.progressPercentage ?? 0;
  const completedCount = enrollments.filter((enrollment) => percentOf(enrollment) >= 100).length;
  const lessonsDone = enrollments.reduce((total, enrollment) => total + (enrollment.completedLessons?.length ?? 0), 0);
  const averagePercent = enrollments.length
    ? Math.round(enrollments.reduce((total, enrollment) => total + percentOf(enrollment), 0) / enrollments.length)
    : 0;
  // The unfinished course worked on most recently
  const continueEnrollment = enrollments
    .filter((enrollment) => enrollment.course && percentOf(enrollment) < 100)
    .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())[0];
  const visibleEnrollments = enrollments.filter((enrollment) => {
    const done = (enrollment.progressPercentage ?? 0) >= 100;
    return activePill === "Completed" ? done : !done;
  });

  return (
    <div className="mx-auto max-w-[1512px] px-5 md:px-10 lg:px-[120px] pt-12 pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#202127] mb-1">
            My Courses
          </h1>
          <p className="text-[14px] text-[#4e515c]">
            Continue your learning journey and achieve your goals.
          </p>
        </div>

        {/* Pill Navigation */}
        <div className="mt-6 flex w-fit items-center gap-1 rounded-full bg-white p-1 ring-1 ring-[#e2e8f0] md:mt-0">
          {pills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActivePill(pill)}
              className={`rounded-full px-6 py-2 text-[13px] font-semibold transition-colors ${
                activePill === pill ? "bg-[#07004d] text-white" : "text-[#4e515c] hover:bg-[#f0f4f8]"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {activePill === "Certificates" ? (
        <CertificatesPage />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Course Cards */}
        <div className="flex-1 flex flex-col gap-6">
          {isLoading ? (
            <div className="py-10 text-center text-[#717480]">Loading your courses...</div>
          ) : visibleEnrollments.length === 0 ? (
            <div className="py-10 text-center text-[#717480]">
              {enrollments.length === 0
                ? "You are not enrolled in any courses yet."
                : activePill === "Completed"
                  ? "You have not completed a course yet."
                  : "You have finished every course you started."}
            </div>
          ) : (
            visibleEnrollments
              .map((enrollment, idx) => {
              const course = enrollment.course;
              if (!course) return null;
              const instructorName = course.instructor 
                ? `${course.instructor.firstName} ${course.instructor.lastName}` 
                : "Gloxad Academy";
              
              const progress = {
                completed: enrollment.completedLessons?.length ?? 0,
                percent: enrollment.progressPercentage ?? 0,
              };
              const categoryTag = course.category?.name || (idx % 2 === 0 ? "DESIGN" : "DEVELOPMENT");
              const categoryColor = idx % 2 === 0 ? "bg-[#e0f2fe] text-[#0284c7]" : "bg-[#dcfce3] text-[#166534]";

              return (
                <div key={enrollment._id} className="bg-white border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm flex flex-col sm:flex-row gap-6 card-interactive group">
                  {/* Course Image */}
                  <div className="w-full sm:w-[220px] shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={course.thumbnailUrl && (course.thumbnailUrl.startsWith("http://") || course.thumbnailUrl.startsWith("https://"))
                        ? course.thumbnailUrl
                        : (imageMap[course.thumbnailUrl] || UiUxImg).src}
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Course Details */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold tracking-wider uppercase ${categoryColor}`}>
                        {categoryTag}
                      </span>
                      <span className="text-[12px] font-bold text-[#717480]">
                        {progress.completed} {progress.completed === 1 ? "lesson" : "lessons"} done
                      </span>
                    </div>

                    <h3 className="text-[20px] font-bold text-[#202127] mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-[13px] text-[#4e515c] mb-6">
                      Instructor: {instructorName}
                    </p>

                    {progress.percent >= 100 ? (
                      <div className="mt-auto">
                        <p className="mb-2 text-[11px] font-bold text-[#202127]">100%</p>
                        <div className="mb-4 h-[6px] w-full overflow-hidden rounded-full bg-[#e2e8f0]">
                          <div className="h-full w-full rounded-full bg-[#22a559]" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <button type="button" onClick={() => router.push(`/learning/${course._id}`)} className="h-[38px] rounded-full border border-[#07004d] text-[12px] font-semibold text-[#07004d] transition hover:bg-[#eef2ff]">
                            Watch Video
                          </button>
                          <button type="button" onClick={() => router.push(`/learning/${course._id}/completed`)} className="h-[38px] rounded-full bg-[#07004d] text-[12px] font-semibold text-white transition hover:bg-[#111456]">
                            View and Download Certificate
                          </button>
                        </div>
                      </div>
                    ) : (
                    <div className="mt-auto flex items-end justify-between gap-4">
                        <div className="flex-1 max-w-[300px]">
                          <p className="text-[11px] font-bold text-[#202127] mb-2">{progress.percent}% Complete</p>
                          <div className="w-full h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${progress.percent >= 100 ? "bg-[#22a559]" : "bg-[#07004d]"}`} style={{ width: `${progress.percent}%` }}></div>
                          </div>
                        </div>
                        <button type="button" onClick={() => router.push(`/learning/${course._id}`)} className="flex items-center gap-2 bg-[#07004d] text-white px-6 py-2.5 rounded-[6px] text-[13px] font-bold hover:bg-[#111456] transition-colors shrink-0 btn-interactive">
                          <FaPlay className="text-[10px]" /> Resume
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: the learner's own numbers */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#202127] mb-6 flex items-center gap-2">
              <FaFlag className="text-[#1e4ed8]" /> Your Learning
            </h3>

            <div className="mb-6">
              <div className="flex justify-between text-[12px] font-bold text-[#202127] mb-2">
                <span>Average progress</span>
                <span>{averagePercent}%</span>
              </div>
              <div className="w-full h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden">
                <div className="h-full bg-[#1e4ed8] rounded-full" style={{ width: `${averagePercent}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[22px] font-bold text-[#202127]">{enrollments.length}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#717480]">Enrolled</div>
              </div>
              <div>
                <div className="text-[22px] font-bold text-[#202127]">{lessonsDone}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#717480]">Lessons done</div>
              </div>
              <div>
                <div className="text-[22px] font-bold text-[#16a34a]">{completedCount}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#717480]">Completed</div>
              </div>
            </div>
          </div>

          {continueEnrollment && (
            <div className="bg-[#1e4ed8] rounded-[16px] p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-white opacity-10 rounded-full blur-2xl"></div>
              <h3 className="text-[14px] font-medium mb-2 opacity-90">Continue learning</h3>
              <p className="text-[18px] font-bold leading-snug mb-1 line-clamp-2">{continueEnrollment.course.title}</p>
              <p className="text-[12px] opacity-80 mb-5">{percentOf(continueEnrollment)}% complete</p>
              <button
                type="button"
                onClick={() => router.push(`/learning/${continueEnrollment.course._id}`)}
                className="flex items-center gap-2 bg-white text-[#1e4ed8] px-5 py-2.5 rounded-[6px] text-[13px] font-bold hover:bg-blue-50 transition-colors"
              >
                <FaPlay className="text-[10px]" /> Resume
              </button>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default MyCoursesTab;
