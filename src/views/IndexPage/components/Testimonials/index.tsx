"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";
import { FiX } from "react-icons/fi";
import ScrollReveal from "@components/ScrollReveal";
import Avatar1 from "@assets/images/image.png";
import Avatar2 from "@assets/images/image-1.png";
import Avatar3 from "@assets/images/image-2.png";

const testimonials = [
  {
    name: "Adebola B.",
    role: "UI/UX Design",
    quote:
      "This platform transformed my career! The hands-on projects and certifications helped me land a job in just 3 months. The course content was structured in a way that made complex design principles easy to understand.",
    avatar: Avatar1,
  },
  {
    name: "Samuel A.",
    role: "Data Analysis",
    quote:
      "The flexible learning options made it easy to balance work and study. The real-world case studies and data projects were incredibly insightful — within a few months I secured a remote job as a junior data analyst!",
    avatar: Avatar2,
  },
  {
    name: "Zainab B.",
    role: "Front-end Development",
    quote:
      "I went from knowing nothing about coding to building real projects. The step-by-step tutorials and project-based approach helped me master HTML, CSS, and JavaScript, and I landed an internship soon after certifying.",
    avatar: Avatar3,
  },
];

const AUTOPLAY_MS = 4000;
const isMobileViewport = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

// Eased scroll so the auto-slide glides instead of jumping (native smooth scroll fights scroll-snap).
const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

