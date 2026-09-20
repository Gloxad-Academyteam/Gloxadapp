"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Icons
import { FaGlobe, FaClock, FaMoneyBillWave, FaUsers, FaCheckCircle, FaUserCheck, FaBriefcase, FaComments, FaChartLine, FaVideo, FaCertificate, FaRobot, FaRocket, FaGraduationCap } from "react-icons/fa";

// Placeholder images - using existing ones or standard URLs for the layout
import HeroImage1 from "@assets/images/landing-student-1.png";
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
      question: "How do I create a course?",
      answer: "Choose a course topic, sign in to your tutor account, and follow the simple step-by-step course builder on your dashboard."
    },
    {
      question: "Do I need prior teaching experience?",
      answer: "Not necessarily. If you are an expert in your field and have a passion for sharing your knowledge, our platform provides the tools to help you succeed."
    },
    {
      question: "What subjects can I teach?",
      answer: "You can teach a wide variety of subjects including Tech, Business, Arts, Sciences, and more. If you have a skill, there is an audience for it."
    },
    {
      question: "Are there any guidelines for course creation?",
      answer: "Yes, we have a set of quality guidelines ensuring clear audio, good video quality, and structured curricula to provide the best learning experience."
    },
    {
      question: "Can I update my course after publishing?",
      answer: "Absolutely! You can continuously update your course content, add new lectures, or modify existing ones to keep your material relevant."
    }
  ];

  const benefits = [
    { icon: <FaUserCheck />, label: "Verified instructor profile" },
    { icon: <FaBriefcase />, label: "Professional portfolio" },
    { icon: <FaUsers />, label: "Student community" },
    { icon: <FaRobot />, label: "AI-powered teaching tools" },
    { icon: <FaMoneyBillWave />, label: "Revenue dashboard" },
    { icon: <FaVideo />, label: "Live webinars" },
    { icon: <FaChartLine />, label: "Course analytics" },
    { icon: <FaCertificate />, label: "Certificates" },
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
        <div className="relative z-10 mx-auto flex w-full max-w-[1512px] flex-col items-center justify-between px-5 pb-20 pt-16 sm:pt-20 md:px-10 lg:flex-row lg:px-[120px] lg:pb-[120px] lg:pt-0">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 w-full max-w-[620px] flex-1 text-left lg:w-auto"
          >
            <h2 className="mb-3 pr-[34vw] text-[12px] font-bold uppercase tracking-[0.08em] text-white/80 max-[399px]:pr-0 sm:pr-[200px] sm:text-[14px] lg:mb-4 lg:pr-0 lg:text-[18px] lg:normal-case lg:tracking-normal lg:text-white">
              Gloxad Academy
            </h2>
            <h1 className="mb-4 pr-[34vw] text-[26px] font-bold leading-[1.15] max-[399px]:pr-0 sm:pr-[200px] sm:text-[38px] md:text-[46px] lg:mb-6 lg:pr-0 lg:text-[64px] lg:leading-[1.2]">
              Join Africa&apos;s Most<br className="hidden lg:block" /> Impact-Driven<br className="hidden lg:block" /> Teaching Platform.
            </h1>
            {/* MOBILE: one short line */}
            <p className="mb-6 pr-[34vw] text-[13px] leading-[1.55] text-white/90 max-[399px]:pr-0 sm:pr-[200px] sm:text-[15px] lg:hidden">
              Teach, mentor and grow your personal brand with Africa&apos;s career-focused learning platform.
            </p>
            {/* DESKTOP: full copy */}
            <p className="mx-0 mb-8 hidden max-w-[600px] pr-4 text-[16px] leading-[1.6] text-white/90 lg:block">
              Africa&apos;s career-focused learning and talent ecosystem, where education leads directly to mentorship, employment, freelancing, entrepreneurship, and startup opportunities. Thousands of learners are looking for mentors, not just instructors. Join Gloxad and transform careers while growing your personal brand.
            </p>
            <button
              onClick={() => router.push("/auth/signup/instructor")}
              className="h-[40px] whitespace-nowrap rounded-full bg-[#4aa3df] px-5 text-[13px] font-medium text-white shadow-md transition hover:bg-[#3e92cc] sm:h-[46px] sm:px-7 sm:text-[15px] lg:h-[52px] lg:px-8 lg:text-[16px]"
            >
              Become an Instructor
            </button>
          </motion.div>

          {/* ===================== MOBILE / TABLET (below lg) — one photo, like the student hero.
              Hidden on very small phones (< 400px) so only the text shows. ===================== */}
          <img
            src={tutorGridImages[3].image.src}
            alt="Smiling instructor in a blue blazer"
            className="pointer-events-none absolute right-5 top-16 z-0 h-auto w-[30vw] min-w-[108px] max-w-[170px] max-[399px]:hidden sm:right-10 sm:top-20 lg:hidden"
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
            className="absolute right-[10px] top-[-100px] bottom-[-100px] hidden w-[600px] lg:block opacity-90 lg:opacity-100 scroll-mask pointer-events-none"
          >
            <div className="cylinder-wrap flex h-[150%] gap-6 pt-[50px]">
              {/* Column 1 - Scrolls Up */}
              <div className="animate-scroll-up flex flex-col gap-6 w-[160px] xl:w-[180px]">
                {infiniteCol1.map((img, idx) => (
                  <div key={`col1-${idx}`} className={`relative w-full h-[400px] overflow-hidden rounded-full ${img.bgClass} shrink-0 shadow-2xl`}>
                    <img src={img.image.src} alt={img.alt} className="absolute bottom-0 w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Column 2 - Scrolls Down */}
              <div className="animate-scroll-down flex flex-col gap-6 w-[160px] xl:w-[180px] -mt-[150px]">
                {infiniteCol2.map((img, idx) => (
                  <div key={`col2-${idx}`} className={`relative w-full h-[400px] overflow-hidden rounded-full ${img.bgClass} shrink-0 shadow-2xl`}>
                    <img src={img.image.src} alt={img.alt} className="absolute bottom-0 w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Column 3 - Scrolls Up (Faster) */}
              <div className="animate-scroll-up flex flex-col gap-6 w-[160px] xl:w-[180px] mt-[100px]" style={{ animationDuration: '22s' }}>
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
      <section className="relative z-20 pt-4 pb-20 px-5 lg:px-[120px] bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-[1272px]"
        >
          <div className="text-left mb-12">
            <h2 className="text-[32px] md:text-[36px] font-bold text-[#202127] mb-2">Why Teach on Gloxad</h2>
            <p className="text-[15px] md:text-[16px] text-[#717480]">Join thousands of tutors who are making an impact while earning on their own schedule.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaGlobe />, title: "Global Reach", desc: "No geographical limits, reach students worldwide from the comfort of your home." },
              { icon: <FaClock />, title: "Flexibility", desc: "Create and manage courses at your pace, teach when it's convenient for you." },
              { icon: <FaMoneyBillWave />, title: "Earnings", desc: "Get paid for every student who enrolls in your course—turn knowledge into income." },
              { icon: <FaUsers />, title: "Global Audience", desc: "Your courses are available to thousands of learners worldwide." },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center rounded-[12px] border border-[#e4e7ec] p-6 transition hover:border-[#4aa3df] hover:shadow-md bg-white">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#eef4ff] text-[#122b7a] text-[24px] mb-5">
                  {item.icon}
                </div>
                <h3 className="text-[16px] font-bold text-[#202127] mb-3">{item.title}</h3>
                <p className="text-[14px] text-[#717480] leading-[1.6]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. How It Works */}
      <section className="py-20 px-5 lg:px-[120px] bg-white">
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
            <h2 className="text-[32px] md:text-[40px] font-bold mb-4">How It Works</h2>
            <p className="text-[16px] text-white/80 mb-10 leading-relaxed">We make it easy for you to create, publish, and profit from your courses.</p>
            
            <div className="flex flex-col gap-4">
              {[
                { icon: <FaVideo />, title: "Create Your Course", desc: "We make it easy for you to create, publish, and profit from your courses." },
                { icon: <FaRocket />, title: "Publish & Promote", desc: "Make your course live and let our platform feature it. Share on social media to attract more students." },
                { icon: <FaGraduationCap />, title: "Students Enroll", desc: "Watch learners sign up for your course and start engaging with your content." },
                { icon: <FaMoneyBillWave />, title: "Earn Money", desc: "Receive payments every month based on student enrollments and engagement." },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-start border border-white/20 rounded-[20px] p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-white/40 cursor-pointer">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-white text-[#0B105E] text-[18px] mb-4 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="text-[16px] md:text-[18px] font-bold mb-2">{item.title}</h3>
                  <p className="text-[14px] text-white/80 leading-[1.6]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. As an Instructor You'll Get */}
      <section className="py-20 px-5 lg:px-[120px] bg-[#F4F7FC]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-[1272px]"
        >
          <div className="text-left mb-10">
            <h2 className="text-[32px] md:text-[36px] font-bold text-[#202127] mb-2">As an Instructor You'll Get</h2>
            <p className="text-[15px] md:text-[16px] text-[#717480]">We help experts build influence.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-center rounded-2xl py-5 px-4 text-white font-medium text-[15px] text-center shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  idx % 2 === 0 ? "bg-[#0B105E] hover:bg-[#111456]" : "bg-[#7A8BFF] hover:bg-[#6878e6]"
                }`}
              >
                <span>{benefit.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4.5 Testimonials (Hear from Our Tutors) */}
      <section className="py-20 px-5 lg:px-[120px] bg-[#F4F7FC]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-[1272px]"
        >
          <div className="text-left mb-10">
            <h2 className="text-[32px] md:text-[36px] font-bold text-[#202127] mb-2">Hear from Our Tutors</h2>
            <p className="text-[15px] md:text-[16px] text-[#717480]">Hear from our Tutors who have been using our platform</p>
          </div>

          <div className="flex flex-col gap-10 max-w-[1100px] mx-auto">
            {[
              { name: "David A.", role: "Web Development Instructor", quote: "Teaching on this platform has been life-changing. I've helped over 2,000 students and earned a stable income. The best part is seeing my students land jobs in tech after taking my courses. The platform's tools make it easy to track student progress and engagement.", align: "left", img: HeroImage1 },
              { name: "Jane B.", role: "Digital Marketing Tutor", quote: "I love the flexibility! I can teach at my own pace and still make a great living. The reach is amazing, I have students from different continents learning from me. The interactive features help me stay connected with my learners, making the teaching experience more engaging.", align: "right", img: HeroImage2 },
              { name: "Michael H.", role: "Data Science Instructor", quote: "This platform gave me the opportunity to turn my expertise into a source of income while making an impact. Teaching online is more rewarding than I ever imagined.", align: "left", img: HeroImage3 }
            ].map((tutor, idx) => (
              <div key={idx} className={`flex flex-col sm:flex-row items-center gap-10 group cursor-default ${tutor.align === 'right' ? 'sm:flex-row-reverse' : ''}`}>
                <div className="h-[100px] w-[100px] md:h-[130px] md:w-[130px] rounded-full overflow-hidden shrink-0 z-10 bg-gray-200 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-xl">
                  <img src={tutor.img.src} alt={tutor.name} className="h-full w-full object-cover object-top" />
                </div>
                <div className={`relative flex-1 rounded-md bg-[#0B105E] p-8 text-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl ${tutor.align === 'right' ? 'bg-[#5B55A9]' : ''}`}>
                   {/* Mobile Pointer (Up) */}
                   <div className={`absolute -top-[16px] left-1/2 -translate-x-1/2 h-0 w-0 border-x-[16px] border-x-transparent border-b-[16px] sm:hidden ${
                     tutor.align === 'right' ? "border-b-[#5B55A9]" : "border-b-[#0B105E]"
                   }`} />
                   
                   {/* Desktop Pointer (Left/Right) */}
                   <div className={`hidden sm:block absolute top-1/2 -translate-y-1/2 h-0 w-0 border-y-[16px] border-y-transparent ${
                      tutor.align === 'right' 
                        ? "-right-[16px] border-l-[16px] border-l-[#5B55A9]" 
                        : "-left-[16px] border-r-[16px] border-r-[#0B105E]"
                    }`} />
                   <h4 className="text-[18px] font-bold mb-1">{tutor.name}</h4>
                   <p className="text-[14px] text-white/70 mb-4 font-medium">{tutor.role}</p>
                   <p className="text-[15px] leading-[1.7]">"{tutor.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. Trusted Network of Industry Leaders */}
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
          `}
        </style>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex w-full max-w-[1272px] flex-col items-center gap-10 md:gap-14 border border-[#e4e7ec] rounded-[40px] py-14 px-4 overflow-hidden"
        >
          <h2 className="text-center text-[20px] font-bold text-[#202127] md:text-[24px]">
            Trusted Network of Industry Leaders
          </h2>
          
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
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#202127] mb-2">Frequently Asked Questions (FAQs)</h2>
          <p className="text-[15px] text-[#717480] mb-12">Find answers to the most common questions about Gloxad Academy</p>

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
              Join a community of expert tutors, impact lives, and earn money while doing what you love. <br className="hidden md:block" />Start your teaching journey today!
            </p>
            <button
              onClick={() => router.push("/auth/signup/instructor")}
              className="h-[50px] rounded-full bg-[#3F48A0] hover:bg-[#343d8a] px-10 text-[15px] font-medium text-white transition shadow-md"
            >
              Become an Instructor
            </button>
          </div>
        </motion.div>
      </section>
      </main>

    </div>
  );
};

export default TutorLandingPage;
