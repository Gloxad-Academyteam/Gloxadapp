"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiMail, FiPhone, FiMapPin, FiFileText, FiImage } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

const TutorVerificationPage = () => {
  const { id } = useParams<{ id: string }>()!;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin.tutor", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/users/${id}`);
      return res.data.user;
    },
    enabled: !!id
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.put(`/admin/tutors/${id}/approval`, { status: "approved" });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin.tutors"] }),
        queryClient.invalidateQueries({ queryKey: ["admin.tutor", id] }),
        queryClient.invalidateQueries({ queryKey: ["admin.tutor.profile", id] }),
        queryClient.invalidateQueries({ queryKey: ["admin.users"] }),
      ]);
      toast.success("Tutor approved! They have been notified.");
      router.push("/admin/tutors");
    },
    onError: () => toast.error("Failed to approve tutor")
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!rejectionReason.trim()) throw new Error("Rejection reason required");
      await axiosInstance.put(`/admin/tutors/${id}/approval`, { status: "rejected", rejectionReason });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin.tutors"] }),
        queryClient.invalidateQueries({ queryKey: ["admin.tutor", id] }),
        queryClient.invalidateQueries({ queryKey: ["admin.tutor.profile", id] }),
        queryClient.invalidateQueries({ queryKey: ["admin.users"] }),
      ]);
      toast.success("Tutor application rejected.");
      router.push("/admin/tutors");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to reject tutor")
  });

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason first.");
      return;
    }
    if (window.confirm("Are you sure you want to reject this tutor application?")) {
      rejectMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center text-[#717480]">Loading tutor profile...</div>;
  }
  if (isError || !data) {
    return <div className="p-10 text-center text-red-500">Failed to load tutor. Please try again.</div>;
  }

  const tutor = data;
  const fullName = `${tutor.firstName} ${tutor.lastName}`;
  const status = tutor.approvalStatus || tutor.instructorStatus || "pending";
  const certifications: string[] = tutor.certifications || [];
  const experienceProofs: string[] = tutor.experienceProofs || [];
  const allDocs = [
    ...certifications.map((url: string, i: number) => ({ label: `Certification ${i + 1}`, url, type: "cert" })),
    ...experienceProofs.map((url: string, i: number) => ({ label: `Experience Proof ${i + 1}`, url, type: "proof" }))
  ];

  return (
    <div className="w-full pb-32 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <div className="text-[13px] text-[#A0AEC0] mb-2 flex items-center gap-2">
            <Link href="/admin/tutors" className="hover:text-[#202127] transition-colors">Tutors Management</Link>
            <span>/</span>
            <span className="text-[#202127] font-medium">Credential Verification</span>
          </div>
          <h1 className="text-[28px] font-bold text-[#202127]">Credential Verification</h1>
          <p className="text-[14px] text-[#717480] mt-1">Reviewing application for <span className="font-bold text-[#181C7B]">{fullName}</span></p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button
            onClick={handleReject}
            disabled={rejectMutation.isPending || status !== "pending"}
            className="flex items-center gap-2 px-6 py-2 rounded-[8px] border border-[#e02b2b] text-[#e02b2b] hover:bg-[#fff0f0] transition-colors font-medium text-[14px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiXCircle className="text-[18px]" />
            {rejectMutation.isPending ? "Rejecting..." : "Reject Application"}
          </button>
          <button
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending || status !== "pending"}
            className="flex items-center gap-2 px-6 py-2 rounded-[8px] bg-[#181C7B] text-white hover:bg-[#11145a] transition-colors font-medium text-[14px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiCheckCircle className="text-[18px]" />
            {approveMutation.isPending ? "Approving..." : "Approve Tutor"}
          </button>
        </div>
      </div>

      {status !== "pending" && (
        <div className={`mb-6 px-5 py-4 rounded-[10px] font-bold text-[14px] border ${status === "approved" ? "bg-[#e6f7ef] border-[#10b981] text-[#048848]" : "bg-[#ffe8e8] border-[#e02b2b] text-[#e02b2b]"}`}>
          This application has already been <span className="uppercase">{status}</span>. No further action is needed.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column — Profile */}
        <div className="space-y-8">
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-[100px] h-[100px] rounded-full border-4 border-[#e2e8f0] overflow-hidden mb-4 bg-[#181C7B] flex items-center justify-center text-white text-[36px] font-bold">
              {tutor.avatarUrl
                ? <img src={tutor.avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                : tutor.firstName?.charAt(0)
              }
            </div>
            <h2 className="text-[20px] font-bold text-[#202127] mb-1">{fullName}</h2>
            <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold mb-6 inline-block ${status === "approved" ? "bg-[#e6f7ef] text-[#048848]" : status === "rejected" ? "bg-[#ffe8e8] text-[#e02b2b]" : "bg-[#fff9e6] text-[#d48806]"}`}>
              {status.toUpperCase()}
            </span>

            <div className="w-full text-left">
              <h3 className="text-[12px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-[#4e515c] text-[14px]">
                  <FiMail className="text-[#10b981] text-[16px] shrink-0" />
                  <span className="break-all">{tutor.email}</span>
                </div>
                {tutor.phoneNumber && (
                  <div className="flex items-center gap-3 text-[#4e515c] text-[14px]">
                    <FiPhone className="text-[#10b981] text-[16px] shrink-0" />
                    {tutor.phoneNumber}
                  </div>
                )}
                {tutor.country && (
                  <div className="flex items-center gap-3 text-[#4e515c] text-[14px]">
                    <FiMapPin className="text-[#10b981] text-[16px] shrink-0" />
                    {tutor.country}
                  </div>
                )}
              </div>

              {tutor.areaOfExpertise && (
                <>
                  <h3 className="text-[12px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-2">Area of Expertise</h3>
                  <p className="text-[#717480] text-[13px] leading-relaxed mb-6">{tutor.areaOfExpertise}</p>
                </>
              )}

              {tutor.teachingExperienceBio && (
                <>
                  <h3 className="text-[12px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-2">Teaching Bio</h3>
                  <p className="text-[#717480] text-[13px] leading-relaxed">{tutor.teachingExperienceBio}</p>
                </>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
            <h3 className="text-[12px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-4">Account Details</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between border-b border-[#f1f5f9] pb-2">
                <span className="text-[#717480]">Joined</span>
                <span className="text-[#202127] font-medium">{new Date(tutor.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-[#f1f5f9] pb-2">
                <span className="text-[#717480]">Role</span>
                <span className="text-[#202127] font-medium capitalize">{tutor.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717480]">Application Status</span>
                <span className={`font-bold capitalize ${status === "approved" ? "text-[#10b981]" : status === "rejected" ? "text-[#e02b2b]" : "text-[#d97706]"}`}>{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Submitted Documents */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[18px] text-[#202127]">Submitted Documents</h3>
              <span className="bg-[#f1f5f9] text-[#4e515c] px-3 py-1 rounded-[6px] text-[12px] font-bold">
                {allDocs.length} {allDocs.length === 1 ? "File" : "Files"} Provided
              </span>
            </div>

            {allDocs.length === 0 ? (
              <div className="py-8 text-center text-[#A0AEC0] text-[14px]">
                No documents uploaded by this tutor yet.
              </div>
            ) : (
              <div className="space-y-4">
                {allDocs.map((doc, i) => {
                  const isPdf = doc.url.toLowerCase().includes(".pdf");
                  return (
                    <div key={i} className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-[8px] hover:border-[#cbd5e1] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center ${isPdf ? "bg-[#fff0f0] text-[#e02b2b]" : "bg-[#eff6ff] text-[#3b82f6]"}`}>
                          {isPdf ? <FiFileText className="text-[24px]" /> : <FiImage className="text-[24px]" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] text-[#202127]">{doc.label}</h4>
                          <p className="text-[12px] text-[#717480] mt-1">{doc.type === "cert" ? "Certification document" : "Experience proof"}</p>
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#181C7B] font-bold text-[12px] px-4 py-2 rounded-[6px] transition-colors"
                      >
                        View
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Skills & Expertise */}
          {tutor.skills && (
            <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
              <h3 className="font-bold text-[18px] text-[#202127] mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.skills.split(",").map((s: string, i: number) => (
                  <span key={i} className="bg-[#f0f4f8] text-[#181C7B] text-[12px] font-bold px-3 py-1.5 rounded-full">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verification Summary */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
            <h3 className="font-bold text-[18px] text-[#202127] mb-6">Application Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Documents Uploaded", value: allDocs.length },
                { label: "Certifications", value: certifications.length },
                { label: "Experience Proofs", value: experienceProofs.length },
                { label: "Application Date", value: new Date(tutor.createdAt).toLocaleDateString() },
                { label: "Has Bio", value: tutor.teachingExperienceBio ? "Yes" : "No" },
                { label: "Has Expertise", value: tutor.areaOfExpertise ? "Yes" : "No" },
              ].map(item => (
                <div key={item.label} className="bg-[#f8fafc] rounded-[8px] p-4 text-center border border-[#e2e8f0]">
                  <p className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-[18px] font-bold text-[#181C7B]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] p-4 px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex items-center gap-4">
        <div className="flex-1 max-w-2xl bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-4 py-3 flex items-center justify-between">
          <input
            type="text"
            placeholder="Rejection reason (required only when rejecting)..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] text-[#202127] placeholder-[#A0AEC0] w-full"
          />
          <span className="text-[#e02b2b] text-[10px] font-bold tracking-wider bg-[#fff0f0] px-2 py-1 rounded-[4px] ml-4 whitespace-nowrap">
            REQUIRED ON REJECT
          </span>
        </div>
        <span className={`px-6 py-3 rounded-full font-bold text-[13px] tracking-wide ${status === "pending" ? "bg-[#fff9e6] text-[#d48806] border border-[#f5c370]" : status === "approved" ? "bg-[#e6f7ef] text-[#048848] border border-[#10b981]" : "bg-[#ffe8e8] text-[#e02b2b] border border-[#e02b2b]"}`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default TutorVerificationPage;
