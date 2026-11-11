"use client";

import { FaQuoteLeft } from "react-icons/fa6";
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

// Three quiet cards: a grid on large screens, a swipe row on phones and tablets
const Testimonials = () => (
  <ScrollReveal className="w-full bg-[#f6f8fd] py-14 md:py-20">
    <div className="mx-auto w-full max-w-[1512px] px-5 md:px-10 lg:px-[120px]">
      <header className="mx-auto max-w-[640px] text-center">
        <h2 className="text-[26px] font-bold leading-[1.2] text-[#202127] md:text-[32px]">What our students say</h2>
        <p className="mt-3 text-[14px] leading-[1.65] text-[#4e515c] md:text-[15px]">
          Hear from learners who have moved their careers forward with Gloxad Academy.
        </p>
      </header>

      <div
        className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
        aria-label="Student testimonials"
      >
        {testimonials.map((item) => (
          <figure
            key={item.name}
            className="flex w-[84%] max-w-[420px] shrink-0 snap-center flex-col rounded-2xl border border-[#e3e8f4] bg-white p-6 shadow-[0_1px_2px_rgba(11,31,77,0.04)] sm:w-[60%] lg:w-auto lg:max-w-none lg:p-7"
          >
            <FaQuoteLeft aria-hidden className="text-[20px] text-[#c3cde8]" />
            <blockquote className="mt-4 flex-1 text-[15px] leading-[1.75] text-[#37394b]">{item.quote}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-[#eef1f8] pt-5">
              <img src={item.avatar.src} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold text-[#202127]">{item.name}</p>
                <p className="truncate text-[13px] text-[#6b6d76]">{item.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </ScrollReveal>
);

export default Testimonials;
