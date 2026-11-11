import { FiClock } from "react-icons/fi";

type TProps = {
  title?: string;
  text?: string;
  // "tile" sits in a grid beside cards; "banner" is a slim strip under a section
  variant?: "tile" | "banner";
  className?: string;
};

// A quiet marker that more is on the way, so a short list reads as "growing" instead of "finished"
const ComingSoon = ({ title = "More coming soon", text = "We are adding new courses and programs all the time.", variant = "tile", className = "" }: TProps) =>
  variant === "banner" ? (
    <div className={`flex items-center gap-3 rounded-2xl border border-dashed border-[#c9d3ee] bg-[#f6f8fd] px-5 py-4 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e3eaff] text-[#2563EB]"><FiClock aria-hidden /></span>
      <p className="text-[14px] leading-[1.5] text-[#52607A]"><b className="font-semibold text-[#0B1F4D]">{title}.</b> {text}</p>
    </div>
  ) : (
    <div className={`flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#c9d3ee] bg-[#f6f8fd] p-6 text-center ${className}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e3eaff] text-[18px] text-[#2563EB]"><FiClock aria-hidden /></span>
      <h3 className="mt-3 text-[16px] font-bold text-[#0B1F4D]">{title}</h3>
      <p className="mt-1 max-w-[240px] text-[13px] leading-[1.5] text-[#52607A]">{text}</p>
    </div>
  );

export default ComingSoon;
