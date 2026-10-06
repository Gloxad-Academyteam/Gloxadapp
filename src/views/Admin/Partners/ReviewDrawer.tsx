"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { LuBookOpen, LuBriefcase, LuCheckCircle2, LuDownload, LuFileText, LuGlobe, LuMail, LuPhone, LuUser, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import ConfirmDecisionModal from "./ConfirmDecisionModal";
import { useApplications } from "./ApplicationsContext";
import { formatDate, PLAN_OPTIONS, STATUS_LABELS, TApplication, TApplicationStatus, TPlanName } from "./data";

const fieldClass =
  "w-full rounded-[4px] border border-[#1f2380] bg-white px-4 py-3 text-[14px] text-[#14162b] outline-none focus:ring-2 focus:ring-[#1f2380]/20";

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-4">
    <h3 className="shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6a6d83]">{children}</h3>
    <span aria-hidden className="h-px flex-1 bg-[#1f2380]" />
  </div>
);

const Detail = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6a6d83]">{label}</p>
    <p className="mt-1.5 text-[14px] text-[#14162b]">{children}</p>
  </div>
);

const RepField = ({ label, Icon, value }: { label: string; Icon: typeof LuUser; value: string }) => (
  <div className="min-w-0">
    <p className="text-[15px] font-bold text-[#14162b]">{label}</p>
    <p className="mt-2 flex items-center gap-2 text-[14px] text-[#3f4257]">
      <Icon size={15} className="shrink-0" />
      <span className="truncate">{value}</span>
    </p>
  </div>
);

type TProps = { application: TApplication; onClose: () => void };

