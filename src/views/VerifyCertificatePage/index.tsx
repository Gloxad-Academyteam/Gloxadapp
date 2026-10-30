"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import CertificateFrame from "@components/Certificate/CertificateFrame";

// Public page: anyone with a certificate ID can check it is real
export default function VerifyCertificatePage() {
  const { certificateId } = useParams<{ certificateId: string }>()!;

  const { data: certificate, isLoading, isError } = useQuery({
    queryKey: ["certificate.verify", certificateId],
    queryFn: async () => (await axiosInstance.get(`/learning/verify-certificate/${encodeURIComponent(certificateId)}`)).data.certificate,
    enabled: !!certificateId,
    retry: false,
  });

  return (
    <div className="w-full bg-white px-5 pb-24 pt-10 text-[#201633] md:px-10">
      <div className="mx-auto max-w-[800px]">
        {isLoading && <p className="py-20 text-center text-[#717480]">Checking certificate...</p>}

        {isError && (
          <div className="py-16 text-center">
            <FiXCircle className="mx-auto mb-4 text-[44px] text-[#e5484d]" />
            <h1 className="mb-2 text-[22px] font-bold">Certificate not found</h1>
            <p className="mx-auto mb-6 max-w-[440px] text-[14px] leading-[1.7] text-[#717480]">
              We couldn't find a certificate with the ID <b className="break-all text-[#201633]">{certificateId}</b>. Check the ID and try again.
            </p>
            <Link href="/" className="inline-flex h-[44px] items-center rounded-full bg-[#07004d] px-8 text-[13px] font-semibold text-white">
              Back to home
            </Link>
          </div>
        )}

        {certificate && (
          <>
            <div className="mb-8 text-center">
              <FiCheckCircle className="mx-auto mb-3 text-[44px] text-[#22a559]" />
              <h1 className="text-[22px] font-bold">This certificate is genuine</h1>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#4e515c]">
                Issued by Gloxad Academy to <b>{certificate.studentName}</b> for completing <b>{certificate.courseTitle}</b>.
              </p>
            </div>
            <CertificateFrame
              studentName={certificate.studentName}
              courseTitle={certificate.courseTitle}
              instructorName={certificate.instructorName}
              certificateId={certificate.certificateId}
              issuedAt={new Date(certificate.issuedAt)}
            />
          </>
        )}
      </div>
    </div>
  );
}
