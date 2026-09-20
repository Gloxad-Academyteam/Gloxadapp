"use client";

import { useRouter } from "next/navigation";
import ScrollReveal from "@components/ScrollReveal";
import FreeGraphicDesign from "@assets/images/free-graphic-design.png";
import FreePython from "@assets/images/free-python.png";
import FreeSeo from "@assets/images/free-seo.png";
import FreeSupport from "@assets/images/free-support.png";

const freeCourses = [
  { title: "Intro to Python Programming", description: "Master the basics of Python, one of the most in-demand programming languages.", duration: "Duration: 4 hours", image: FreePython, to: "/courses?search=python" },
  { title: "Basics of Graphic Design", description: "Learn fundamental design principles and start creating visually stunning graphics.", duration: "Duration: 3 hours", image: FreeGraphicDesign, to: "/courses?search=graphic-design" },
  { title: "SEO for Beginners", description: "Boost your website's visibility with SEO fundamentals and best practices.", duration: "Duration: 2.5 hours", image: FreeSeo, to: "/courses?search=seo" },
  { title: "Intro to Web Support Tools", description: "Get comfortable with the everyday tools that power modern web support work.", duration: "Duration: 2 hours", image: FreeSupport, to: "/courses?search=support-tools" },
];

const FreeCourses = () => {
  const router = useRouter();

  return (
    <ScrollReveal className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-5 py-10 md:px-10 lg:px-[120px]">
      <div className="text-center">
        <h2 className="text-[28px] font-bold leading-[1.2] text-[#202127] md:text-[34px]">
          Start Learning for Free!
        </h2>
        <p className="mt-2 text-[15px] text-[#4e515c] mb-8">
          Explore our free courses and upgrade anytime to get a certificate!
        </p>
      </div>

      {/* ===================== MOBILE (below sm) — swipeable snap-scroll carousel ===================== */}
      {/* ===================== DESKTOP (sm and up) — static grid ===================== */}
      <div className="flex w-full max-w-[1272px] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-[20px] sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {freeCourses.map((course) => (
          <article
            key={course.title}
            onClick={() => router.push(course.to)}
            className="card-interactive flex w-[75vw] shrink-0 snap-center cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[#dedee7] bg-white sm:w-auto sm:shrink sm:snap-none"
          >
            <div className="p-3">
              <img src={course.image.src} alt={course.title} className="h-[160px] w-full rounded-[8px] object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-5 pt-2">
              <h3 className="text-[16px] font-bold leading-[1.3] text-[#202127]">{course.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.5] text-[#717480] line-clamp-2">{course.description}</p>
              <p className="mt-3 text-[13px] text-[#717480]">{course.duration}</p>
              <p className="mt-1 text-[13px] text-[#717480]">Level: Beginner</p>
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(course.to);
                  }}
                  className="btn-interactive h-[40px] w-[140px] rounded-full bg-[#181C7B] text-[13px] font-medium text-white transition hover:bg-[#111456]"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.push("/free")}
        className="mt-10 flex h-[46px] items-center justify-center rounded-full border border-[#181C7B] px-8 text-[14px] font-medium text-[#181C7B] transition hover:bg-gray-50"
      >
        View All Free Courses
      </button>
    </ScrollReveal>
  );
};

export default FreeCourses;