const ReviewDrawer = ({ application, onClose }: TProps) => {
  const { update } = useApplications();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [confirm, setConfirm] = useState<null | "approve" | "reject">(null);
  const { representative: rep } = application;

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.overlayOpen = "true";
    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.overlayOpen;
    };
  }, []);

  useEffect(() => {
    if (confirm) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirm, onClose]);

  const decide = () => {
    if (confirm === "approve") {
      update(application.id, { status: "approved" });
      toast.success(`Onboarding invitation sent to ${rep.email}.`);
    } else {
      update(application.id, { status: "rejected" });
      toast.info(`${application.institution} was rejected.`);
    }
    setConfirm(null);
    onClose();
  };

  const requestInfo = () => {
    update(application.id, { status: "under_review" });
    toast.info(`Information request sent to ${rep.email}.`);
  };

  const sendInvite = () => {
    if (application.status !== "approved") {
      toast.warning("Approve the institution before sending an invitation.");
      return;
    }
    toast.success(`Invitation re-sent to ${rep.email}.`);
  };

  return (
    <>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-heading"
        className="fixed bottom-0 right-0 top-[68px] z-40 flex w-full flex-col border-l border-[#1f2380] bg-white shadow-[-20px_0_60px_-20px_rgba(20,20,80,0.35)] sm:top-[74px] lg:w-[calc(100%-270px)] xl:w-[calc(100%-297px)]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-[#1f2380] bg-[#faf9f8] px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <span aria-hidden className="h-10 w-10 shrink-0 rounded-[2px] bg-[#030069]" />
            <div className="min-w-0">
              <h2 id="review-heading" className="text-[22px] font-bold leading-tight text-[#14162b]">
                Review Application
              </h2>
              <p className="truncate text-[12px] text-[#4a4d66]">
                ID: {application.id} • Submitted {formatDate(application.submittedAt)}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close review"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#14162b] transition-colors hover:bg-[#ececef]"
          >
            <LuX size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-12 pt-8 sm:px-8">
          <div className="mx-auto max-w-[1100px]">
            <SectionTitle>Institution Details</SectionTitle>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[8px] bg-[#1c1b2e] text-[#b07cf2]">
                <LuBookOpen size={34} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[22px] font-bold leading-tight text-[#030069]">{application.institution}</h3>
                <p className="mt-1.5 flex items-center gap-2 text-[14px] text-[#4a4d66]">
                  <LuGlobe size={14} /> {application.website}
                </p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Detail label="Type">{application.type}</Detail>
                  <Detail label="Address">{application.address}</Detail>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <SectionTitle>Representative Details</SectionTitle>
              <div className="mt-6 grid gap-6 rounded-[4px] border border-[#1f2380] p-6 sm:grid-cols-2 sm:gap-x-10">
                <RepField label="Full Name" Icon={LuUser} value={rep.name} />
                <RepField label="Role" Icon={LuBriefcase} value={rep.role} />
                <RepField label="Email" Icon={LuMail} value={rep.email} />
                <RepField label="Phone" Icon={LuPhone} value={rep.phone} />
              </div>
            </div>

            <div className="mt-10">
              <SectionTitle>Application Info</SectionTitle>
              <div className="mt-6 flex items-center justify-between gap-4 rounded-[2px] bg-[#3b92cc] px-4 py-4 text-white">
                <span className="text-[14px] font-bold">Expected Students</span>
                <span className="text-[18px] font-bold sm:text-[20px]">{application.expectedStudents}</span>
              </div>
              <h4 className="mt-6 text-[16px] font-bold text-[#14162b]">Requested Features</h4>
              <p className="mt-3 rounded-[4px] border border-[#1f2380] bg-[#f5f4f6] p-4 text-[14px] leading-[1.7] text-[#2a2c42]">
                {application.features}
              </p>
              <h4 className="mt-6 text-[16px] font-bold text-[#14162b]">Submitted Message</h4>
              <p className="mt-3 rounded-[4px] border border-dashed border-[#8a8da3] bg-[#faf9f8] p-4 text-[14px] leading-[1.7] text-[#2a2c42]">
                &ldquo;{application.message}&rdquo;
              </p>
            </div>

            <div className="mt-10">
              <SectionTitle>Documents</SectionTitle>
              <ul className="mt-6 flex flex-col gap-3">
                {application.documents.map((doc) => (
                  <li key={doc.name} className="flex items-center justify-between gap-4 rounded-[4px] border border-[#e1e3ee] bg-white px-4 py-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <LuFileText className="shrink-0 text-[#c62828]" size={26} />
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-bold text-[#14162b]">{doc.name}</p>
                        <p className="mt-0.5 text-[12px] text-[#4a4d66]">Verified on upload • {doc.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Document downloads aren't available in this preview.")}
                      className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#030069] hover:underline"
                    >
                      <LuDownload size={14} /> Download
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-[#1f2380] pt-4 text-center text-[12px] text-[#4a4d66]">
                Last updated by {application.updatedBy} on {application.updatedAt}
              </p>
            </div>

            <div className="mt-8 rounded-[6px] border border-[#1f2380] bg-[#f7f6f8] p-5 sm:p-6">
              <SectionTitle>Decision Controls</SectionTitle>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="decision-status" className="text-[14px] font-bold text-[#14162b]">
                    Update Status
                  </label>
                  <select
                    id="decision-status"
                    value={application.status}
                    onChange={(event) => update(application.id, { status: event.target.value as TApplicationStatus })}
                    className={`${fieldClass} mt-2`}
                  >
                    {(Object.keys(STATUS_LABELS) as TApplicationStatus[]).map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="decision-plan" className="text-[14px] font-bold text-[#14162b]">
                    Plan Assignment
                  </label>
                  <select
                    id="decision-plan"
                    value={application.plan}
                    onChange={(event) => update(application.id, { plan: event.target.value as TPlanName })}
                    className={`${fieldClass} mt-2`}
                  >
                    {PLAN_OPTIONS.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label htmlFor="decision-notes" className="mt-5 block text-[14px] font-bold text-[#14162b]">
                Internal Notes
              </label>
              <textarea
                id="decision-notes"
                rows={4}
                value={application.notes}
                onChange={(event) => update(application.id, { notes: event.target.value })}
                placeholder="Add private notes for the review team..."
                className={`${fieldClass} mt-2 resize-y`}
              />
              <p className="mt-2 text-[11px] text-[#6a6d83]">These notes are only visible to Gloxad staff.</p>

              <button
                type="button"
                onClick={() => setConfirm("approve")}
                disabled={application.status === "approved"}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#030069] px-4 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#0b0a8c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LuCheckCircle2 size={20} /> {application.status === "approved" ? "Institution Approved" : "Approve Institution"}
              </button>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={requestInfo} className="rounded-[4px] border border-[#8a8da3] bg-white px-4 py-3 text-[14px] font-bold text-[#14162b] transition-colors hover:bg-[#f2f3ff]">
                  Request Info
                </button>
                <button type="button" onClick={sendInvite} className="rounded-[4px] border border-[#8a8da3] bg-white px-4 py-3 text-[14px] font-bold text-[#14162b] transition-colors hover:bg-[#f2f3ff]">
                  Send Invite
                </button>
              </div>
              <button
                type="button"
                onClick={() => setConfirm("reject")}
                disabled={application.status === "rejected"}
                className="mt-3 w-full rounded-[4px] border border-[#d9534f] bg-white px-4 py-3 text-[14px] font-bold text-[#c62828] transition-colors hover:bg-[#fdecea] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {application.status === "rejected" ? "Application Rejected" : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {confirm && (
        <ConfirmDecisionModal variant={confirm} institution={application.institution} onConfirm={decide} onCancel={() => setConfirm(null)} />
      )}
    </>
  );
};

export default ReviewDrawer;
