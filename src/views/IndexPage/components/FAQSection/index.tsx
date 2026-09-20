"use client";

import { useState } from "react";
import ScrollReveal from "@components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer: "Create a free Gloxad Academy account, browse the course catalog, and click Enroll on any course. You'll get instant access to the course content.",
  },
  {
    question: "Are the courses self-paced or instructor-led?",
    answer: "Both — most courses are self-paced so you can learn on your own schedule, while trimester courses run on a fixed schedule with live instructor sessions and discussions.",
  },
  {
    question: "Will I receive a certificate after completing a course?",
    answer: "Yes. Every completed course, whether free or paid, earns you a shareable certificate you can add to your resume or LinkedIn profile.",
  },
  {
    question: "Do I need prior experience to take a course?",
    answer: "No prior experience is required for beginner-level courses. Each course lists its recommended level so you can pick the right starting point.",
  },
  {
    question: "Can I access the courses on mobile devices?",
    answer: "Yes. Gloxad Academy works on any modern phone, tablet, or desktop browser, so you can keep learning wherever you are.",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      className="border border-neutral-4 rounded-[12px] overflow-hidden bg-primary-1"
      whileHover={{
        borderColor: "#D6B9FF",
      }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onClick}
        className="flex w-full cursor-pointer items-center justify-between p-4 sm:p-5 bg-transparent border-none text-left"
      >
        <h3 className="pr-4 text-[15px] font-medium leading-snug text-neutral-11 sm:text-[16px]">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ flexShrink: 0 }}
        >
          <FaChevronDown style={{ color: "#030069", fontSize: 14 }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-[14px] leading-relaxed text-neutral-7 sm:px-5 sm:pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative flex flex-col items-center gap-6 sm:gap-8">
      <div className="absolute -top-16 right-0 -z-10 hidden h-[420px] w-[420px] items-center justify-center overflow-hidden rounded-full border-[6px] border-[#f4f7fb] lg:flex">
        <span className="text-[320px] font-normal text-[#f4f7fb] translate-y-[-10px]">?</span>
      </div>

      <ScrollReveal className="w-full">
        <div className="text-center">
          <h2 className="text-[22px] font-medium leading-tight text-neutral-11 sm:text-[26px] md:text-[30px]">
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-[13px] text-neutral-7 sm:text-[15px]">
            Find answers to the most common questions about Gloxad Academy
          </p>
        </div>
      </ScrollReveal>

      <div className="relative z-10 mx-auto flex w-full max-w-[720px] flex-col gap-2 self-center sm:gap-2.5">
        {faqs.map((faq, index) => (
          <ScrollReveal key={index} delay={index * 0.06}>
            <FAQItem
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
