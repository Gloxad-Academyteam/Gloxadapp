"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Icons
import { FaGlobe, FaClock, FaMoneyBillWave, FaUsers, FaCheckCircle, FaUserCheck, FaBriefcase, FaChartLine, FaVideo, FaCertificate, FaRobot, FaRocket, FaGraduationCap, FaLaptopCode, FaPaintBrush, FaChartPie, FaBullhorn, FaLanguage, FaHeartbeat, FaBookOpen, FaCalculator } from "react-icons/fa";

// Placeholder images - using existing ones or standard URLs for the layout
import HeroImage2 from "@assets/images/landing-student-2.png";
import HeroImage3 from "@assets/images/landing-student-3.png";

// Figma exported Tutor Hero Grid images
import TutorGrid1 from "@assets/images/Rectangle 4198.png";
import TutorGrid2 from "@assets/images/Rectangle 4200.png";
import TutorGrid3 from "@assets/images/Rectangle 4201.png";
import TutorGrid4 from "@assets/images/Rectangle 4202.png";
import TutorGrid5 from "@assets/images/Rectangle 4203.png";
import TutorGrid6 from "@assets/images/Rectangle 4204.png";

import WomanHowItWorks from "@assets/images/womaninhowitworks.png";
import YourKnowledgeImage from "@assets/images/your-knowledge.png";

// Partner Logos for Trusted Network Section
import LogoMicrosoft from "@assets/images/Microsoft_logo_(2012).svg 1.png";
import LogoGoogle from "@assets/images/Google_2015_logo.svg 1.png";
import LogoMeta from "@assets/images/Meta_Platforms_Inc._logo.svg 1.png";
import LogoOracle from "@assets/images/Oracle_logo.svg 1.png";
import LogoMoniepoint from "@assets/images/Moniepointlogo 1.png";
import LogoPaystack from "@assets/images/Paystack_Logo 1.png";
import LogoFlutterwave from "@assets/images/Group 33598.png";
import LogoAWS from "@assets/images/Amazon_Web_Services_Logo.svg 1.png";
import LogoEIT from "@assets/images/part_eit_T 1.png";
import LogoGitHub from "@assets/images/github_PNG23 1.png";
import LogoInterswitch from "@assets/images/Interswitch_logo.svg 1.png";
import LogoACCI from "@assets/images/acci-logo-lg 1.png";

const partnerLogos = [
  LogoMicrosoft,
  LogoGoogle,
  LogoMeta,
  LogoOracle,
  LogoMoniepoint,
  LogoPaystack,
  LogoFlutterwave,
  LogoAWS,
  LogoEIT,
  LogoGitHub,
  LogoInterswitch,
  LogoACCI,
];

const tutorGridImages = [
  { image: TutorGrid1, alt: "Tutor 1", bgClass: "bg-[#00c8e0]" },
  { image: TutorGrid2, alt: "Tutor 2", bgClass: "bg-[#e5b326]" },
  { image: TutorGrid3, alt: "Tutor 3", bgClass: "bg-[#8B5A2B]" },
  { image: TutorGrid4, alt: "Tutor 4", bgClass: "bg-[#f0f0f0]" },
  { image: TutorGrid5, alt: "Tutor 5", bgClass: "bg-[#F2C94C]" },
  { image: TutorGrid6, alt: "Tutor 6", bgClass: "bg-[#EB5757]" },
];

const col1 = [tutorGridImages[0], tutorGridImages[1], tutorGridImages[0]];
const col2 = [tutorGridImages[2], tutorGridImages[3], tutorGridImages[2]];
const col3 = [tutorGridImages[4], tutorGridImages[5], tutorGridImages[4]];

const infiniteCol1 = [...col1, ...col1];
const infiniteCol2 = [...col2, ...col2];
const infiniteCol3 = [...col3, ...col3];

