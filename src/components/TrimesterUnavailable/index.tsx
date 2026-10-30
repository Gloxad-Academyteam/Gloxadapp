import Link from "next/link";
import { FiClock } from "react-icons/fi";

type TProps = {
  // "h1" on the trimester page, "h2" when the notice sits inside another page
  as?: "h1" | "h2";
};

// Trimester courses are cohort programmes. Every Gloxad course is free and self-paced for now, so none is on offer.
const TrimesterUnavailable = ({ as: Heading = "h2" }: TProps) => (
  <div className="rounded-[24px] border border-[#e5e7ef] bg-white px-6 py-14 text-center shadow-sm sm:px-12 sm:py-20">
    <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4e5] px-3.5 py-1.5 text-[12px] font-semibold text-[#b45309]">
      <FiClock className="text-[13px]" /> Not available
    </span>
    <Heading className="mx-auto mt-6 max-w-[560px] text-[26px] font-bold leading-[1.25] text-[#201633] sm:text-[34px]">
      Trimester courses are not available right now
    </Heading>
    <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.7] text-[#5b5e6b]">
      Every Gloxad Academy course is free and self-paced, so there are no trimester cohorts to join at the moment. Start any course today and learn at your own pace.
    </p>
    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href="/free"
        className="inline-flex h-[48px] items-center rounded-full bg-[#07004d] px-8 text-[14px] font-semibold text-white transition hover:bg-[#111456]"
      >
        Browse free courses
      </Link>
      <Link
        href="/"
        className="inline-flex h-[48px] items-center rounded-full border border-[#d7d9e4] px-8 text-[14px] font-semibold text-[#201633] transition hover:bg-[#f6f7fb]"
      >
        Back to home
      </Link>
    </div>
  </div>
);

export default TrimesterUnavailable;
