"use client";

import StudentBlue from "@assets/images/hero-student-blue.png";
import StudentPink from "@assets/images/landing-student-1.png";
import StudentOrange from "@assets/images/landing-student-3.png";
import StudentYellow from "@assets/images/hero-student-yellow.png";
import HeroCutout from "@assets/images/hero-student-yellow-cutout.png";
import StudentGreen from "@assets/images/landing-student-2.png";
import StudentRed from "@assets/images/Rectangle 4204.png";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// 6 distinct photos, matching the Figma hero grid exactly — no repeats.
const gridImages = [
  { id: 1, image: StudentBlue, alt: "Student holding a notebook and pencil", bgClass: "bg-[#22b3f0]" },
  { id: 2, image: StudentPink, alt: "Student holding a red folder", bgClass: "bg-[#f2a6c1]" },
  { id: 3, image: StudentOrange, alt: "Student in an orange beanie with a laptop", bgClass: "bg-[#f27429]" },
  { id: 4, image: StudentYellow, alt: "Student with a backpack over their shoulder", bgClass: "bg-[#f2c14e]" },
  { id: 5, image: StudentGreen, alt: "Student giving a thumbs up", bgClass: "bg-[#9cc158]" },
  { id: 6, image: StudentRed, alt: "Student holding a book", bgClass: "bg-[#e8635f]" },
];

// Helper to duplicate items for infinite scrolling
const col1 = [gridImages[0], gridImages[3], gridImages[0]];
const col2 = [gridImages[1], gridImages[4], gridImages[1]];
const col3 = [gridImages[2], gridImages[5], gridImages[2]];

