"use client";

import { useRouter } from "next/navigation";
import ScrollReveal from "@components/ScrollReveal";
import YourFutureStartsHereImg from "@assets/images/yourfuturestartshereimage.png";

const FutureStartsHere = () => {
  const router = useRouter();

  return (
    <ScrollReveal className="relative w-full mt-12 pt-12 lg:mb-16 lg:pt-0">
      {/* ===================== MOBILE (below lg) — dark backdrop overlap ===================== */}
      <div className="absolute bottom-0 left-0 right-0 h-[50%] rounded-t-[32px] bg-[#181C7B] lg:hidden" />

      <div className="relative mx-auto w-full max-w-[1512px] px-5 pb-12 md:px-10 lg:px-[120px] lg:pb-0">
        <div
          className="flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[24px] bg-cover bg-center p-8 text-center text-white md:p-12 lg:min-h-[420px] lg:rounded-[28px]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${YourFutureStartsHereImg.src})`,
          }}
        >
          <h2 className="max-w-[760px] text-[26px] font-semibold leading-[1.2] md:text-[34px] lg:text-[40px]">
            Your Future Starts Here!
          </h2>
          <p className="mt-4 max-w-[640px] text-[14px] leading-[1.6] text-white/95 lg:text-[15px]">
            <span className="sm:hidden">Start any free course today and learn at your own pace.</span>
            <span className="hidden sm:inline">Every Gloxad Academy course is free. Pick a course, watch the lessons chapter by chapter, and track your progress as you learn.</span>
          </p>
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="btn-interactive mt-8 h-[46px] rounded-full bg-white px-8 text-[14px] font-semibold text-[#181C7B] transition hover:scale-105 hover:bg-gray-100 shadow-md"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default FutureStartsHere;
