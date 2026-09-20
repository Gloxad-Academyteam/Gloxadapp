"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { FaExclamationCircle, FaRegClock, FaCheckCircle, FaAngleRight, FaPlayCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCourseDetails } from "@services/tutor/courses";

export default function FeedbackPage() {
  const router = useRouter();
  const { id } = useParams()!;
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getCourseDetails(id as string)
        .then((res) => {
          setCourse(res.data?.course);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return <div className="p-10">Loading feedback...</div>;
  }

  if (!course) {
    return <div className="p-10">Course not found.</div>;
  }

  return (
    <div className="w-full h-full bg-[#fcfcfd] p-4 sm:p-6 lg:p-10 text-[#202127] overflow-y-auto">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] font-bold text-[#717480] mb-8 uppercase tracking-wider">
        <Link href="/dashboard/courses" className="hover:text-[#202127]">My Courses</Link>
        <FaAngleRight className="text-[10px]" />
        <span className="text-[#e11d48]">Rejected</span>
        <FaAngleRight className="text-[10px]" />
        <span className="text-[#202127]">Feedback: {course.title || "Course"}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-[16px] border border-[#e2e8f0] p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#07004d] mb-2">{course.title}</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#fff1f2] text-[#e11d48] text-[12px] font-bold rounded-[6px] flex items-center gap-2">
              <FaTimesCircle className="text-[12px]" /> Rejected
            </span>
            <span className="text-[13px] text-[#717480] flex items-center gap-2">
              <FaRegClock /> Last Reviewed: {new Date(course.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => router.push(`/dashboard/courses/${id}/appeal`)} className="px-6 py-3 border border-[#07004d] text-[#07004d] text-[14px] font-bold rounded-[8px] hover:bg-[#f0f4f8] transition-colors flex items-center gap-2">
            Appeal Decision
          </button>
          <button onClick={() => router.push(`/dashboard/courses/${id}/edit`)} className="px-6 py-3 bg-[#07004d] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#0a006e] transition-colors flex items-center gap-2">
            <FaEdit /> Edit & Resubmit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Major Issues Card */}
          <div className="bg-white rounded-[16px] border-l-4 border-l-[#e11d48] border-y border-r border-[#e2e8f0] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#fff1f2] text-[#e11d48] flex items-center justify-center">
                <FaExclamationCircle className="text-[18px]" />
              </div>
              <h2 className="text-[18px] font-bold text-[#202127]">Major Issues</h2>
            </div>
            
            <div className="bg-[#fff1f2] rounded-[8px] p-5 border border-[#e11d48]/20">
              <p className="text-[11px] font-bold text-[#e11d48] uppercase tracking-wider mb-2">PRIMARY REASON</p>
              <h3 className="text-[20px] font-bold text-[#202127] mb-3">Rejection Feedback</h3>
              <p className="text-[14px] text-[#202127] leading-relaxed whitespace-pre-wrap">
                {course.rejectionReason || "No specific reason provided by the reviewer."}
              </p>
            </div>
          </div>

          {/* Timeline of Issues */}
          <div className="bg-white rounded-[16px] border border-[#e2e8f0] p-6 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#202127] mb-8 flex items-center gap-2">
              <FaRegClock className="text-[#3e92cc]" /> Timeline of Issues
            </h2>

            <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e2e8f0]">
              
              {/* Item 1 */}
              <div className="relative">
                <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-[#3e92cc] text-white flex items-center justify-center text-[12px] font-bold ring-4 ring-white">01</div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[14px] font-bold text-[#3e92cc]">Module 2, Video 3</h4>
                  <span className="text-[12px] font-bold text-[#202127] bg-[#f0f4f8] px-2 py-1 rounded-[4px]">04:12</span>
                </div>
                <p className="text-[14px] text-[#202127] mb-3">Noticeable drop in volume levels. Voice becomes muffled as if the microphone was moved or disconnected.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-[#e11d48] bg-[#fff1f2] px-2 py-1 rounded-[4px] uppercase">High Severity</span>
                  <span className="text-[10px] font-bold text-[#3e92cc] bg-[#f0f4f8] px-2 py-1 rounded-[4px] uppercase">Audio Drop</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="relative">
                <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-[#3e92cc] text-white flex items-center justify-center text-[12px] font-bold ring-4 ring-white">02</div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[14px] font-bold text-[#3e92cc]">Module 4, Video 1</h4>
                  <span className="text-[12px] font-bold text-[#202127] bg-[#f0f4f8] px-2 py-1 rounded-[4px]">12:45</span>
                </div>
                <p className="text-[14px] text-[#202127] mb-3">Sustained background hum (60Hz interference). Likely caused by proximity to power cables or faulty equipment.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-[#07004d] bg-[#f0f4f8] px-2 py-1 rounded-[4px] uppercase">Background Noise</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative">
                <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-[#3e92cc] text-white flex items-center justify-center text-[12px] font-bold ring-4 ring-white">03</div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[14px] font-bold text-[#3e92cc]">Module 5, Video 2</h4>
                  <span className="text-[12px] font-bold text-[#202127] bg-[#f0f4f8] px-2 py-1 rounded-[4px]">02:10</span>
                </div>
                <p className="text-[14px] text-[#202127] mb-3">Extreme audio clipping during high-frequency explanations. Distorts the instructor's voice significantly.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-[#e11d48] bg-[#fff1f2] px-2 py-1 rounded-[4px] uppercase">Clipping</span>
                </div>
              </div>

            </div>
          </div>

          {/* Reviewer Note */}
          <div className="bg-[#fcfcfd] rounded-[16px] border border-[#e2e8f0] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute right-[-20px] bottom-[-40px] text-[180px] font-serif text-[#e2e8f0] opacity-50 select-none">"</div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#cbd5e1] overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=reviewer" alt="reviewer" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#202127]">Reviewer's Note</p>
                <p className="text-[12px] text-[#717480]">Platform Moderator • Senior Quality Specialist</p>
              </div>
            </div>
            <p className="text-[16px] text-[#202127] italic leading-relaxed relative z-10">
              "The curriculum design of your Advanced Structural Engineering course is exceptional, but the technical execution of the audio is currently a barrier to learner success. I strongly recommend using a dedicated cardioid microphone and a pop filter for the re-recording. Once these audio spikes and drops are addressed, the course will be a fantastic addition to our engineering catalog."
            </p>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Next Steps */}
          <div className="bg-white rounded-[16px] border border-[#e2e8f0] p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#07004d] mb-6 flex items-center gap-2">
              <FaCheckCircle className="text-[#3e92cc]" /> Next Steps
            </h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#cbd5e1] text-[#3e92cc] focus:ring-[#3e92cc]" />
                <span className="text-[14px] text-[#202127]">Re-record audio for Module 2, Video 3</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#cbd5e1] text-[#3e92cc] focus:ring-[#3e92cc]" />
                <span className="text-[14px] text-[#202127]">Apply noise reduction to Module 4</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#cbd5e1] text-[#3e92cc] focus:ring-[#3e92cc]" />
                <span className="text-[14px] text-[#202127]">Update thumbnail to 1920x1080</span>
              </label>
              <label className="flex items-start gap-3 opacity-50 cursor-not-allowed">
                <input type="checkbox" disabled className="mt-1 w-4 h-4 rounded border-[#cbd5e1] text-[#3e92cc]" />
                <span className="text-[14px] text-[#202127]">Resubmit for review</span>
              </label>
            </div>
          </div>

          {/* Need Technical Help */}
          <div className="bg-[#07004d] rounded-[16px] p-6 shadow-lg text-white">
            <h3 className="text-[18px] font-bold mb-3">Need Technical Help?</h3>
            <p className="text-[13px] text-white/80 mb-6 leading-relaxed">
              Our media specialists can help you troubleshoot your recording setup or provide feedback on audio tests.
            </p>
            <div className="space-y-3">
              <button className="w-full flex justify-between items-center bg-white/10 hover:bg-white/20 px-4 py-3 rounded-[8px] text-[13px] font-bold transition-colors">
                <span className="flex items-center gap-2"><FaPlayCircle /> Recording Best Practices</span>
                <FaAngleRight />
              </button>
              <button className="w-full flex justify-between items-center bg-white/10 hover:bg-white/20 px-4 py-3 rounded-[8px] text-[13px] font-bold transition-colors">
                <span className="flex items-center gap-2"><FaCheckCircle /> Chat with Moderator</span>
                <FaAngleRight />
              </button>
            </div>
          </div>

          {/* Preview Video */}
          <div className="bg-white rounded-[16px] border border-[#e2e8f0] p-4 shadow-sm">
            <div className="aspect-video bg-[#1a1c23] rounded-[8px] mb-3 relative flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-bold text-[#202127]">Preview Video</span>
              <span className="text-[11px] text-[#717480]">15:32 Total Duration</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


