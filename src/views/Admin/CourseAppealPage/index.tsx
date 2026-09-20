"use client";

import React from "react";
import { FiArrowLeft, FiXCircle, FiFileText, FiPaperclip, FiRefreshCw } from "react-icons/fi";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAppeals, resolveAppeal } from "@services/admin/courses";

const CourseAppealPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams()!;
  const [appeal, setAppeal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      getAppeals()
        .then((res) => {
          const found = res.data?.appeals?.find((a: any) => a._id === id);
          setAppeal(found);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleResolve = async (actionStatus: string, publish: boolean) => {
    if (!appeal) return;
    try {
      setIsProcessing(true);
      await resolveAppeal(appeal._id, {
        status: actionStatus,
        adminNotes: "Resolved from dashboard.",
        publishCourse: publish,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin.appeals"] });
      await queryClient.invalidateQueries({ queryKey: ["admin.courses.all"] });
      alert(`Appeal ${actionStatus} successfully!`);
      router.push("/admin/courses"); // Or another route like /admin/appeals if it exists
    } catch (err) {
      console.error(err);
      alert("Failed to process appeal.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!appeal) return <div className="p-10">Appeal not found.</div>;

  return (
    <div className="w-full max-w-[900px] mx-auto pb-10">
      
      <button 
        onClick={() => router.back()} 
        className="mb-6 flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#e2e8f0] transition-colors text-[#202127]"
      >
        <FiArrowLeft className="text-[20px]" />
      </button>

      {/* Main Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-8 mb-6">
        
        <div className="flex items-start gap-4 mb-8">
          <div className="w-10 h-10 bg-[#f0f4ff] rounded-[8px] flex items-center justify-center text-[#181C7B]">
            <FiFileText className="text-[20px]" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#202127]">Appeal Justification</h1>
            <p className="text-[#717480] text-[13px]">Reference: APP-{appeal._id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        {/* Original Rejection Reason */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] border-l-4 border-l-[#e02b2b] rounded-r-[8px] p-5 mb-6">
          <div className="flex items-center gap-2 mb-2 text-[#e02b2b]">
            <FiXCircle className="text-[14px]" />
            <span className="font-bold text-[11px] uppercase tracking-wider">Original Rejection Reason</span>
          </div>
          <p className="text-[#202127] text-[13px] leading-relaxed">
            {appeal.course?.rejectionReason || "No rejection reason was provided for this course."}
          </p>
        </div>

        {/* Tutor's Statement */}
        <div className="bg-[#f0f4ff] border border-[#e2e8f0] border-l-4 border-l-[#3b82f6] rounded-r-[8px] p-5 mb-8">
          <div className="flex items-center gap-2 mb-2 text-[#3b82f6]">
            <HiOutlineSpeakerphone className="text-[14px]" />
            <span className="font-bold text-[11px] uppercase tracking-wider">Tutor's Statement</span>
          </div>
          <p className="text-[#202127] text-[13px] leading-relaxed italic whitespace-pre-wrap">
            "{appeal.reason}"
          </p>
        </div>

        {/* Supporting Documents */}
        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-3">Supporting Documents</h3>
          {appeal.evidenceUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href={appeal.evidenceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-[#e2e8f0] rounded-[8px] bg-white cursor-pointer hover:border-[#3b82f6] transition-colors">
                <div className="w-8 h-8 flex items-center justify-center text-[#717480]">
                  <FiPaperclip className="text-[20px]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#202127]">Appeal_Evidence</p>
                  <p className="text-[#A0AEC0] text-[11px]">Click to view</p>
                </div>
              </a>
            </div>
          ) : (
            <p className="text-[13px] text-[#717480]">No supporting documents provided.</p>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button 
            onClick={() => handleResolve("resolved", true)}
            disabled={isProcessing}
            className="bg-[#020617] hover:bg-[#1e293b] text-white font-bold text-[14px] py-3 rounded-[8px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw /> {isProcessing ? "Processing..." : "Re-review Course (Approve)"}
          </button>
          <button 
            onClick={() => handleResolve("rejected", false)}
            disabled={isProcessing}
            className="bg-white border border-[#e02b2b] text-[#e02b2b] hover:bg-[#fff5f5] font-bold text-[14px] py-3 rounded-[8px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <FiXCircle /> {isProcessing ? "Processing..." : "Finalize Rejection"}
          </button>
        </div>
        <div className="text-center">
          <button className="text-[#181C7B] font-bold text-[13px] hover:underline">
            Contact Tutor Directly
          </button>
        </div>
      </div>

      {/* Queue Performance */}
      <div className="bg-[#1e293b] rounded-[12px] p-6 text-white relative overflow-hidden shadow-lg">
        <h3 className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-4">Queue Performance</h3>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[32px] font-bold leading-none mb-1">2.4 Days</h2>
            <p className="text-[#94a3b8] text-[12px]">Avg. Resolution Time</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[#3b82f6] border-r-transparent flex items-center justify-center rotate-45">
            <div className="-rotate-45 font-bold text-[14px]">78%</div>
          </div>
        </div>

        <div className="w-full bg-[#334155] h-1 rounded-full mb-4">
          <div className="bg-white h-full rounded-full" style={{ width: '78%' }}></div>
        </div>

        <p className="text-[#cbd5e1] text-[13px]">
          Appeal processing speed is 15% higher than last quarter.
        </p>
      </div>

    </div>
  );
};

export default CourseAppealPage;
