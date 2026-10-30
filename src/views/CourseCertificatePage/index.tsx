"use client";

import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import CertificateFrame from "@components/Certificate/CertificateFrame";

export default function CourseCertificatePage() {
  const { id: courseId } = useParams()!;
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [capturing, setCapturing] = useState(false);

  // The API issues the certificate (and its ID) once the course is 100% complete
  const { data: certificate, isLoading, isError, error } = useQuery({
    queryKey: ["course.certificate", courseId],
    queryFn: async () => (await axiosInstance.get(`/learning/${courseId}/certificate`)).data.certificate,
    enabled: !!courseId,
    retry: false,
  });

  const handleDownload = async () => {
    if (!certificateRef.current || !certificate) return;
    setIsSaving(true);
    // Draw it at full size for the capture, whatever the screen
    setCapturing(true);
    await new Promise((resolve) => setTimeout(resolve, 80));
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const pdf = new jsPDF("l", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, (canvas.height * width) / canvas.width);
      pdf.save(`${String(certificate.courseTitle).replace(/\s+/g, "_")}_Certificate.pdf`);
    } catch {
      toast.error("Could not create the PDF. Please try again.");
    } finally {
      setCapturing(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white px-5 pb-24 pt-6 text-[#201633] md:px-10">
      <button type="button" onClick={() => router.back()} className="flex items-center gap-1 text-[13px] text-[#4e515c] hover:text-[#07004d]">
        <FiChevronLeft /> Back
      </button>

      {isLoading && <p className="py-20 text-center text-[#717480]">Loading certificate...</p>}

      {isError && (
        <div className="mx-auto max-w-[520px] py-20 text-center">
          <h1 className="mb-2 text-[20px] font-bold">Certificate not available yet</h1>
          <p className="mb-6 text-[14px] text-[#717480]">
            {(error as any)?.response?.data?.error || "Finish every lesson in the course to earn your certificate."}
          </p>
          <button type="button" onClick={() => router.push(`/learning/${courseId}`)} className="h-[44px] rounded-full bg-[#07004d] px-8 text-[13px] font-semibold text-white">
            Back to course
          </button>
        </div>
      )}

      {certificate && (
        <>
          <div className={`mt-8 ${capturing ? "overflow-x-auto" : ""}`}>
            <CertificateFrame
              ref={certificateRef}
              full={capturing}
              studentName={certificate.studentName}
              courseTitle={certificate.courseTitle}
              instructorName={certificate.instructorName}
              certificateId={certificate.certificateId}
              issuedAt={new Date(certificate.issuedAt)}
            />
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isSaving}
            className="mx-auto mt-12 block h-[52px] w-full max-w-[520px] rounded-full bg-[#07004d] text-[13px] font-semibold text-white transition hover:bg-[#111456] disabled:opacity-60"
          >
            {isSaving ? "Preparing PDF..." : "Download Certificate"}
          </button>
          <p className="mt-4 text-center text-[12px] text-[#717480]">
            Anyone can check this certificate at{" "}
            <a href={`/verify/${certificate.certificateId}`} className="break-all font-semibold text-[#07004d] hover:underline">
              /verify/{certificate.certificateId}
            </a>
          </p>
        </>
      )}
    </div>
  );
}
