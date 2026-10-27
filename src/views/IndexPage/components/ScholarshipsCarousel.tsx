"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { StaticImageData } from "next/image";
import ScholarshipGrant from "@assets/images/scholarship-grant.png";
import ScholarshipTech from "@assets/images/scholarship-tech.png";

export interface ScholarshipItem {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  deadline: string;
  closesOn: string;
  image: StaticImageData;
  to: string;
  badge: string;
}

export const SCHOLARSHIPS_DATA: ScholarshipItem[] = [
  {
    id: "sch-1",
    title: "Tech for All Scholarship",
    description: "Empowering learners with free access to tech courses in design, coding, and data analytics.",
    eligibility: "Eligibility: Open to anyone passionate about tech, with a strong motivation to learn.",
    deadline: "Application Deadline: March 25, 2026",
    closesOn: "2026-03-25",
    image: ScholarshipTech,
    to: "/auth/signin?redirect=/scholarships",
    badge: "Fully Funded",
  },
  {
    id: "sch-2",
    title: "Student Excellence Grant",
    description: "Rewarding high-achieving students who demonstrate academic excellence and financial need.",
    eligibility: "Eligibility: Students with outstanding academic records (GPA 3.5+ or equivalent).",
    deadline: "Application Deadline: April 15, 2026",
    closesOn: "2026-04-15",
    image: ScholarshipGrant,
    to: "/auth/signin?redirect=/scholarships",
    badge: "Merit Grant",
  },
  {
    id: "sch-3",
    title: "Women in Tech Leadership",
    description: "Empowering women in STEM with full sponsorship, mentorship, and career placement support.",
    eligibility: "Eligibility: Female students and career switchers pursuing tech and design tracks.",
    deadline: "Application Deadline: May 01, 2026",
    closesOn: "2026-05-01",
    image: ScholarshipTech,
    to: "/auth/signin?redirect=/scholarships",
    badge: "Fully Funded",
  },
  {
    id: "sch-4",
    title: "Gloxad Innovation Grant",
    description: "Seed grants and mentorship for final project capstone graduates building real products.",
    eligibility: "Eligibility: Open to top trimester project graduates with verified submissions.",
    deadline: "Application Deadline: June 10, 2026",
    closesOn: "2026-06-10",
    image: ScholarshipGrant,
    to: "/auth/signin?redirect=/scholarships",
    badge: "Project Grant",
  },
];

// Tripled dataset to ensure enough content for smooth seamless infinite loop on wide screens
// Only scholarships whose application deadline has not passed
const OPEN_SCHOLARSHIPS = SCHOLARSHIPS_DATA.filter((item) => new Date(item.closesOn) >= new Date(new Date().toDateString()));
const DUPLICATED_SCHOLARSHIPS = [...OPEN_SCHOLARSHIPS, ...OPEN_SCHOLARSHIPS, ...OPEN_SCHOLARSHIPS];

export const ScholarshipsCarousel: React.FC = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex min-h-[460px] w-full flex-col overflow-hidden rounded-[24px] md:rounded-[40px] bg-gradient-to-br from-[#6873a7] to-[#d6def4] shadow-sm px-6 pb-12 pt-14 lg:flex-row lg:px-12 lg:pb-14 lg:pt-16">
      
      {/* Left Column (Trimester Typography & CTA) */}
      <div className="flex w-full flex-col justify-center lg:w-[320px] shrink-0 z-10 lg:pr-8">
        <h2 className="text-[28px] font-semibold leading-[1.2] text-white md:text-[36px] lg:text-[42px]">
          Apply for
          <br />
          Scholarships
        </h2>
        <p className="mt-4 max-w-[380px] text-[14px] leading-[1.5] text-white/90 lg:mt-5 lg:text-[15px]">
          <span className="sm:hidden">Apply for free access to premium courses.</span>
          <span className="hidden sm:inline">We believe education should be accessible to all. Apply for our scholarships and get free access to premium courses.</span>
        </p>
        <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-[#eaf2fd] lg:hidden animate-pulse">
          <span>Hover / hold card to pause & explore</span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/scholarships")}
          className="mt-8 hidden h-[46px] w-[200px] rounded-full border border-white text-[14px] font-medium text-white transition hover:bg-white hover:text-[#6873a7] lg:block"
        >
          View All Scholarships
        </button>
      </div>

      {/* Right Column (Expanded Viewport for Cards + Peek Edge) */}
      <div className="mt-8 w-full flex-1 overflow-hidden lg:mt-0 relative [mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_97%,transparent_100%)] lg:-mr-12">
        <motion.div 
          className="flex gap-6 w-max py-2 pl-4 lg:pl-10"
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{
            duration: isHovered ? 999999 : 25,
            ease: "linear",
            repeat: Infinity,
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {DUPLICATED_SCHOLARSHIPS.map((scholarship, idx) => (
            <motion.article
              key={`${scholarship.id}-${idx}`}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={() => router.push(scholarship.to)}
              className="flex w-[280px] lg:w-[340px] shrink-0 cursor-pointer flex-col rounded-[16px] bg-white p-5 shadow-xl transition-shadow hover:shadow-2xl"
            >
              <img
                src={scholarship.image.src}
                alt={scholarship.title}
                className="h-[170px] lg:h-[190px] w-full rounded-[12px] object-cover"
              />
              <h3 className="mt-4 text-[16px] lg:text-[18px] font-semibold text-[#202127]">
                {scholarship.title}
              </h3>
              <p className="mt-2 text-[12px] lg:text-[13px] leading-[1.4] text-[#717480] line-clamp-2">
                {scholarship.description}
              </p>
              <p className="mt-2 hidden text-[12px] lg:text-[13px] leading-[1.4] text-[#717480] line-clamp-2 sm:block">
                {scholarship.eligibility}
              </p>
              <p className="mt-3 text-[11px] lg:text-[12px] font-medium text-[#f27429]">
                {scholarship.deadline}
              </p>
              <div className="mt-2">
                <span className="inline-flex h-[24px] items-center rounded-full bg-gray-100 border border-gray-200 px-3 text-[11px] font-medium text-[#4e515c]">
                  {scholarship.badge}
                </span>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(scholarship.to);
                }}
                className="mt-4 h-[36px] lg:h-[40px] w-full rounded-full bg-[#181C7B] text-[13px] lg:text-[14px] font-medium text-white transition hover:bg-[#111456]"
              >
                Apply Now
              </button>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Mobile View All Button */}
      <button
        type="button"
        onClick={() => router.push("/scholarships")}
        className="mt-6 mx-auto h-[46px] rounded-full border border-white px-8 text-[14px] font-medium text-white transition hover:bg-white hover:text-[#6873a7] lg:hidden"
      >
        View All Scholarships
      </button>
    </div>
  );
};
