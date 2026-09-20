"use client";

import { useState } from "react";
import Button from "@components/Button";
import Modal from "@components/Modal";
import { FiUploadCloud, FiTrash2, FiFileText } from "react-icons/fi";
import { useShowcaseExpertisePage } from "./hooks/useShowcaseExpertisePage";
import TutorOnboardingHeroImage from "@assets/images/tutor-onboarding.png";
import Link from "next/link";

const ShowcaseExpertisePage = () => {
  const {
    certifications,
    experienceProofs,
    teachingExperienceBio,
    setTeachingExperienceBio,
    handleFileDrop,
    removeFile,
    handleSkip,
    handleSubmit,
    isSubmitting,
    isModalOpen,
  } = useShowcaseExpertisePage();

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, type: "cert" | "exp") => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileDrop(Array.from(e.dataTransfer.files), type);
    }
  };

  const FileDropzone = ({
    title,
    files,
    type,
  }: {
    title: string;
    files: File[];
    type: "cert" | "exp";
  }) => (
    <div className="mb-6">
      <h3 className="mb-2 text-[14px] font-bold text-[#202127]">{title}</h3>
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, type)}
        className="flex min-h-[130px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d9d9d9] bg-white p-5 text-center transition-colors hover:border-[#07004d]"
      >
        <FiUploadCloud className="mb-2 text-[26px] text-[#717480]" />
        <p className="text-[13px] text-[#717480]">
          Drag and drop files or{" "}
          <label className="cursor-pointer font-bold text-[#07004d] hover:underline">
            browse
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileDrop(Array.from(e.target.files), type);
                }
              }}
            />
          </label>
        </p>
        <p className="mt-1 text-[11px] text-[#717480]">
          Click or drag and drop your files to upload. Supported formats : PDF, DOC.
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-2.5">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-3.5 px-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eeecff]">
                  <FiFileText className="text-[20px] text-[#07004d]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#202127]">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#3e92cc]">Upload Successful</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index, type)}
                className="text-[#ff4d4f] transition-colors hover:text-[#d9363e]"
                title="Remove file"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-white flex-col">
      {/* Top Header Logo */}
      <div className="w-full px-6 pt-6 lg:px-12">
        <Link href="/" className="inline-block">
          <img src="/gloxadlogo.png" alt="GLOXAD Logo" className="h-[36px] w-[110px] object-contain" />
        </Link>
      </div>

      <div className="flex flex-1 w-full pb-16">
        {/* Left Column - Hero Banner */}
        <div className="hidden w-1/2 p-6 pt-2 lg:block">
          <div className="sticky top-6 h-[calc(100vh-100px)] min-h-[500px] w-full overflow-hidden rounded-[24px] bg-[#07004d]">
            <img
              src={TutorOnboardingHeroImage.src}
              alt="Showcase Expertise"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020d14]/90 via-[#020d14]/20 to-transparent"></div>
            <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center px-8">
              <h1 className="text-center text-[34px] font-bold leading-[1.25] text-white xl:text-[38px]">
                Inspire Learners & Earn on Your Terms!
              </h1>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex w-full flex-col items-center justify-start px-5 py-8 lg:w-1/2 lg:px-12 xl:px-20 pb-16">
          <div className="w-full max-w-[480px]">
            <h2 className="mb-2 text-center text-[28px] font-bold text-[#202127]">
              Showcase Your Expertise
            </h2>
            <p className="mb-8 text-center text-[13px] text-[#717480] leading-[1.6]">
              Upload certifications or relevant experience proof to enhance your credibility. You can skip
              this step and complete it later from your dashboard.
            </p>

            <FileDropzone title="Upload Certifications" files={certifications} type="cert" />
            <FileDropzone title="Upload Teaching Experience Proof" files={experienceProofs} type="exp" />

            <div className="mb-8">
              <h3 className="mb-2 text-[14px] font-bold text-[#202127]">
                Brief About Your Teaching Experience
              </h3>
              <textarea
                value={teachingExperienceBio}
                onChange={(e) => setTeachingExperienceBio(e.target.value)}
                placeholder="Enter your message"
                className="min-h-[130px] w-full resize-none rounded-xl border border-[#d9d9d9] bg-white p-4 text-[14px] text-[#202127] placeholder-[#717480] focus:border-[#07004d] focus:outline-none focus:ring-1 focus:ring-[#07004d]"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handleSkip}
                className="h-[48px] w-full rounded-full border border-[#07004d] bg-white text-[14px] font-bold text-[#07004d] transition hover:bg-[#f6f8fa]"
              >
                Skip for now
              </button>
              <Button
                text="Finish Sign-Up"
                onClick={handleSubmit}
                isBlock
                disabled={isSubmitting}
                className="bg-[#07004d] h-[48px] text-[14px] font-bold rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isModalOpen && (
        <Modal>
          <div className="flex w-[90%] max-w-[420px] flex-col items-center justify-center rounded-[24px] bg-white p-8 text-center shadow-2xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f4f8]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#07004d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="mb-3 text-[20px] font-bold text-[#202127]">
              Your Qualifications Are Under Review!
            </h3>
            <p className="mb-8 text-[13px] text-[#717480] leading-[1.6]">
              Thank you for providing your certifications and experience proof. Our team will review your
              submission shortly. Meanwhile, you can start exploring your dashboard.
            </p>
            <Button
              text="Proceed to dashboard"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              isBlock
              className="bg-[#07004d] h-[48px] text-[14px] font-bold rounded-full"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ShowcaseExpertisePage;
