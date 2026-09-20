"use client";

import React, { useState } from "react";
import { FiCheckCircle, FiXCircle, FiPlayCircle, FiDownload, FiSettings, FiMaximize, FiArrowLeft } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateCourseStatus, getAdminCourseDetails } from "@services/admin/courses";

const CourseApprovalDetailsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>()!;
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["admin.courses.detail", id],
    queryFn: async () => {
      if (!id) throw new Error("Course ID missing");
      const res = await getAdminCourseDetails(id);
      return res.data;
    },
    enabled: !!id
  });

  const handleApprove = async () => {
    if (!id) return;
    try {
      setIsProcessing(true);
      await updateCourseStatus(id, { status: "published" });
      await queryClient.invalidateQueries({ queryKey: ["admin.courses.all"] });
      await queryClient.invalidateQueries({ queryKey: ["admin.courses.detail", id] });
      alert("Course approved successfully!");
      router.push("/admin/courses");
    } catch (error) {
      console.error(error);
      alert("Failed to approve course.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    if (!rejectionReason) return alert("Please provide a rejection reason.");
    try {
      setIsProcessing(true);
      await updateCourseStatus(id, { status: "rejected", rejectionReason });
      await queryClient.invalidateQueries({ queryKey: ["admin.courses.all"] });
      await queryClient.invalidateQueries({ queryKey: ["admin.courses.detail", id] });
      alert("Course rejected successfully!");
      router.push("/admin/courses");
    } catch (error) {
      console.error(error);
      alert("Failed to reject course.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#fcfcfd]">Loading course details...</div>;
  }

  if (error || !course) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#fcfcfd] gap-4">
        <p className="text-red-500 font-bold">Failed to load course details or course not found.</p>
        <button onClick={() => router.push("/admin/courses")} className="px-6 py-2 bg-[#181C7B] text-white rounded-md flex items-center gap-2">
          <FiArrowLeft /> Back to Courses
        </button>
      </div>
    );
  }

  const instructorName = course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "Unknown Instructor";
  const lessonsCount = course.modules?.reduce((sum: number, mod: any) => sum + (mod.lessons?.length || 0), 0) || 0;
  const allLessons = course.modules?.flatMap((mod: any) => mod.lessons || []) || [];

  return (
    <div className="w-full pb-10">
      {/* Back Button */}
      <button 
        onClick={() => router.push("/admin/courses")} 
        className="flex items-center gap-2 text-[#717480] hover:text-[#181C7B] transition-colors mb-6 font-bold text-[14px]"
      >
        <FiArrowLeft /> Back to Course Management
      </button>

      {/* Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-2 ${
              course.status === "pending" ? "bg-[#fffbf0] text-[#d97706]" :
              course.status === "published" ? "bg-[#e6f7ef] text-[#048848]" : "bg-[#ffe8e8] text-[#e02b2b]"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                course.status === "pending" ? "bg-[#d97706]" :
                course.status === "published" ? "bg-[#048848]" : "bg-[#e02b2b]"
              }`}></span> {course.status?.toUpperCase() || "PENDING"}
            </span>
            <span className="text-[#A0AEC0] text-[12px] font-medium">Submitted {new Date(course.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-[28px] font-bold text-[#181C7B] mb-4">{course.title}</h1>
          
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <img 
                src={course.instructor?.avatarUrl || "https://ui-avatars.com/api/?name=Instructor&background=181C7B&color=fff"} 
                alt={instructorName} 
                className="w-10 h-10 rounded-full object-cover border border-[#e2e8f0]" 
              />
              <div>
                <p className="font-bold text-[#202127] text-[14px]">{instructorName}</p>
                <p className="text-[#717480] text-[12px]">{course.instructor?.title || course.instructor?.skills || "Course Instructor"}</p>
              </div>
            </div>
            
            <div className="hidden sm:block w-[1px] h-8 bg-[#e2e8f0]"></div>
            
            <div>
              <p className="text-[#A0AEC0] text-[10px] font-bold uppercase tracking-wider mb-1">Duration</p>
              <p className="text-[#202127] font-bold text-[14px]">{course.durationValue || "0"} {course.durationUnit || "Weeks"}</p>
            </div>
            
            <div className="hidden sm:block w-[1px] h-8 bg-[#e2e8f0]"></div>
            
            <div>
              <p className="text-[#A0AEC0] text-[10px] font-bold uppercase tracking-wider mb-1">Modules</p>
              <p className="text-[#202127] font-bold text-[14px]">{course.modules?.length || 0} Modules ({lessonsCount} Lessons)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          {course.status !== "published" && (
            <button 
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-[#181C7B] hover:bg-[#11145a] text-white font-bold text-[14px] py-3 rounded-[8px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <FiCheckCircle className="text-[18px]" /> {isProcessing ? "Processing..." : "Approve Course"}
            </button>
          )}
          {course.status !== "rejected" && (
            <button 
              onClick={() => {
                const el = document.getElementById("rejection-textarea");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  el.focus();
                }
              }}
              disabled={isProcessing}
              className="bg-white border border-[#e02b2b] text-[#e02b2b] hover:bg-[#fff5f5] font-bold text-[14px] py-3 rounded-[8px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <FiXCircle className="text-[18px]" /> {isProcessing ? "Processing..." : "Reject Course"}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Video & Playlist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Placeholder */}
          <div className="bg-[#1e293b] rounded-[16px] aspect-video relative overflow-hidden flex flex-col justify-end group">
            {/* Thumbnail background */}
            <div className="absolute inset-0">
              <img 
                src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} 
                className="w-full h-full object-cover opacity-40 filter blur-[2px]" 
                alt="Course preview thumbnail"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] to-[#334155]/20 opacity-60"></div>
            
            {/* Play Button */}
            {course.trailerUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <a 
                  href={course.trailerUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105"
                >
                  <FiPlayCircle className="text-[32px] ml-1" />
                </a>
              </div>
            )}

            {/* Video Controls overlay */}
            <div className="relative p-6 bg-gradient-to-t from-black/85 to-transparent z-10">
              <h3 className="text-white font-bold text-[18px] mb-1">Preview Video / Trailer</h3>
              <div className="flex items-center justify-between text-white/70 text-[13px]">
                <span>{course.trailerUrl ? "Click to play trailer in a new tab" : "No trailer uploaded for this course"}</span>
                <div className="flex items-center gap-4">
                  <FiSettings className="cursor-pointer hover:text-white" />
                  <FiMaximize className="cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Video Playlist */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-[#202127]">Syllabus Playlist</h3>
              <span className="text-[#181C7B] text-[11px] font-bold uppercase tracking-wider">Total {allLessons.length} Lessons</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allLessons.length > 0 ? (
                allLessons.slice(0, 8).map((lesson: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-[8px] border border-[#f0f4f8] hover:bg-[#f8fafc] transition-colors">
                    <div className="w-[100px] h-[60px] bg-[#e2e8f0] rounded-[6px] relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-[#3b82f6]/10 flex items-center justify-center">
                        <FiPlayCircle className="text-[#3b82f6] text-[20px]" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[13px] font-bold text-[#202127] line-clamp-1">{lesson.title}</p>
                      <p className="text-[11px] text-[#717480] mt-1">{lesson.durationValue || "5"} mins</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-[#717480] text-[13px]">
                  No lessons added in curriculum builder yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Details & Review Form */}
        <div className="space-y-6">
          
          {/* Description */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6">
            <h3 className="text-[16px] font-bold text-[#202127] mb-3">Welcome Message</h3>
            <p className="text-[#4e515c] text-[13px] leading-relaxed mb-4">
              {course.welcomeMessage || "No welcome message provided."}
            </p>
            
            <h3 className="text-[16px] font-bold text-[#202127] mb-3">Congratulations Message</h3>
            <p className="text-[#4e515c] text-[13px] leading-relaxed">
              {course.congratsMessage || "No congrats message provided."}
            </p>
          </div>

          {/* Target Audience / Goals */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6">
            <h3 className="text-[16px] font-bold text-[#202127] mb-4">What You Will Teach</h3>
            <div className="space-y-2 mb-6">
              {course.whatYouWillTeach?.map((goal: string, idx: number) => (
                <div key={idx} className="flex gap-2.5 text-[13px] text-[#4e515c]">
                  <span className="text-green-500 font-bold shrink-0">✓</span>
                  <span>{goal}</span>
                </div>
              )) || <p className="text-[#717480] text-[13px]">None specified.</p>}
            </div>

            <h3 className="text-[16px] font-bold text-[#202127] mb-4">Target Audience</h3>
            <div className="space-y-2">
              {course.targetAudience?.map((audience: string, idx: number) => (
                <div key={idx} className="flex gap-2.5 text-[13px] text-[#4e515c]">
                  <span className="text-[#3b82f6] font-bold shrink-0">•</span>
                  <span>{audience}</span>
                </div>
              )) || <p className="text-[#717480] text-[13px]">None specified.</p>}
            </div>
          </div>

          {/* Course Outline */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6">
            <h3 className="text-[16px] font-bold text-[#202127] mb-4">Module Outlines</h3>
            <div className="space-y-4">
              {course.modules?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <span className="text-[13px] font-medium text-[#4e515c]">{item.title}</span>
                </div>
              )) || <p className="text-[#717480] text-[13px]">No modules outlined.</p>}
            </div>
          </div>

          {/* Reason for Rejection Form */}
          {course.status !== "published" && (
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] p-6">
              <h3 className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-3">Reason for Rejection</h3>
              <textarea 
                id="rejection-textarea"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason why this course needs revisions..."
                className="w-full h-[120px] bg-white border border-[#e2e8f0] rounded-[8px] p-4 text-[13px] text-[#202127] outline-none focus:border-[#3b82f6] resize-none mb-2"
              ></textarea>
              <p className="text-[10px] text-[#A0AEC0] italic mb-6">
                Note: This feedback will be sent directly to {instructorName}.
              </p>

              <button 
                onClick={handleReject}
                disabled={isProcessing}
                className="w-full bg-[#e02b2b] hover:bg-[#b91c1c] text-white font-bold text-[14px] py-3 rounded-[8px] transition-colors mb-3 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Confirm Rejection"}
              </button>
              <button 
                onClick={() => setRejectionReason("")}
                className="w-full text-[#717480] hover:text-[#202127] font-bold text-[13px] py-2 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CourseApprovalDetailsPage;
