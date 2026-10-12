"use client";

import { useEffect, useState } from "react";
import { MdOutlineCode, MdOutlineHourglassTop, MdOutlinePictureAsPdf, MdOutlineSchool, MdOutlineShare, MdOutlineVerified, MdOutlineWorkspacePremium } from "react-icons/md";
import { LuX } from "react-icons/lu";
import useAuth from "@hooks/useAuth";
import LmsShell from "./components/LmsShell";
import { cardClass } from "./components/ui";
import { EARNED, IN_PROGRESS } from "./data";

type TEarned = (typeof EARNED)[number];

const linkedInUrl = (credential: TEarned) => {
  const [month, , year] = credential.completed.replace(",", "").split(" ");
  const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month) + 1;
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: credential.title,
    organizationName: "Gloxad Academy",
    issueYear: year ?? "",
    issueMonth: String(monthIndex || 1),
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
};

const CertificatesPage = () => {
  const { authenticatedUser: user } = useAuth();
  const [preview, setPreview] = useState<TEarned | null>(null);
  const holder = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.name || "Student";

  useEffect(() => {
    if (!preview) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  return (
    <LmsShell topTab="certificates" topBrand>
      <div className="mx-auto max-w-[1200px]">
        <h1 className="text-[34px] font-bold leading-[1.1] tracking-tight text-[#1a1a7a] sm:text-[48px]">Certificates &amp; Credentials</h1>
        <p className="mt-4 max-w-[760px] text-[15px] leading-relaxed text-[#2a2c42] sm:text-[17px]">
          Manage and showcase your academic achievements from the Gloxad Trimester Program.
        </p>

        <section aria-labelledby="progress-title" className="mt-12">
          <h2 id="progress-title" className="flex items-center gap-3 text-[24px] font-medium text-[#14162b]">
            <MdOutlineHourglassTop size={26} className="text-[#00658f]" /> In Progress
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,330px))]">
            {IN_PROGRESS.map((item) => (
              <article key={item.title} className={`${cardClass} flex flex-col p-6`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#dcebf6] px-3.5 py-1 text-[12px] font-medium text-[#0b5f8a]">{item.trimester}</span>
                  {item.icon === "cap" ? <MdOutlineSchool size={22} className="text-[#4a4d66]" /> : <MdOutlineCode size={22} className="text-[#4a4d66]" />}
                </div>
                <h3 className="mt-5 text-[21px] font-medium leading-snug text-[#1a1a7a]">{item.title}</h3>
                <p className="mt-auto pt-8 text-[13px] text-[#2a2c42]">Expected completion: {item.expected}</p>
                <div className="mt-5 flex items-center justify-between text-[13px]">
                  <span className="text-[#14162b]">Progress</span>
                  <span className="font-medium text-[#00658f]">{item.progress}%</span>
                </div>
                <div role="progressbar" aria-label={`${item.title} progress`} aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-[7px] overflow-hidden rounded-full bg-[#e8e7f1]">
                  <div className="h-full rounded-full bg-[#6cc1ff]" style={{ width: `${item.progress}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="earned-title" className="mt-14">
          <h2 id="earned-title" className="flex items-center gap-3 text-[24px] font-medium text-[#14162b]">
            <MdOutlineVerified size={26} className="text-[#1a1a7a]" /> Earned Credentials
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,300px))]">
            {EARNED.map((credential) => (
              <article key={credential.title} className={`${cardClass} overflow-hidden`}>
                <div className="bg-[#e9e7f1] p-3.5">
                  <div className="flex h-[128px] flex-col items-center justify-center rounded-[4px] bg-white">
                    <MdOutlineWorkspacePremium size={36} className={credential.tone === "navy" ? "text-[#020060]" : "text-[#00658f]"} />
                    <p className={`mt-2 text-[12px] font-medium uppercase tracking-[0.18em] ${credential.tone === "navy" ? "text-[#020060]" : "text-[#00658f]"}`}>{credential.badge}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="inline-block rounded-[4px] bg-[#f1effa] px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-[#2a2c42]">Completed: {credential.completed}</p>
                  <h3 className="mt-4 text-[22px] font-bold leading-snug text-[#1a1a7a]">{credential.title}</h3>
                  <p className="mt-2 text-[14px] text-[#2a2c42]">{credential.subtitle}</p>
                  <button
                    type="button"
                    onClick={() => setPreview(credential)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#1a1a7a] px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#10107a]"
                  >
                    <MdOutlinePictureAsPdf size={20} /> View PDF
                  </button>
                  <a
                    href={linkedInUrl(credential)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#00658f] px-4 py-3 text-[14px] font-medium text-[#00658f] transition-colors hover:bg-[#eef6fb]"
                  >
                    <MdOutlineShare size={18} /> Share to LinkedIn
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0a2a]/60 p-4 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <div role="dialog" aria-modal="true" aria-label="Certificate preview" onClick={(event) => event.stopPropagation()} className="w-full max-w-[760px] rounded-[16px] bg-white p-4 shadow-2xl sm:p-6">
            <div className="flex justify-end">
              <button type="button" aria-label="Close preview" autoFocus onClick={() => setPreview(null)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f3f1fb]">
                <LuX size={20} />
              </button>
            </div>
            <div className="m-1 rounded-[6px] border-[6px] border-double border-[#1a1a7a] px-6 py-10 text-center sm:px-14 sm:py-14">
              <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-[#4a4d66]">Gloxad Academy</p>
              <h2 className="mt-4 text-[28px] font-bold text-[#1a1a7a] sm:text-[36px]">Certificate of Completion</h2>
              <p className="mt-6 text-[14px] text-[#4a4d66]">This certifies that</p>
              <p className="mt-2 text-[26px] font-bold text-[#14162b] sm:text-[32px]">{holder}</p>
              <p className="mt-4 text-[14px] text-[#4a4d66]">has successfully completed</p>
              <p className="mt-2 text-[20px] font-medium text-[#1a1a7a] sm:text-[24px]">{preview.title}</p>
              <p className="mt-1 text-[13px] text-[#4a4d66]">{preview.subtitle}</p>
              <div className="mt-8 flex items-center justify-between text-left text-[12px] text-[#4a4d66]">
                <span>Completed: {preview.completed}</span>
                <MdOutlineWorkspacePremium size={40} className="text-[#1a1a7a]" />
                <span>Gloxad Trimester Program</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </LmsShell>
  );
};

export default CertificatesPage;
