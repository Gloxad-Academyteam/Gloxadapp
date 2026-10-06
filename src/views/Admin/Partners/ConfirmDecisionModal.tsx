"use client";

import { useEffect, useRef } from "react";
import { LuInfo, LuShieldAlert, LuShieldCheck } from "react-icons/lu";

type TProps = {
  variant: "approve" | "reject";
  institution: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const COPY = {
  approve: {
    title: "Confirm Institutional Approval",
    action: "Confirm & Send Invite",
    detail: "This will automatically send an onboarding invitation email to the primary representative.",
    footer: "Action is permanent once sent",
  },
  reject: {
    title: "Confirm Rejection",
    action: "Confirm Rejection",
    detail: "The primary representative will be notified that the application was not accepted.",
    footer: "Notification is sent immediately",
  },
} as const;

// Final confirmation before an irreversible decision; Cancel has focus so Enter never confirms by accident
const ConfirmDecisionModal = ({ variant, institution, onConfirm, onCancel }: TProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const copy = COPY[variant];
  const Icon = variant === "approve" ? LuShieldCheck : LuShieldAlert;

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3a3a3a]/60 p-4 backdrop-blur-[3px]"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="decision-title"
        aria-describedby="decision-text"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[450px] overflow-hidden rounded-[8px] bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="px-6 pb-8 pt-8 text-center sm:px-8">
          <span
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[10px] ${
              variant === "approve" ? "bg-[#ececef] text-[#030069]" : "bg-[#fde8e8] text-[#c62828]"
            }`}
          >
            <Icon size={30} strokeWidth={1.7} />
          </span>
          <h2 id="decision-title" className="mt-6 text-[24px] font-bold leading-tight text-[#030069] sm:text-[26px]">
            {copy.title}
          </h2>
          <p id="decision-text" className="mt-4 text-[15px] leading-[1.75] text-[#3f4257]">
            Are you sure you want to {variant === "approve" ? "approve" : "reject"} &ldquo;
            <strong className="font-bold text-[#14162b]">{institution}</strong>&rdquo;? {copy.detail}
          </p>
          <button
            type="button"
            onClick={onConfirm}
            className={`mt-7 w-full rounded-[4px] px-4 py-3.5 text-[14px] font-bold text-white transition-colors ${
              variant === "approve" ? "bg-[#030069] hover:bg-[#0b0a8c]" : "bg-[#c62828] hover:bg-[#a81f1f]"
            }`}
          >
            {copy.action}
          </button>
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="mt-4 text-[14px] font-medium text-[#14162b] underline underline-offset-4 hover:text-[#030069]"
          >
            Cancel
          </button>
        </div>
        <p className="flex items-center justify-center gap-2 border-t border-[#030069] bg-[#f0f0f2] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[#4a4d66]">
          <LuInfo size={14} /> {copy.footer}
        </p>
      </div>
    </div>
  );
};

export default ConfirmDecisionModal;
