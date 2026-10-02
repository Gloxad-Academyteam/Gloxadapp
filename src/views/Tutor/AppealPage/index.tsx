"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { FaInfoCircle, FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCourseDetails, fileAppeal } from "@services/tutor/courses";

export default function AppealPage() {
  const router = useRouter();
  const { id } = useParams()!;
  const [course, setCourse] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async () => {
    if (!id) return;
    if (!reason) return alert("Please provide a justification statement.");
    try {
      setIsSubmitting(true);
      await fileAppeal(id as string, { message: reason });
      alert("Appeal submitted successfully.");
      router.push("/dashboard/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to submit appeal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!course) return <div className="p-10">Course not found.</div>;

  return (
    <div className="w-full h-full bg-[#fcfcfd] p-4 sm:p-6 lg:p-10 text-[#202127] overflow-y-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#07004d] mb-2">Appeal</h1>
        <p className="text-[14px] text-[#717480]">Manage your curriculum and monitor course approval statuses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column - Reviewer Feedback */}
        <div className="bg-white rounded-[16px] border border-[#e2e8f0] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#fff1f2] text-[#e11d48] flex items-center justify-center">
              <FaInfoCircle className="text-[16px]" />
            </div>
            <h2 className="text-[20px] font-bold text-[#202127]">Reviewer Feedback</h2>
          </div>

          <div className="bg-[#f8fafc] border-l-4 border-l-[#e11d48] rounded-r-[8px] p-5 mb-8">
            <p className="text-[11px] font-bold text-[#717480] uppercase mb-2">Reviewer Feedback</p>
            <p className="text-[14px] text-[#202127] italic whitespace-pre-wrap">
              {course.rejectionReason || "No specific feedback provided."}
            </p>
          </div>

          <h3 className="text-[11px] font-bold text-[#07004d] uppercase tracking-wider mb-4">Required Adjustments:</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaTimes className="text-[#e11d48] mt-1 shrink-0" />
              <span className="text-[14px] text-[#202127]">Update module learning objectives for consistency.</span>
            </li>
            <li className="flex items-start gap-3">
              <FaTimes className="text-[#e11d48] mt-1 shrink-0" />
              <span className="text-[14px] text-[#202127]">Re-record Audio for Module 2, Lesson 4.</span>
            </li>
            <li className="flex items-start gap-3">
              <FaTimes className="text-[#e11d48] mt-1 shrink-0" />
              <span className="text-[14px] text-[#202127]">Provide missing reading materials for the final project.</span>
            </li>
          </ul>
        </div>

        {/* Right Column - Submit Appeal Form */}
        <div className="bg-[#1f2937] rounded-[16px] p-6 sm:p-8 shadow-lg text-white">
          <h2 className="text-[24px] font-bold mb-3">Submit Your Appeal</h2>
          <p className="text-[14px] text-white/80 mb-8 leading-relaxed">
            Explain the corrections made or why the rejection might be in error.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2">
                Justification Statement
              </label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white text-[#202127] rounded-[8px] p-4 min-h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-[#3e92cc]"
                placeholder="Provide a detailed explanation..."
              ></textarea>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-2">
                Supporting Documents
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-[8px] p-8 text-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <FaCloudUploadAlt className="text-[24px] text-white/60 mx-auto mb-3" />
                <p className="text-[14px] font-bold mb-1">Click to upload or drag files</p>
                <p className="text-[11px] text-white/60">PDF, PNG, JPG (Max 10MB)</p>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-[#3e92cc] hover:bg-[#2b7bb5] text-white text-[15px] font-bold rounded-[8px] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Appeal for Review"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
