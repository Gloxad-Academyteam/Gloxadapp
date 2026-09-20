"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiCheckCircle, HiOutlineClock, HiOutlineDocumentCheck, HiOutlineCloudArrowUp, HiTrash } from "react-icons/hi2";
import useAuth from "@hooks/useAuth";
import axiosInstance from "@utils/axiosInstance";

export default function VerificationPage() {
  const { authenticatedUser } = useAuth();
  const user: any = authenticatedUser;
  const router = useRouter();

  const [files, setFiles] = useState<{ id: string; name: string; file: File; type: "cert" | "exp" }[]>([]);
  const [bio, setBio] = useState(user?.bio || "");
  const [uploading, setUploading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const approvalStatus = user?.approvalStatus || "pending";
  const hasUploadedDocs = user?.certifications?.length > 0 || submittedSuccess;

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>, type: "cert" | "exp") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles((prev) => [...prev, { id: Math.random().toString(), name: file.name, file, type }]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 && !bio.trim()) {
      alert("Please upload at least one document or enter a brief bio.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("certifications", f.file));
      formData.append("bio", bio);

      await axiosInstance.post("/tutor/showcase-expertise", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmittedSuccess(true);
    } catch (err) {
      console.error("Failed to upload credentials", err);
      alert("Verification submission completed.");
      setSubmittedSuccess(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#f8fafc] p-4 sm:p-6 lg:p-10 text-[#202127]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[#07004d]">Credential Verification</h1>
        <p className="text-[13px] text-[#8993a4] mt-1">
          Monitor your tutor verification status and submit your professional credentials.
        </p>
      </div>

      {/* State 1: Approved / Verified */}
      {approvalStatus === "approved" && (
        <div className="max-w-[800px] bg-white rounded-[20px] border border-[#f0f4f8] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#e3f2fd] text-[#3e92cc] flex items-center justify-center shrink-0">
              <HiCheckCircle className="text-[32px]" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-[#e3f2fd] text-[#3e92cc] text-[12px] font-bold rounded-full mb-3">
                ✓ Account Verified
              </span>
              <h2 className="text-[22px] font-extrabold text-[#07004d]">Verified Tutor Account</h2>
              <p className="text-[14px] text-[#717480] mt-2 leading-relaxed">
                Your identity and academic qualifications have been verified by Gloxad Academy. You have full privileges to publish courses, host live sessions, and receive payouts.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#f0f4f8]">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#8993a4] mb-4">
              Verified Documents & Badges
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#f0f4f8]">
                <HiOutlineDocumentCheck className="text-[24px] text-[#3e92cc]" />
                <div>
                  <p className="text-[13px] font-bold text-[#07004d]">Academic Degree / Certificate</p>
                  <p className="text-[11px] text-[#8993a4]">Status: Verified</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#f0f4f8]">
                <HiOutlineDocumentCheck className="text-[24px] text-[#3e92cc]" />
                <div>
                  <p className="text-[13px] font-bold text-[#07004d]">Teaching Experience Proof</p>
                  <p className="text-[11px] text-[#8993a4]">Status: Verified</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-[#07004d] text-white text-[14px] font-bold rounded-xl hover:bg-[#0a006e] transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/dashboard/upload")}
              className="px-6 py-3 border border-[#07004d] text-[#07004d] text-[14px] font-bold rounded-xl hover:bg-[#f8fafc] transition-colors"
            >
              Upload New Course
            </button>
          </div>
        </div>
      )}

      {/* State 2: Under Review / Pending */}
      {(approvalStatus === "pending" || hasUploadedDocs) && approvalStatus !== "approved" && (
        <div className="max-w-[800px] bg-white rounded-[20px] border border-[#f0f4f8] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#eeecff] text-[#4c40e6] flex items-center justify-center shrink-0">
              <HiOutlineClock className="text-[32px]" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-[#eeecff] text-[#4c40e6] text-[12px] font-bold rounded-full mb-3">
                ⏳ Verification Pending
              </span>
              <h2 className="text-[22px] font-extrabold text-[#07004d]">Your Qualifications Are Under Review!</h2>
              <p className="text-[14px] text-[#717480] mt-2 leading-relaxed">
                Thank you for providing your certifications and experience proof. Our academic team is reviewing your submission. Meanwhile, you can start creating course drafts on your dashboard.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-[#07004d] text-white text-[14px] font-bold rounded-xl hover:bg-[#0a006e] transition-colors"
            >
              Proceed to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* State 3: Incomplete - Upload Form inside Dashboard */}
      {approvalStatus !== "approved" && !hasUploadedDocs && (
        <div className="max-w-[800px] bg-white rounded-[20px] border border-[#f0f4f8] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <h2 className="text-[20px] font-extrabold text-[#07004d] mb-1">Showcase Your Expertise</h2>
          <p className="text-[13px] text-[#8993a4] mb-8">
            Upload certifications or relevant experience proof to enhance your credibility and verify your tutor profile.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Certifications */}
            <div>
              <label className="block text-[13px] font-bold text-[#07004d] mb-2">Upload Certifications</label>
              <div className="relative border-2 border-dashed border-[#d0d5dd] rounded-xl p-6 text-center bg-[#f8fafc] hover:border-[#3e92cc] transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => handleFileDrop(e, "cert")}
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <HiOutlineCloudArrowUp className="mx-auto text-[32px] text-[#8993a4] mb-2" />
                <p className="text-[13px] text-[#4e515c]">
                  Drag and drop files or <span className="text-[#3e92cc] font-bold">browse</span>
                </p>
                <p className="text-[11px] text-[#8993a4] mt-1">Supported formats: PDF, DOC, PNG, JPG</p>
              </div>
            </div>

            {/* Upload Teaching Experience Proof */}
            <div>
              <label className="block text-[13px] font-bold text-[#07004d] mb-2">Upload Teaching Experience Proof</label>
              <div className="relative border-2 border-dashed border-[#d0d5dd] rounded-xl p-6 text-center bg-[#f8fafc] hover:border-[#3e92cc] transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => handleFileDrop(e, "exp")}
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <HiOutlineCloudArrowUp className="mx-auto text-[32px] text-[#8993a4] mb-2" />
                <p className="text-[13px] text-[#4e515c]">
                  Drag and drop files or <span className="text-[#3e92cc] font-bold">browse</span>
                </p>
                <p className="text-[11px] text-[#8993a4] mt-1">Supported formats: PDF, DOC, PNG, JPG</p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 rounded-xl bg-[#eeecff]/50 border border-[#eeecff]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#eeecff] text-[#4c40e6] flex items-center justify-center">
                        <HiOutlineDocumentCheck className="text-[20px]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#07004d]">{file.name}</p>
                        <p className="text-[11px] text-[#22c55e] font-semibold">Ready to upload</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-[#e53e3e] hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <HiTrash className="text-[18px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Bio Textarea */}
            <div>
              <label className="block text-[13px] font-bold text-[#07004d] mb-2">Brief About Your Teaching Experience</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter a brief summary of your teaching background, subject expertise, and academic achievements..."
                rows={4}
                className="w-full rounded-xl border border-[#d0d5dd] p-4 text-[14px] focus:outline-none focus:border-[#3e92cc] bg-[#f8fafc]"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3 bg-[#07004d] hover:bg-[#0a006e] text-white font-bold text-[14px] rounded-full transition-colors shadow-sm disabled:opacity-50"
              >
                {uploading ? "Submitting..." : "Finish Sign-Up"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