const Testimonials = () => {
  const router = useRouter();
  const lenis = useLenis();
  const trackRef = useRef<HTMLDivElement>(null);
  const touchingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const cancelGlide = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (trackRef.current) trackRef.current.style.scrollSnapType = "";
  };

  const glideTo = (track: HTMLDivElement, left: number, duration: number) => {
    cancelGlide();
    const start = track.scrollLeft;
    const distance = left - start;
    if (Math.abs(distance) < 2) return;

    const startedAt = performance.now();
    track.style.scrollSnapType = "none"; // snapping would fight the animation
    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      track.scrollLeft = start + distance * easeInOutCubic(progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        track.style.scrollSnapType = "";
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ===================== MOBILE ONLY — auto-slide the cards, paused while one is popped out =====================
  useEffect(() => {
    if (openIndex !== null) return;

    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track || !isMobileViewport() || touchingRef.current) return;

      const cards = Array.from(track.children) as HTMLElement[];
      const center = track.scrollLeft + track.clientWidth / 2;
      let current = 0;
      let best = Infinity;
      cards.forEach((card, i) => {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (distance < best) {
          best = distance;
          current = i;
        }
      });

      const nextIndex = (current + 1) % cards.length;
      const target = cards[nextIndex];
      glideTo(track, target.offsetLeft + target.offsetWidth / 2 - track.clientWidth / 2, nextIndex === 0 ? 1400 : 900);
    }, AUTOPLAY_MS);

    return () => {
      clearInterval(id);
      cancelGlide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  // Lock page scroll + Escape to close while a card is popped out
  useEffect(() => {
    if (openIndex === null) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIndex(null);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, lenis]);

  const openItem = openIndex !== null ? testimonials[openIndex] : null;

  return (
    <ScrollReveal className="w-full bg-[#eef4ff] py-12 lg:bg-transparent lg:pb-0 lg:pt-20">
      <div className="mx-auto w-full max-w-[1572px] px-5 md:px-10 lg:px-0">
        <div className="mx-auto w-full max-w-[1300px] pl-1 text-left md:pl-4 lg:pl-12">
          <h2 className="text-[24px] font-bold text-[#202127] md:text-[30px]">What Our Students Say</h2>
          <p className="mt-2 hidden text-[14px] text-[#4e515c] sm:block lg:text-[15px]">
            Hear from our students who have transformed their careers through our expert-led courses.
          </p>
        </div>

        {/* ===================== MOBILE (below lg) — horizontal snap-scroll cards ===================== */}
        {/* ===================== DESKTOP (lg and up) — stacked, alternating chat bubbles ===================== */}
        <div
          ref={trackRef}
          onTouchStart={() => {
            touchingRef.current = true;
            cancelGlide();
          }}
          onTouchEnd={() => {
            setTimeout(() => {
              touchingRef.current = false;
            }, 3500);
          }}
          className="relative mt-10 md:mt-12 flex w-[calc(100%+40px)] flex-row gap-4 overflow-x-auto snap-x snap-mandatory pb-8 px-[7.5vw] -mx-5 md:w-[calc(100%+80px)] md:-mx-10 lg:w-full lg:flex-col lg:gap-10 lg:overflow-visible lg:px-0 lg:mx-auto max-w-none lg:max-w-[1300px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item, index) => {
            const isLeftAligned = index % 2 === 0;
            const bubbleBg = isLeftAligned ? "bg-black text-white" : "bg-[#4a55a2] text-white";

            return (
              <article
                key={item.name}
                onClick={() => isMobileViewport() && setOpenIndex(index)}
                className={`cursor-pointer lg:cursor-default flex flex-col items-center w-[85vw] shrink-0 snap-center lg:w-[85%] lg:flex-row lg:items-center lg:gap-8 lg:shrink lg:snap-none ${
                  isLeftAligned ? "lg:self-start" : "lg:self-end lg:flex-row-reverse"
                }`}
              >
                <div className="z-10 -mb-[35px] lg:mb-0 h-[70px] w-[70px] lg:h-[100px] lg:w-[100px] shrink-0 overflow-hidden rounded-full shadow-md border-[4px] border-white">
                  <img src={item.avatar.src} alt={item.name} className="h-full w-full object-cover" />
                </div>

                <div className={`relative flex-1 w-full rounded-[24px] ${bubbleBg} pt-[48px] pb-8 px-6 lg:p-9 shadow-sm`}>
                  <div
                    className={`hidden lg:block absolute top-1/2 -translate-y-1/2 h-0 w-0 border-y-[16px] border-y-transparent ${
                      isLeftAligned ? "-left-[18px] border-r-[20px] border-r-black" : "-right-[18px] border-l-[20px] border-l-[#4a55a2]"
                    }`}
                  />
                  <div className="relative z-10 text-left">
                    <h3 className="text-[16px] lg:text-[18px] font-bold">{item.name}</h3>
                    <p className="text-[13px] lg:text-[14px] text-white/80">{item.role}</p>
                    <p className="mt-3 line-clamp-4 text-[14px] leading-[1.6] lg:mt-4 lg:line-clamp-none lg:text-[15px]">&quot;{item.quote}&quot;</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center lg:justify-start lg:hidden">
          <button
            type="button"
            onClick={() => router.push("/courses")}
            className="btn-interactive h-[46px] rounded-full bg-[#181C7B] px-8 text-[14px] font-medium text-white transition hover:bg-[#111456]"
          >
            Start Learning
          </button>
        </div>
      </div>

      {/* ===================== MOBILE ONLY — popped-out testimonial ===================== */}
      {/* Rendered in a portal so it is not affected by the section's scroll-reveal transform */}
      {typeof document !== "undefined" &&
        createPortal(
      <AnimatePresence>
        {openItem && openIndex !== null && (
          <motion.div
            key="testimonial-popout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm lg:hidden"
            onClick={() => setOpenIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${openItem.name}'s testimonial`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[400px]"
            >
              <div className="relative z-10 mx-auto -mb-[42px] h-[84px] w-[84px] overflow-hidden rounded-full border-[4px] border-white shadow-md">
                <img src={openItem.avatar.src} alt={openItem.name} className="h-full w-full object-cover" />
              </div>
              <div
                className={`relative max-h-[70dvh] overflow-y-auto rounded-[24px] px-6 pb-7 pt-[58px] text-white shadow-xl ${
                  openIndex % 2 === 0 ? "bg-black" : "bg-[#4a55a2]"
                }`}
              >
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpenIndex(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[16px] text-white transition hover:bg-white/25"
                >
                  <FiX />
                </button>
                <h3 className="text-center text-[18px] font-bold">{openItem.name}</h3>
                <p className="text-center text-[13px] text-white/80">{openItem.role}</p>
                <p className="mt-4 text-[14px] leading-[1.7]">&quot;{openItem.quote}&quot;</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body
        )}
    </ScrollReveal>
  );
};

export default Testimonials;
