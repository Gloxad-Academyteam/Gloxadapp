"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../../hooks/useAuth";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaCheck, FaClipboardList, FaLinkedin } from "react-icons/fa";
import CourseReviews from "./CourseReviews";
import CourseModules from "./CourseModules";
import CourseRecommendations from "./CourseRecommendations";

type TProps = {
  course: any;
};

const FreeCourseLayout = ({ course }: TProps) => {
  const router = useRouter();
  const { authenticatedUser } = useAuth();
  const [activeTab, setActiveTab] = useState("About");
  const tabs = ["About", "Modules", "Reviews"]; // Only keep the fully built tabs to ensure no broken or unbuilt placeholders

  const handleEnrollClick = () => {
    if (!authenticatedUser) {
      toast.info("Please log in to start learning.");
      router.push("/auth/signin");
      return;
    }

    axiosInstance.post(`/enrollments/enroll/${course._id}`)
      .then(() => {
        toast.success("Enrolled successfully! You can now start learning.");
        router.push(`/dashboard`);
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.error || "Failed to enroll.");
      });
  };

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative w-full bg-[#f4f7fb] pt-16 pb-32 px-5 md:px-10 lg:px-[120px] overflow-hidden">
        <div className="mx-auto max-w-[1512px] flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="flex flex-col items-start max-w-2xl">
            <h1 className="text-[28px] md:text-[36px] font-bold text-[#202127] mb-4">
              Learn {course.title.split(' ').slice(0, 3).join(' ')} for Free at
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <img src="/gloxadlogo.png" alt="Gloxad Academy" className="h-10 object-contain" />
              <span className="text-[28px] md:text-[32px] font-bold text-[#202127]">Academy</span>
            </div>
            
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#202127] mb-6">
              {course.title}
            </h2>
            
            <div className="flex flex-col gap-3 mb-8">
              {/* Primary Instructor */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border border-[#e2e8f0]">
                  <img src={course.instructor?.avatarUrl || "https://ui-avatars.com/api/?name=" + (course.instructor?.firstName || "Instructor")} alt="Instructor" className="w-full h-full object-cover" />
                </div>
                <p className="text-[16px] text-[#4e515c]">
                  Instructor: <span className="font-bold underline cursor-pointer">{course.instructor?.firstName} {course.instructor?.lastName}</span>
                </p>
              </div>

              {/* Co-Instructors */}
              {course.instructors && course.instructors.length > 0 && (
                <div className="flex flex-col gap-2 pl-4 border-l-2 border-[#181C7B]">
                  <p className="text-[10px] text-[#717480] font-bold uppercase tracking-wider">Co-Instructors</p>
                  {course.instructors.map((inst: any) => (
                    <div key={inst._id} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-[#e2e8f0]">
                        <img 
                          src={inst.avatarUrl || "https://ui-avatars.com/api/?name=" + inst.firstName} 
                          alt={inst.firstName} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <p className="text-[13px] text-[#4e515c]">
                        <span className="font-semibold text-[#202127]">{inst.firstName} {inst.lastName}</span>
                        {inst.title && <span className="text-[11px] text-[#717480] ml-1.5">({inst.title})</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={handleEnrollClick} className="rounded-full bg-[#181C7B] px-8 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-blue-900">
              Start Learning
            </button>
          </div>
          
          {/* Abstract Shape on the right */}
          <div className="hidden lg:block w-[400px] h-[400px] relative">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
              <path fill="#181C7B" d="M45.7,-76.3C58.9,-69.3,69.1,-55.3,77.7,-40.7C86.3,-26.1,93.4,-10.8,92.6,4.1C91.8,19,83.2,33.5,72.4,45C61.6,56.5,48.7,65.1,34.5,71.7C20.3,78.3,4.9,82.8,-10.1,81.1C-25.1,79.4,-39.7,71.5,-52.1,60.8C-64.5,50.1,-74.6,36.5,-80.4,21.2C-86.2,5.9,-87.6,-11,-82.3,-26.1C-77,-41.2,-64.9,-54.5,-50.8,-61.4C-36.7,-68.3,-20.5,-68.8,-3.3,-64.1C13.9,-59.4,27.8,-49.5,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" />
              <path fill="#1e4ed8" d="M35.7,-56.3C45.9,-49.3,53.1,-35.3,58.7,-20.7C64.3,-6.1,68.4,7.8,63.6,18.1C58.8,28.4,45.2,35.1,32.4,42C19.6,48.9,7.7,56.1,-5.1,59.1C-17.9,62.1,-31.7,60.9,-43.1,53.8C-54.5,46.7,-63.6,33.7,-67.4,19.2C-71.2,4.7,-69.6,-11.3,-62.3,-24.1C-55,-36.9,-42,-46.5,-28.8,-53.4C-15.6,-60.3,-2.5,-64.5,10.7,-59.6C23.9,-54.7,37.8,-40.5,35.7,-56.3Z" transform="translate(100 100) scale(1.1) rotate(45)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1512px] px-5 md:px-10 lg:px-[120px] relative -mt-16 z-20">
        
        {/* Overlapping Stats Card */}
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex-1 border-r border-gray-200 pr-8">
            <h3 className="text-[18px] font-bold text-[#202127] mb-1">{course.modules?.length || 0} modules</h3>
            <p className="text-[14px] text-[#717480]">{course.modulesDescription || "Gain insight into a topic and learn the fundamentals."}</p>
          </div>
          <div className="flex-1 border-r border-gray-200 px-8">
            <h3 className="text-[18px] font-bold text-[#202127] mb-1">{course.level || "Entry Level"}</h3>
            <p className="text-[14px] text-[#717480]">{course.entryLevelDescription || "No prior experience required"}</p>
          </div>
          <div className="flex-1 pl-8">
            <h3 className="text-[18px] font-bold text-[#202127] mb-1">{course.learningType || "Self-paced Learning"}</h3>
            <p className="text-[14px] text-[#717480] mb-1">Approx. {course.duration}</p>
            <p className="text-[14px] text-[#717480]">{course.learningTypeDescription || "Learn at your own pace"}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-4 mb-12 w-full max-w-[1100px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-[15px] font-bold transition-colors ${
                activeTab === tab
                  ? "bg-[#181C7B] text-white"
                  : "bg-transparent text-[#202127] hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "About" && (
          <div className="max-w-[1100px]">
            {/* Checkmarks Grid */}
            {course.whatYouWillTeach && course.whatYouWillTeach.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-16">
                {course.whatYouWillTeach.map((obj: string, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <FaCheck className="text-[#202127] mt-1 shrink-0 text-[12px]" />
                    <p className="text-[14px] text-[#4e515c] leading-relaxed">
                      {obj}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Description Paragraph */}
            {course.description && (
              <div className="mb-12">
                <h3 className="text-[16px] font-bold text-[#202127] mb-2">About this course</h3>
                <div 
                  className="text-[14px] text-[#4e515c] leading-relaxed max-w-[950px] space-y-4"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </div>
            )}

            {/* Skills you'll gain */}
            {course.skills && course.skills.length > 0 && (
              <div className="mb-12">
                <h3 className="text-[16px] font-bold text-[#202127] mb-3">Skills you'll gain</h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-[#f0f4f8] text-[#4e515c] px-3 py-1.5 rounded-lg text-[13px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details to know */}
            <div className="mb-16">
              <h3 className="text-[18px] font-bold text-[#202127] mb-6">Details to know</h3>
              <div className="flex gap-16">
                <div>
                  <FaClipboardList className="text-[24px] text-[#202127] mb-3" />
                  <h4 className="text-[16px] font-bold text-[#202127] mb-1">Assessments</h4>
                  <p className="text-[14px] text-[#8b8b9a]">
                    {course.modules?.filter((m: any) => m.quiz && m.quiz.title).length || 0} quizzes
                  </p>
                </div>
                {course.hasShareableCertificate !== false && (
                  <div>
                    <FaLinkedin className="text-[24px] text-[#0077b5] mb-3" />
                    <h4 className="text-[16px] font-bold text-[#202127] mb-1">Shareable certificate</h4>
                    <p className="text-[14px] text-[#8b8b9a]">Add to your LinkedIn profile</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Modules" && (
          <CourseModules course={course} />
        )}

        {activeTab === "Reviews" && (
          <CourseReviews 
            courseId={course._id}
            reviews={course.reviews || []} 
            averageRating={course.averageRating ?? 0}
            reviewCount={course.reviewCount ?? course.reviews?.length ?? 0}
          />
        )}

        <div className="mt-16 mb-10">
          <CourseRecommendations course={course} />
        </div>
      </div>
    </div>
  );
};

export default FreeCourseLayout;
