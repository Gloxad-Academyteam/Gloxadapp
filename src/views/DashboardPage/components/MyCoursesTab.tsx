"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";
import { toast } from "react-toastify";
import { FaPlay, FaCalendarAlt, FaFlag } from "react-icons/fa";
import CertificateView from "./CertificateView";
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
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePill, setActivePill] = useState("In Progress");
  const { authenticatedUser } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axiosInstance.get("/enrollments/my-courses");
        setEnrollments(response.data || []);
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
        <div className="flex items-center gap-2 bg-[#f0f4f8] w-fit p-1 rounded-[8px] mt-6 md:mt-0">
          {pills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActivePill(pill)}
              className={`px-6 py-2 rounded-[6px] text-[13px] font-bold transition-colors ${
                activePill === pill
                  ? "bg-white text-[#1e4ed8] shadow-sm border border-[#e2e8f0]"
                  : "text-[#4e515c] hover:bg-gray-200"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {activePill === "Certificates" ? (
        <CertificateView 
          studentName={authenticatedUser?.firstName ? `${authenticatedUser.firstName} ${authenticatedUser.lastName}` : "Moses Philippine"}
          courseName="Web Development (Frontend) Basic level A"
          completionDate="July 3rd, 2025"
          score="80%"
          certificateId="12345678AD"
          onBack={() => setActivePill("In Progress")}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Course Cards */}
        <div className="flex-1 flex flex-col gap-6">
          {isLoading ? (
            <div className="py-10 text-center text-[#717480]">Loading your courses...</div>
          ) : enrollments.length === 0 ? (
            <div className="py-10 text-center text-[#717480]">You are not enrolled in any courses yet.</div>
          ) : (
            enrollments.map((enrollment, idx) => {
              const course = enrollment.course;
              if (!course) return null;
              const instructorName = course.instructor 
                ? `${course.instructor.firstName} ${course.instructor.lastName}` 
                : "Gloxad Academy";
              
              const progress = enrollment.progress || { completed: 0, total: 0, percent: 0 };
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
                        {progress.completed}/{progress.total} Lessons
                      </span>
                    </div>

                    <h3 className="text-[20px] font-bold text-[#202127] mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-[13px] text-[#4e515c] mb-6">
                      Instructor: {instructorName}
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-4">
                      <div className="flex-1 max-w-[300px]">
                        <p className="text-[11px] font-bold text-[#202127] mb-2">{progress.percent}% Complete</p>
                        <div className="w-full h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1e4ed8] rounded-full" style={{ width: `${progress.percent}%` }}></div>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 bg-[#1e4ed8] text-white px-6 py-2.5 rounded-[6px] text-[13px] font-bold hover:bg-blue-800 transition-colors shrink-0 btn-interactive">
                        <FaPlay className="text-[10px]" /> Resume
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Widgets */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
          
          {/* Weekly Goals Widget */}
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#202127] mb-6 flex items-center gap-2">
              <FaFlag className="text-[#1e4ed8]" /> Weekly Goals
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between text-[12px] font-bold text-[#202127] mb-2">
                <span>Study Time</span>
                <span>12 / 20 hrs</span>
              </div>
              <div className="w-full h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden">
                <div className="h-full bg-[#1e4ed8] w-[60%] rounded-full"></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-[12px] font-bold text-[#202127] mb-2">
                <span>Lessons Completed</span>
                <span>8 / 10</span>
              </div>
              <div className="w-full h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden">
                <div className="h-full bg-[#16a34a] w-[80%] rounded-full"></div>
              </div>
            </div>

            <button className="w-full text-center text-[12px] font-bold text-[#1e4ed8] hover:underline">
              Edit Your Goals
            </button>
          </div>

          {/* Academic Streak Widget */}
          <div className="bg-[#1e4ed8] rounded-[16px] p-6 text-white shadow-md relative overflow-hidden">
            {/* Subtle background glow/shape simulation */}
            <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <h3 className="text-[14px] font-medium mb-2 opacity-90">Academic Streak</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[36px] font-bold leading-none">14</span>
              <span className="text-[13px] font-medium opacity-90">Days in a row!</span>
            </div>
            <p className="text-[12px] leading-relaxed opacity-80 mb-6">
              You're in the top 5% of learners this week. Keep the momentum going!
            </p>
            
            {/* Mini Bar Chart Mockup */}
            <div className="flex items-end gap-1.5 h-[30px]">
              {[40, 60, 50, 80, 70, 90, 100].map((height, i) => (
                <div 
                  key={i} 
                  className={`w-[5px] rounded-t-sm ${i === 6 ? 'bg-white' : 'bg-white/40'}`} 
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Deadlines Widget */}
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#202127] mb-5 flex items-center gap-2">
              <FaCalendarAlt className="text-[#e11d48]" /> Deadlines
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-[42px] h-[46px] rounded-[8px] bg-[#ffe4e6] text-[#e11d48] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase leading-none mb-1">Oct</span>
                  <span className="text-[16px] font-bold leading-none">24</span>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#202127]">Design Quiz 3</h4>
                  <p className="text-[11px] text-[#717480]">Visual Hierarchy</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-[42px] h-[46px] rounded-[8px] bg-[#f1f5f9] text-[#64748b] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase leading-none mb-1">Oct</span>
                  <span className="text-[16px] font-bold leading-none">28</span>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#202127]">Project Submission</h4>
                  <p className="text-[11px] text-[#717480]">Brand Identity</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCoursesTab;
