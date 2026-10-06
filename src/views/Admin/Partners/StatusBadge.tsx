import { STATUS_LABELS, TApplicationStatus } from "./data";

const TONES: Record<TApplicationStatus, string> = {
  pending: "bg-[#fff3bf] text-[#8a6d00]",
  under_review: "bg-[#d9ecfb] text-[#1d5fa8]",
  approved: "bg-[#e1f4e5] text-[#2e7d32]",
  rejected: "bg-[#fde4e4] text-[#c62828]",
};

const StatusBadge = ({ status }: { status: TApplicationStatus }) => (
  <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${TONES[status]}`}>
    {STATUS_LABELS[status]}
  </span>
);

export default StatusBadge;