const infiniteCol1 = [...col1, ...col1];
const infiniteCol2 = [...col2, ...col2];
const infiniteCol3 = [...col3, ...col3];

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-[#0d0a6b] via-[#07004d] to-[#040030] text-white lg:min-h-[798px] font-sans perspective-[1000px]">
      <style>
        {`
          @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          @keyframes scrollDown {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }
          .animate-scroll-up {
            animation: scrollUp 25s linear infinite;
          }
          .animate-scroll-down {
            animation: scrollDown 30s linear infinite;
          }
          .scroll-mask {
            mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
          }
          .cylinder-wrap {
            transform: rotateX(15deg) rotateY(-5deg);
            transform-style: preserve-3d;
          }
        `}
      </style>

      <div className="relative mx-auto flex min-h-[340px] w-full max-w-[1512px] flex-col justify-center max-[399px]:min-h-0 sm:min-h-[400px] lg:min-h-0 lg:flex-row lg:justify-between items-center px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12 md:px-10 lg:px-[120px] lg:pt-[120px] lg:pb-32">
        {/* ===================== MOBILE / TABLET (below lg) — cut-out photo, no background box.
            Hidden on very small phones (< 400px) so only the text shows. ===================== */}
        <img
          src={HeroCutout.src}
          alt="Smiling student with a backpack"
          className="pointer-events-none absolute right-0 top-6 z-0 h-auto w-[30vw] min-w-[108px] max-w-[170px] max-[399px]:hidden sm:top-8 lg:hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
          }}
        />

        {/* ===================== DESKTOP (lg and up) — text column shares the row with the photo grid ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex w-full flex-col items-start pb-[8px] text-left lg:w-auto lg:max-w-[640px] lg:pb-0"
        >
          <p className="pr-[34vw] max-[399px]:pr-0 sm:pr-[200px] lg:pr-0 text-[12px] font-bold uppercase tracking-[0.08em] text-white/80 sm:text-[14px] lg:text-[24px] lg:normal-case lg:tracking-normal lg:text-white">
            Gloxad Academy
          </p>
          <h1 className="pr-[34vw] max-[399px]:pr-0 sm:pr-[200px] lg:pr-0 mt-2 font-['DM_Sans'] font-bold text-[#FFF] text-[26px] leading-[1.12] tracking-[-0.5px] sm:text-[36px] sm:tracking-[-1px] md:text-[46px] md:tracking-[-1.5px] lg:mt-6 lg:text-[64px] lg:tracking-[-2.5px] lg:leading-[1.05]">
            Where Learning Meets Opportunity
          </h1>
          <div className="mt-3 w-full max-w-[600px] lg:mt-8">
            {/* MOBILE: one short line */}
            <p className="pr-[34vw] max-[399px]:pr-0 sm:pr-[200px] lg:pr-0 text-[13px] leading-[1.55] text-white/90 sm:text-[15px] lg:hidden">
              Expert-led courses, hands-on projects and recognised certificates. Start learning today.
            </p>
            {/* DESKTOP: full copy */}
            <p className="hidden text-[16px] leading-[1.6] text-white/90 lg:block">
              Develop future-ready skills through expert-led courses, hands-on
              projects, and industry-recognized certifications. Whether you're
              building a career in technology, business, data analytics,
              artificial intelligence, or blockchain, Gloxad Academy provides the
              knowledge, experience, and opportunities you need to thrive in a
              rapidly evolving world.
            </p>
            <p className="mt-3 hidden text-[16px] leading-[1.6] text-white/90 lg:block">
              Start learning today and unlock your full potential.
            </p>

            <div className="mt-6 flex flex-row flex-nowrap gap-2 sm:gap-4 lg:mt-8">
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="btn-interactive flex h-[36px] items-center justify-center whitespace-nowrap rounded-full bg-[#4aa3df] px-3.5 text-[12px] min-[400px]:h-[40px] min-[400px]:px-5 min-[400px]:text-[13px] font-medium text-white shadow-lg transition-colors hover:bg-[#3e92cc] sm:h-[46px] sm:px-6 sm:text-[14px] lg:h-[48px] lg:w-[150px] lg:text-[15px]"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={() => router.push("/auth/signup")}
                className="btn-interactive flex h-[36px] items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-3.5 text-[12px] min-[400px]:h-[40px] min-[400px]:px-5 min-[400px]:text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-[#181C7B] sm:h-[46px] sm:px-6 sm:text-[14px] lg:h-[48px] lg:w-[170px] lg:text-[15px]"
              >
                Explore Courses
              </button>
            </div>
          </div>
        </motion.div>

        {/* ===================== DESKTOP (lg and up) — 3D infinite-scroll photo grid ===================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: [0.9, 1], scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute right-[10px] top-[-100px] bottom-[-100px] hidden w-[600px] lg:block opacity-90 lg:opacity-100 scroll-mask pointer-events-none"
        >
          <div className="cylinder-wrap flex h-[150%] gap-6 pt-[50px]">
            {/* Column 1 - Scrolls Up */}
            <div className="animate-scroll-up flex flex-col gap-6 w-[160px]">
              {infiniteCol1.map((img, idx) => (
                <div key={`col1-${idx}`} className={`relative w-full h-[400px] overflow-hidden rounded-[100px] ${img.bgClass} shrink-0 shadow-2xl`}>
                  <img src={img.image.src} alt={img.alt} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>

            {/* Column 2 - Scrolls Down */}
            <div className="animate-scroll-down flex flex-col gap-6 w-[160px] -mt-[150px]">
              {infiniteCol2.map((img, idx) => (
                <div key={`col2-${idx}`} className={`relative w-full h-[400px] overflow-hidden rounded-[100px] ${img.bgClass} shrink-0 shadow-2xl`}>
                  <img src={img.image.src} alt={img.alt} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>

            {/* Column 3 - Scrolls Up (Faster) */}
            <div className="animate-scroll-up flex flex-col gap-6 w-[160px] mt-[100px]" style={{ animationDuration: "22s" }}>
              {infiniteCol3.map((img, idx) => (
                <div key={`col3-${idx}`} className={`relative w-full h-[400px] overflow-hidden rounded-[100px] ${img.bgClass} shrink-0 shadow-2xl`}>
                  <img src={img.image.src} alt={img.alt} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
