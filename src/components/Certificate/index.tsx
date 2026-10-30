import React, { forwardRef } from "react";

type TProps = {
  studentName: string;
  courseTitle: string;
  issuedAt: Date;
  certificateId: string;
  instructorName?: string;
};

const ordinal = (day: number) => {
  const rest = day % 100;
  if (rest >= 11 && rest <= 13) return `${day}th`;
  return `${day}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] || "th"}`;
};

// "July 3rd, 2025"
export const formatCertificateDate = (date: Date) =>
  `${date.toLocaleDateString("en-US", { month: "long" })} ${ordinal(date.getDate())}, ${date.getFullYear()}`;

// The certificate as designed: white page, blue corner bands, gold accents and seal. Fixed size so it captures cleanly as a PDF.
const Certificate = forwardRef<HTMLDivElement, TProps>(({ studentName, courseTitle, issuedAt, certificateId, instructorName }, ref) => (
  <div ref={ref} className="relative h-[600px] w-[800px] shrink-0 overflow-hidden bg-white text-[#0b1a6b]" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
    {/* Blue corner bands */}
    <div className="absolute -left-[60px] top-[70px] h-[26px] w-[260px] -rotate-45 bg-[#1d2fb5]" />
    <div className="absolute -left-[40px] top-[40px] h-[10px] w-[170px] -rotate-45 bg-[#4f63e0]" />
    <div className="absolute -right-[70px] bottom-[60px] h-[26px] w-[280px] -rotate-45 bg-[#1d2fb5]" />
    <div className="absolute -right-[40px] bottom-[30px] h-[10px] w-[170px] -rotate-45 bg-[#4f63e0]" />

    {/* Inner panel with gold accents */}
    <div className="absolute inset-[40px] border-r-[4px] border-t-[4px] border-[#f5b400] bg-[#f6f6fb]" />
    <div className="absolute bottom-[40px] left-[40px] h-[150px] w-[4px] bg-[#f5b400]" />
    <div className="absolute bottom-[40px] left-[40px] h-[4px] w-[190px] bg-[#f5b400]" />

    <div className="absolute inset-x-[80px] top-[100px] text-center">
      <h1 className="text-[58px] font-extrabold leading-none tracking-[0.02em]">CERTIFICATE</h1>
      <p className="mx-auto mt-3 inline-block bg-[#f5b400] px-8 py-1 text-[17px] font-semibold tracking-wide">OF COMPLETION</p>
      <p className="mt-9 font-serif text-[44px] italic leading-tight" style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}>{studentName}</p>
      <div className="mx-auto mt-1 w-[480px] border-b-2 border-dotted border-[#9aa0c8]" />
      <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.6] text-[#2b2f55]">
        has completed the <b>{courseTitle}</b> course on {formatCertificateDate(issuedAt)}.
      </p>
    </div>

    {/* Seal */}
    <div className="absolute bottom-[78px] left-1/2 flex h-[84px] w-[84px] -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#f5c542] to-[#c98a00] shadow-md">
      <div className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border-2 border-dashed border-white/70 text-center text-white">
        <span className="text-[8px] font-bold tracking-widest">GLOXAD</span>
        <span className="text-[10px] font-bold">VERIFIED</span>
      </div>
    </div>

    <div className="absolute bottom-[78px] left-[80px]">
      <div className="w-[170px] border-b border-[#9aa0c8] pb-1 text-[17px] italic">{instructorName || "Gloxad Academy"}</div>
      <p className="mt-1 text-[13px] font-bold">Course Speaker</p>
    </div>

    <div className="absolute bottom-[78px] right-[90px] text-right text-[13px] font-bold leading-[1.7]">
      <p>Date: {formatCertificateDate(issuedAt)}</p>
      <p>Certificate ID: {certificateId}</p>
    </div>
  </div>
));

Certificate.displayName = "Certificate";

export default Certificate;