const TutorLandingPage = () => {
  const router = useRouter();

  const faqs = [
    {
      question: "How do I become a tutor?",
      answer: "Create a tutor account, add a short bio and your credentials, and submit your application. Our team reviews it, and once you are approved you can build and publish courses from your dashboard."
    },
    {
      question: "Do I need prior teaching experience?",
      answer: "No. What matters is that you know your subject well and explain it clearly. The course builder walks you through each step, from sections and lectures to quizzes and a trailer."
    },
    {
      question: "What can I teach?",
      answer: "Anything people want to learn for work or life: software, design, business, data, languages, creative skills, health and exam preparation. If you can show someone how, there is a learner for it."
    },
    {
      question: "How do I get paid?",
      answer: "You set the price of your course in naira, or make it free. Payments from paid enrolments show on your earnings page, and you can see what you have earned this month and to date."
    },
    {
      question: "What are the rules for course quality?",
      answer: "Courses need clear audio and video, a sensible structure and honest descriptions. Every course is reviewed before it goes live, and you get feedback if something needs to change."
    },
    {
      question: "Can I change my course after it is published?",
      answer: "Yes. You can add lectures, replace videos, fix mistakes and update your notes whenever you like, so your course stays current."
    },
    {
      question: "Can I run live classes?",
      answer: "Yes. Live classes with video, chat, polls and attendance are built into the platform, so you can teach a cohort in real time as well as through recorded lessons."
    }
  ];

  const benefits = [
    { icon: <FaUserCheck />, label: "Verified tutor profile", desc: "A profile learners can trust, with your credentials on show." },
    { icon: <FaVideo />, label: "Live classes built in", desc: "Teach in real time with video, chat, polls and attendance." },
    { icon: <FaBookOpen />, label: "Simple course builder", desc: "Sections, lectures, quizzes and resources in one place." },
    { icon: <FaMoneyBillWave />, label: "Earnings in naira", desc: "See what you earn this month and to date at a glance." },
    { icon: <FaChartLine />, label: "Course insights", desc: "Know who enrolled, how far they have got and what to improve." },
    { icon: <FaCertificate />, label: "Certificates", desc: "Learners who finish your course earn a certificate you stand behind." },
    { icon: <FaUsers />, label: "A learner community", desc: "Answer questions, read reviews and build a following." },
    { icon: <FaRobot />, label: "Tools that save time", desc: "Less admin, so more of your week goes into teaching." },
  ];

  const topics = [
    { icon: <FaLaptopCode />, label: "Software & Tech" },
    { icon: <FaPaintBrush />, label: "Design & Creative" },
    { icon: <FaChartPie />, label: "Data & AI" },
    { icon: <FaBullhorn />, label: "Marketing & Sales" },
    { icon: <FaCalculator />, label: "Business & Finance" },
    { icon: <FaLanguage />, label: "Languages" },
    { icon: <FaHeartbeat />, label: "Health & Wellness" },
    { icon: <FaGraduationCap />, label: "Exam Prep" },
  ];

  // SAMPLE QUOTES. These are written as placeholders to show the layout and tone. Before you rely on this page,
  // replace each one with a real quote (with the tutor's permission), their real name, role and photo.
  const testimonials = [
    { name: "Chidinma O.", role: "UI/UX Design Tutor, Lagos", quote: "I had been meaning to turn my design workshops into a course for years. The builder broke it into small steps, so I finally finished and published it. Seeing learners post their first projects is the best part.", img: HeroImage2.src, position: "50% 20%" },
    { name: "Tunde A.", role: "Backend Engineering Mentor, Abuja", quote: "Live classes are what made the difference for me. I teach a cohort in the evening after work, answer questions in the chat and share recordings for people who could not join.", img: "/images/trimester/photos/mentor-session.webp", position: "78% 25%" },
    { name: "Emeka N.", role: "Data Analysis Instructor, Enugu", quote: "I like that I can see how far each learner has got and fix the lessons people struggle with. My course is better now than the day I launched it.", img: HeroImage3.src, position: "50% 15%" },
  ];

  const steps = [
    { icon: <FaVideo />, title: "Create your course", desc: "Plan your sections, record or upload your lessons and add quizzes and notes. Save as a draft and come back anytime." },
    { icon: <FaCheckCircle />, title: "Get approved", desc: "Submit for review. Our team checks quality and tells you what to change if anything needs work." },
    { icon: <FaRocket />, title: "Publish and share", desc: "Your course goes live in the catalogue. Share the link with your audience and start enrolling learners." },
    { icon: <FaMoneyBillWave />, title: "Earn in naira", desc: "Each paid enrolment adds to your earnings. Track it on your dashboard." },
  ];

  return (
    <div className="w-full overflow-x-hidden bg-white font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[520px] overflow-hidden bg-[#122b7a] text-white sm:min-h-[600px] lg:min-h-[798px] font-sans perspective-[1000px] flex items-center">
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

        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#1e27a6] opacity-30 blur-[100px] pointer-events-none" />
        <div className="absolute -right-[100px] top-[20%] h-[616px] w-[621px] rounded-full bg-[#3E92CC] opacity-40 blur-[150px] pointer-events-none" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1512px] flex-col items-center justify-between px-5 pb-20 pt-16 sm:pt-20 md:px-10 lg:flex-row lg:pb-[120px] lg:pl-8 lg:pr-[330px] lg:pt-0 xl:pl-[120px] xl:pr-[570px]">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 w-full min-w-0 max-w-[620px] flex-1 text-left lg:w-auto"
          >
            <h2 className="mb-3 pr-[34vw] text-[12px] font-bold uppercase tracking-[0.08em] text-white/80 max-[359px]:pr-0 sm:pr-[200px] sm:text-[14px] lg:mb-4 lg:pr-0 lg:text-[18px] lg:normal-case lg:tracking-normal lg:text-white">
              Gloxad Academy
            </h2>
            <h1 className="mb-4 pr-[34vw] text-[26px] font-bold leading-[1.15] max-[359px]:pr-0 sm:pr-[200px] sm:text-[38px] md:text-[46px] lg:mb-6 lg:pr-0 lg:text-[42px] lg:leading-[1.15] xl:text-[54px] 2xl:text-[64px] 2xl:leading-[1.2]">
              Join Africa&apos;s Most<br className="hidden lg:block" /> Impact-Driven<br className="hidden lg:block" /> Teaching Platform.
            </h1>
            {/* MOBILE: one short line */}
            <p className="mb-6 pr-[34vw] text-[13px] leading-[1.55] text-white/90 max-[359px]:pr-0 sm:pr-[200px] sm:text-[15px] lg:hidden">
              Teach, mentor and grow your personal brand with Africa&apos;s career-focused learning platform.
            </p>
            {/* DESKTOP: full copy */}
            <p className="mx-0 mb-8 hidden max-w-[600px] text-[15px] leading-[1.6] text-white/90 lg:block xl:text-[16px]">
              Africa&apos;s career-focused learning and talent ecosystem, where education leads directly to mentorship, employment, freelancing, entrepreneurship, and startup opportunities. Learners are looking for mentors, not just instructors. Join Gloxad, help people move forward in their careers and grow your own name while you do it.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => router.push("/signup/instructor")}
                className="h-[40px] whitespace-nowrap rounded-full bg-[#4aa3df] px-5 text-[13px] font-medium text-white shadow-md transition hover:bg-[#3e92cc] sm:h-[46px] sm:px-7 sm:text-[15px] lg:h-[52px] lg:px-8 lg:text-[16px]"
              >
                Become an Instructor
              </button>
              <a
                href="#how-it-works"
                className="inline-flex h-[40px] items-center gap-2 whitespace-nowrap rounded-full border border-white/40 px-5 text-[13px] font-medium text-white transition hover:bg-white/10 sm:h-[46px] sm:px-7 sm:text-[15px] lg:h-[52px] lg:px-8 lg:text-[16px]"
              >
                See how it works
              </a>
            </div>
            <ul className="mt-6 flex max-w-[480px] flex-wrap gap-x-5 gap-y-2 pr-[34vw] text-[12px] text-white/85 max-[359px]:pr-0 sm:pr-[200px] sm:text-[13px] lg:pr-0">
              {["Free to apply", "Set your own price", "Paid in naira"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5"><FaCheckCircle className="text-[#7fd1ff]" aria-hidden /> {item}</li>
              ))}
            </ul>
          </motion.div>

          {/* ===================== MOBILE / TABLET (below lg) — one photo, like the student hero.
              Hidden on very small phones (< 360px) so only the text shows. ===================== */}
          <img
            src={tutorGridImages[3].image.src}
            alt="Smiling instructor in a blue blazer"
            className="pointer-events-none absolute right-5 top-16 z-0 h-auto w-[26vw] min-w-[96px] max-w-[160px] max-[359px]:hidden sm:right-10 sm:top-20 lg:hidden"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
            }}
          />

          {/* Desktop Right Side Image Grid (Hidden on Mobile) - 3D Infinite Scroll */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: [0.9, 1], scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-[-100px] right-[10px] top-[-100px] hidden w-[300px] opacity-90 pointer-events-none scroll-mask lg:block lg:opacity-100 xl:w-[528px]"
          >
            <div className="cylinder-wrap flex h-[150%] gap-5 pt-[50px] xl:gap-6">
              {/* Column 1 - Scrolls Up */}
              <div className="animate-scroll-up flex flex-col gap-6 w-[140px] xl:w-[160px]">
                {infiniteCol1.map((img, idx) => (
                  <div key={`col1-${idx}`} className={`relative w-full h-[400px] overflow-hidden rounded-full ${img.bgClass} shrink-0 shadow-2xl`}>
                    <img src={img.image.src} alt={img.alt} className="absolute bottom-0 w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Column 2 - Scrolls Down */}
              <div className="animate-scroll-down flex flex-col gap-6 w-[140px] xl:w-[160px] -mt-[150px]">
                {infiniteCol2.map((img, idx) => (
                  <div key={`col2-${idx}`} className={`relative w-full h-[400px] overflow-hidden rounded-full ${img.bgClass} shrink-0 shadow-2xl`}>
                    <img src={img.image.src} alt={img.alt} className="absolute bottom-0 w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Column 3 - Scrolls Up (Faster) */}
              <div className="animate-scroll-up mt-[100px] hidden w-[160px] flex-col gap-6 xl:flex" style={{ animationDuration: '22s' }}>
                {infiniteCol3.map((img, idx) => (
                  <div key={`col3-${idx}`} className={`relative w-full h-[400px] overflow-hidden rounded-full ${img.bgClass} shrink-0 shadow-2xl`}>
                    <img src={img.image.src} alt={img.alt} className="absolute bottom-0 w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="bg-white rounded-t-[60px] relative z-10 -mt-[60px] pt-16 pb-10">
      {/* 2. Why Teach on Gloxad */}
      <section className="relative z-20 pt-4 pb-16 px-5 lg:px-[120px] bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-[1272px]"
        >
          <div className="mx-auto mb-12 max-w-[640px] text-center">
            <h2 className="mb-3 text-[30px] font-bold text-[#202127] md:text-[38px]">Why teach on Gloxad</h2>
            <p className="text-[15px] leading-relaxed text-[#717480] md:text-[16px]">Share what you know, build a name for yourself and earn from it, on your own schedule.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <FaGlobe />, title: "Reach learners", desc: "Your course sits in a catalogue learners browse every day, from Lagos to across Africa and beyond." },
              { icon: <FaClock />, title: "Teach on your time", desc: "Build your course at your own pace and update it whenever you like. No fixed hours." },
              { icon: <FaMoneyBillWave />, title: "Get paid for your skill", desc: "Set your price in naira. Every paid enrolment is added to your earnings." },
              { icon: <FaCertificate />, title: "Build your name", desc: "A verified profile, reviews and certificates make you the tutor people look for." },
            ].map((item) => (
              <div key={item.title} className="group flex flex-col rounded-[20px] border border-[#e4e7ec] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#4aa3df] hover:shadow-[0_18px_40px_-20px_rgba(18,43,122,0.35)]">
                <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#eef4ff] text-[22px] text-[#122b7a] transition group-hover:bg-[#122b7a] group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-[17px] font-bold text-[#202127]">{item.title}</h3>
                <p className="text-[14px] leading-[1.65] text-[#717480]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 2.5 What you can teach */}
      <section className="px-5 pb-16 lg:px-[120px] bg-white">
        <div className="mx-auto max-w-[1272px] rounded-[28px] bg-[#F4F7FC] px-6 py-12 text-center md:px-12">
          <h2 className="mb-2 text-[24px] font-bold text-[#202127] md:text-[30px]">What can you teach?</h2>
          <p className="mx-auto mb-8 max-w-[560px] text-[15px] text-[#717480]">If people use it at work or want to learn it, it belongs here.</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {topics.map((topic) => (
              <li key={topic.label} className="inline-flex items-center gap-2.5 rounded-full border border-[#dbe3f3] bg-white px-5 py-3 text-[14px] font-medium text-[#202127] shadow-sm">
                <span className="text-[#122b7a]" aria-hidden>{topic.icon}</span>
                {topic.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="how-it-works" className="scroll-mt-24 py-16 px-5 lg:px-[120px] bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-[1272px] flex-col lg:flex-row gap-8 items-stretch"
        >
          {/* Left Image Box */}
          <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-[500px] rounded-[32px] overflow-hidden relative shadow-md">
             <img src={WomanHowItWorks.src} alt="Tutor How It Works" className="absolute w-full h-full object-cover object-center" />
          </div>
          
          {/* Right Content Box */}
          <div className="w-full lg:w-1/2 bg-[#0B105E] rounded-[32px] p-8 md:p-12 lg:p-16 text-white shadow-2xl flex flex-col justify-center">
            <h2 className="text-[32px] md:text-[40px] font-bold mb-4">How it works</h2>
            <p className="text-[16px] text-white/80 mb-8 leading-relaxed">From idea to your first paid learner in four steps.</p>

            <ol className="flex flex-col gap-4">
              {steps.map((item, idx) => (
                <li key={item.title} className="flex gap-4 rounded-[20px] border border-white/15 p-5 transition-all duration-300 hover:bg-white/10 hover:border-white/35">
                  <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-white text-[15px] font-bold text-[#0B105E]">{idx + 1}</span>
                  <div>
                    <h3 className="mb-1 flex items-center gap-2 text-[16px] md:text-[18px] font-bold">{item.title}</h3>
                    <p className="text-[14px] text-white/80 leading-[1.6]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </section>

      {/* 4. What you get */}
      <section className="py-16 px-5 lg:px-[120px] bg-[#F4F7FC]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-[1272px]"
        >
          <div className="mx-auto mb-12 max-w-[640px] text-center">
            <h2 className="mb-3 text-[30px] font-bold text-[#202127] md:text-[38px]">Everything you need to teach well</h2>
            <p className="text-[15px] leading-relaxed text-[#717480] md:text-[16px]">The tools are built in, so you spend your time on your learners, not on setup.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="rounded-[18px] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="mb-4 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-[#0B105E] text-[18px] text-white">{benefit.icon}</span>
                <h3 className="mb-1.5 text-[16px] font-bold text-[#202127]">{benefit.label}</h3>
                <p className="text-[13.5px] leading-[1.6] text-[#717480]">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4.5 Tutor comments */}
      <section className="py-16 px-5 lg:px-[120px] bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-[1272px]"
        >
          <div className="mx-auto mb-12 max-w-[640px] text-center">
            <h2 className="mb-3 text-[30px] font-bold text-[#202127] md:text-[38px]">What tutors say</h2>
            <p className="text-[15px] leading-relaxed text-[#717480] md:text-[16px]">In their own words: why they teach here and what it changed.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((tutor) => (
              <figure key={tutor.name} className="relative flex flex-col rounded-[22px] border border-[#e4e7ec] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(18,43,122,0.35)]">
                <span aria-hidden className="absolute right-6 top-4 font-serif text-[72px] leading-none text-[#e6ecf7]">&ldquo;</span>
                <blockquote className="relative flex-1 text-[15px] leading-[1.75] text-[#2b2f45]">{tutor.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3.5 border-t border-[#eef0f6] pt-5">
                  <img src={tutor.img} alt={tutor.name} loading="lazy" className="h-[52px] w-[52px] shrink-0 rounded-full object-cover" style={{ objectPosition: tutor.position }} />
                  <span>
                    <span className="block text-[15px] font-bold text-[#202127]">{tutor.name}</span>
                    <span className="block text-[13px] text-[#717480]">{tutor.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. Skills in demand */}
      <section className="py-20 px-5 lg:px-[120px] bg-white overflow-hidden">
        <style>
          {`
            @keyframes marqueeLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marqueeRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-marquee-left {
              display: flex;
              width: max-content;
              animation: marqueeLeft 30s linear infinite;
            }
            .animate-marquee-right {
              display: flex;
              width: max-content;
              animation: marqueeRight 30s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-marquee-left, .animate-marquee-right, .animate-scroll-up, .animate-scroll-down { animation: none; }
            }
          `}
        </style>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex w-full max-w-[1272px] flex-col items-center gap-10 md:gap-14 border border-[#e4e7ec] rounded-[40px] py-14 px-4 overflow-hidden"
        >
          <div className="text-center">
            <h2 className="text-[20px] font-bold text-[#202127] md:text-[26px]">Teach the skills these companies hire for</h2>
            <p className="mt-2 text-[14px] text-[#717480]">The tools and platforms our learners want to master.</p>
          </div>
          
          <div className="flex flex-col gap-10 w-[200vw] sm:w-[150vw] md:w-full overflow-hidden">
            {/* Row 1 - Slides Left */}
            <div className="animate-marquee-left gap-10 md:gap-16 items-center">
              {[...partnerLogos.slice(0, 6), ...partnerLogos.slice(0, 6), ...partnerLogos.slice(0, 6)].map((logo, index) => (
                <div key={`r1-${index}`} className="flex items-center justify-center shrink-0 w-[120px] md:w-[160px]">
                  <img src={logo.src} alt="Partner Logo" className="max-h-[36px] md:max-h-[48px] object-contain" />
                </div>
              ))}
            </div>
            
            {/* Row 2 - Slides Right */}
            <div className="animate-marquee-right gap-10 md:gap-16 items-center">
              {[...partnerLogos.slice(6, 12), ...partnerLogos.slice(6, 12), ...partnerLogos.slice(6, 12)].map((logo, index) => (
                <div key={`r2-${index}`} className="flex items-center justify-center shrink-0 w-[120px] md:w-[160px]">
                  <img src={logo.src} alt="Partner Logo" className="max-h-[36px] md:max-h-[48px] object-contain" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. FAQs */}
      <section className="relative py-20 px-5 lg:px-[120px] bg-white overflow-hidden">
        {/* Background Question Mark Graphic */}
        <div className="absolute top-10 right-[-50px] md:right-[5%] lg:right-[15%] pointer-events-none z-0 hidden md:block">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.6]">
            <circle cx="200" cy="200" r="180" stroke="#E6ECF5" strokeWidth="24"/>
            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif" fontSize="260" fontWeight="600" fill="#E6ECF5">?</text>
          </svg>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-[1000px] text-center"
        >
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#202127] mb-2">Questions tutors ask</h2>
          <p className="text-[15px] text-[#717480] mb-12">Short answers to what most people want to know before they start.</p>

          <div className="flex flex-col gap-4 text-left">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group cursor-pointer rounded-[12px] bg-[#F4F7FC] transition-all duration-300 hover:bg-[#EBF0F9] hover:shadow-md">
                <summary className="flex items-center justify-between px-5 md:px-8 py-5 md:py-6 list-none text-[15px] md:text-[16px] font-medium text-[#202127]">
                  {faq.question}
                  <span className="text-[24px] font-light transition-transform group-open:rotate-45 text-black">+</span>
                </summary>
                <div className="px-5 md:px-8 pb-5 md:pb-6 text-[14px] md:text-[15px] leading-[1.6] text-[#4e515c]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-20 px-5 lg:px-[120px] bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto max-w-[1272px] overflow-hidden rounded-2xl py-28 px-5 text-center shadow-lg"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${YourKnowledgeImage.src})` }}>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-[800px] text-white">
            <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.2] mb-6">
              Your Knowledge. Your Income.<br/>Your Impact.
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/90 mb-10 leading-relaxed max-w-[600px] mx-auto">
              Apply in a few minutes, build your first course at your own pace and start earning from what you know.
            </p>
            <button
              onClick={() => router.push("/signup/instructor")}
              className="h-[50px] rounded-full bg-[#3F48A0] hover:bg-[#343d8a] px-10 text-[15px] font-medium text-white transition shadow-md"
            >
              Become an Instructor
            </button>
            <p className="mt-4 text-[13px] text-white/75">Free to apply. Takes a few minutes.</p>
          </div>
        </motion.div>
      </section>
      </main>

    </div>
  );
};

export default TutorLandingPage;
