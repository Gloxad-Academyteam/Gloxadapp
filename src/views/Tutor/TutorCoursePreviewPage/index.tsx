"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { FaPlay, FaStar, FaEye, FaEdit, FaChartBar, FaArchive, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { Skeleton } from "../../../components/Skeleton";

export default function TutorCoursePreviewPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>()!;

  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  // Fetch course details from API
  const { data: course, isLoading, error } = useQuery({
    queryKey: ["tutor.course", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/tutor/courses/${id}`);
      return res.data?.course || res.data;
    },
    enabled: !!id,
  });

  // Automatically expand the first module when loaded
  useEffect(() => {
    if (course?.modules?.length > 0) {
      const firstModId = course.modules[0]._id || course.modules[0].id;
      if (firstModId) {
        setExpandedModules([firstModId.toString()]);
      }
    }
  }, [course]);

  const toggleModule = (modId: string) => {
    const idStr = modId.toString();
    if (expandedModules.includes(idStr)) {
      setExpandedModules(expandedModules.filter(x => x !== idStr));
    } else {
      setExpandedModules([...expandedModules, idStr]);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-[#fcfcfd] p-6 lg:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-12 w-44 rounded-[8px]" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-[16px]" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-24 bg-[#fcfcfd]">
        <h2 className="text-[20px] font-bold text-red-500 mb-2">Error Loading Course</h2>
        <p className="text-[14px] text-[#717480] mb-6">We couldn't fetch the preview for this course.</p>
        <Link href="/dashboard/courses" className="px-6 py-3 bg-[#07004d] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#0a006e] transition-colors">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const modules = course.modules || [];
  const statusLabel = course.status === "published" ? "Approved" : course.status === "pending" ? "Pending" : course.status === "rejected" ? "Rejected" : "Draft";
  const categoryLabel = course.category?.name || course.category || "Uncategorized";

  return (
    <div className="w-full h-full bg-[#fcfcfd] p-4 sm:p-6 lg:p-10 text-[#202127] overflow-y-auto">
      
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            {course.status === "published" && (
              <span className="px-3 py-1 bg-[#3e92cc] text-white text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <FaCheckCircle /> Approved
              </span>
            )}
            {course.status === "pending" && (
              <span className="px-3 py-1 bg-[#cbd5e1] text-gray-700 text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 border border-[#e2e8f0]">
                <FaHourglassHalf /> Pending
              </span>
            )}
            {course.status === "rejected" && (
              <span className="px-3 py-1 bg-[#e11d48] text-white text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <FaTimesCircle /> Rejected
              </span>
            )}
            {course.status === "draft" && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wider rounded-full border border-gray-200">
                Draft
              </span>
            )}
            <span className="px-3 py-1 bg-[#f0f4f8] text-[#717480] text-[11px] font-bold uppercase tracking-wider rounded-full border border-[#e2e8f0]">
              {categoryLabel}
            </span>
          </div>
          <h1 className="text-[32px] font-bold leading-tight mb-2">{course.title}</h1>
          <div 
            className="text-[15px] text-[#717480] max-w-[600px] line-clamp-3"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 text-center min-w-[100px] shadow-sm">
            <p className="text-[11px] font-bold text-[#717480] uppercase">Total Students</p>
            <p className="text-[20px] font-bold text-[#202127]">{course.enrollmentCount || 0}</p>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 text-center min-w-[100px] shadow-sm">
            <p className="text-[11px] font-bold text-[#717480] uppercase">Rating</p>
            <p className="text-[20px] font-bold text-[#202127] flex items-center justify-center gap-1">
              {course.averageRating || "—"} {course.averageRating ? <FaStar className="text-[#3e92cc] text-[14px]" /> : null}
            </p>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 text-center min-w-[100px] shadow-sm">
            <p className="text-[11px] font-bold text-[#717480] uppercase">Lessons</p>
            <p className="text-[20px] font-bold text-[#202127]">
              {modules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)}
            </p>
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Video Player or Thumbnail Preview Area */}
          <div className="w-full aspect-video bg-[#1a1c23] rounded-[16px] overflow-hidden relative group shadow-lg">
            {course.trailerUrl ? (
              <video src={course.trailerUrl} className="w-full h-full object-contain bg-black" controls />
            ) : course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt="course thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <FaPlay className="text-[48px] mb-2 text-gray-600" />
                <p className="text-[14px]">No trailer uploaded yet</p>
              </div>
            )}
          </div>

          {/* Course Content Accordion */}
          <div className="bg-white rounded-[16px] border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#fcfcfd]">
              <h2 className="text-[18px] font-bold text-[#07004d]">Course Content</h2>
              <p className="text-[13px] text-[#717480] font-medium">
                {modules.length} Modules • {modules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)} Lessons
              </p>
            </div>
            
            <div className="divide-y divide-[#e2e8f0]">
              {modules.length === 0 ? (
                <div className="p-8 text-center text-[#717480] text-[14px]">
                  No curriculum sections defined yet.
                </div>
              ) : (
                modules.map((mod: any, index: number) => {
                  const modId = (mod._id || mod.id || index).toString();
                  const isExpanded = expandedModules.includes(modId);
                  return (
                    <div key={modId} className="w-full">
                      <button 
                        onClick={() => toggleModule(modId)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#f0f4f8] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {isExpanded ? <FaAngleUp className="text-[#cbd5e1]" /> : <FaAngleDown className="text-[#cbd5e1]" />}
                          <span className="text-[15px] font-bold text-[#202127] text-left">{mod.title}</span>
                        </div>
                        <span className="text-[13px] text-[#717480]">{mod.lessons?.length || 0} Lessons</span>
                      </button>
                      
                      {isExpanded && mod.lessons?.length > 0 && (
                        <div className="bg-[#fcfcfd] border-t border-[#e2e8f0]">
                          {mod.lessons.map((lesson: any) => (
                            <div key={lesson._id || lesson.id} className="px-12 py-4 flex flex-col gap-1 border-b border-[#e2e8f0] last:border-0 hover:bg-[#f0f4f8] transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FaPlay className="text-[#3e92cc] text-[12px]" />
                                  <span className="text-[14px] text-[#717480] font-medium">{lesson.title}</span>
                                </div>
                                <span className="text-[13px] text-[#cbd5e1]">{lesson.duration || "Self-paced"}</span>
                              </div>
                              {lesson.resources?.length > 0 && (
                                <div className="pl-6 mt-1 flex flex-col gap-1">
                                  {lesson.resources.map((res: any, rIdx: number) => (
                                    <a key={rIdx} href={res.fileUrl} target="_blank" rel="noreferrer" className="text-[12px] text-[#3e92cc] hover:underline flex items-center gap-1 w-max">
                                      📎 {res.title || "Attached Resource"}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Tutor Tools */}
          <div className="bg-[#07004d] rounded-[16px] overflow-hidden shadow-lg">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-[18px] font-bold text-white">Tutor Tools</h3>
            </div>
            <div className="p-4 space-y-2">
              <button 
                onClick={() => router.push(`/courses/${course.slug}`)}
                className="w-full flex items-center gap-4 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-[14px] font-semibold rounded-[8px] transition-colors"
              >
                <FaEye className="text-[#8bc34a] text-[16px]" /> View as Student
              </button>
              <button 
                onClick={() => router.push(`/dashboard/courses/${course._id}/edit`)} 
                className="w-full flex items-center gap-4 px-4 py-3 bg-[#3e92cc] hover:bg-[#2b7bb5] text-white text-[14px] font-semibold rounded-[8px] transition-colors"
              >
                <FaEdit className="text-white text-[16px]" /> Edit Course Content
              </button>
              <button 
                onClick={() => router.push('/dashboard/earnings')}
                className="w-full flex items-center gap-4 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-[14px] font-semibold rounded-[8px] transition-colors"
              >
                <FaChartBar className="text-[#cbd5e1] text-[16px]" /> View Analytics
              </button>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white rounded-[16px] border border-[#e2e8f0] p-6 shadow-sm">
            <h3 className="text-[18px] font-bold text-[#07004d] mb-6">Course Details</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-[14px] border-b border-[#e2e8f0] pb-2">
                <span className="text-[#717480]">Pricing</span>
                <span className="font-bold text-[#202127]">
                  {course.price > 0 ? `₦${course.price.toLocaleString()}` : "Free"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[14px] border-b border-[#e2e8f0] pb-2">
                <span className="text-[#717480]">Category</span>
                <span className="font-bold text-[#202127]">{categoryLabel}</span>
              </div>
              <div className="flex justify-between items-center text-[14px] border-b border-[#e2e8f0] pb-2">
                <span className="text-[#717480]">Level</span>
                <span className="font-bold text-[#202127]">{course.level || "All Levels"}</span>
              </div>
              <div className="flex justify-between items-center text-[14px] border-b border-[#e2e8f0] pb-2">
                <span className="text-[#717480]">Language</span>
                <span className="font-bold text-[#202127]">{course.language || "English"}</span>
              </div>
            </div>

            {/* Learning Objectives / What You Will Teach */}
            {course.whatYouWillTeach?.length > 0 && (
              <div>
                <h4 className="text-[12px] font-bold text-[#717480] uppercase tracking-wider mb-4">Learning Objectives</h4>
                <ul className="space-y-3">
                  {course.whatYouWillTeach.map((obj: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="text-[#3e92cc] mt-1 shrink-0" />
                      <span className="text-[13px] text-[#202127]">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Institutional Approval */}
          <div className="bg-[#f0f7fb] rounded-[16px] border border-[#3e92cc]/30 p-6 flex gap-4">
            <FaCheckCircle className="text-[#3e92cc] text-[24px] shrink-0 mt-1" />
            <div>
              <h4 className="text-[14px] font-bold text-[#07004d] mb-2 uppercase tracking-wider">Academic Vetting</h4>
              <p className="text-[12px] text-[#202127] leading-relaxed">
                This course has been vetted by the Gloxad Academic Board. All modules meet strict academic standards for quality instruction.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
