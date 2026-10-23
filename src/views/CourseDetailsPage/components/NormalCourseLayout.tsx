"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../../hooks/useAuth";
import { usePaystackPayment } from "react-paystack";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaCheck, FaClipboardList, FaLinkedin, FaStar, FaThumbsUp } from "react-icons/fa";
import CourseModules from "./CourseModules";
import CourseRecommendations from "./CourseRecommendations";
import CourseTestimonials from "./CourseTestimonials";
import CourseReviews from "./CourseReviews";
import LessonVideo from "@components/LessonVideo";
import { CATALOG_VIDEO_CREDIT, isEnrollmentClosed } from "@services/catalog";

type TProps = {
  course: any;
};

const NormalCourseLayout = ({ course }: TProps) => {
  const router = useRouter();
  const { authenticatedUser } = useAuth();
  const [activeTab, setActiveTab] = useState("About");
  // Course preview: the trailer, or whichever lesson was picked in the Modules list
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(
    course.trailerVideoUrl ? { url: course.trailerVideoUrl, title: course.title } : null
  );
  const priceText =
    course.priceLabel ?? (course.price > 0 ? `₦${Number(course.price).toLocaleString()}` : "Free");

  const playLesson = (lesson: { videoUrl?: string; title: string }) => {
    if (!lesson.videoUrl) return;
    setPreview({ url: lesson.videoUrl, title: lesson.title });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const tabs = [
    { name: "About", id: "about" },
    { name: "Modules", id: "modules" },
    { name: "Recommendations", id: "recommendations" },
    { name: "Trusted by Others", id: "trusted" },
    { name: "Reviews", id: "reviews" }
  ];

  const scrollToSection = (id: string, tabName: string) => {
    setActiveTab(tabName);
    const element = document.getElementById(id);
    if (element) {
      // smooth scroll with an offset for the sticky header
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const config = {
    reference: (new Date()).getTime().toString(),
    email: authenticatedUser?.email || "guest@gloxad.com",
    amount: (course.price || 0) * 100, // Amount in kobo/cents
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_dummy_key",
    metadata: {
      custom_fields: [
        {
          display_name: "Course ID",
          variable_name: "course_id",
          value: course._id
        },
        {
          display_name: "Student ID",
          variable_name: "student_id",
          value: authenticatedUser?._id || ""
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config as any);

  const onSuccess = async (reference: any) => {
    try {
      await axiosInstance.post("/enrollments/checkout", {
        courseId: course._id,
        reference: reference.reference
      });
      toast.success("Enrolled successfully!");
      router.push(`/dashboard`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to verify enrollment.");
    }
  };

  const onClose = () => {
    toast.info("Payment cancelled.");
  };

  const handleEnrollClick = () => {
    // Listed courses that can't be bought yet (no price set, or not in the database)
    if (isEnrollmentClosed(course)) {
      toast.info(`Enrolment for ${course.title} opens soon. You can watch the free lessons in the meantime.`);
      return;
    }

    if (!authenticatedUser) {
      toast.info("Please log in to enroll.");
      router.push("/auth/signin");
      return;
    }

    if (!course.price || course.price === 0) {
      // Free course enrollment
      axiosInstance.post(`/enrollments/enroll/${course._id}`)
        .then(() => {
          toast.success("Enrolled successfully!");
          router.push(`/dashboard`);
        })
        .catch((err: any) => {
          toast.error(err.response?.data?.error || "Failed to enroll.");
        });
    } else {
      // Paid course via Paystack
      initializePayment({ onSuccess, onClose } as any);
    }
  };

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen">
      {/* Premium Hero Section */}
      <div className="relative w-full bg-[#f0f4f8] pt-12 pb-32 px-5 md:px-10 lg:px-[120px] overflow-hidden">
        <div className="mx-auto max-w-[1512px] flex flex-col lg:flex-row items-center justify-between relative z-10">
          
          {/* Left Content */}
          <div className="flex min-w-0 flex-col items-start max-w-[650px] lg:pr-10">
            <img src="/gloxadlogo.png" alt="Gloxad Academy" className="h-10 object-contain mb-8" />
            
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#202127] mb-6 leading-[1.2]">
              {course.title}
            </h1>
            
            <div className="flex flex-col gap-3 mb-6">
              {/* Primary Instructor */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0">
                  <img 
                    src={course.instructor?.avatarUrl || "https://ui-avatars.com/api/?name=" + (course.instructor?.firstName || "Instructor")} 
                    alt="Instructor" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-[14px] text-[#4e515c]">
                  Instructor: <span className="font-bold underline cursor-pointer">{course.instructor?.firstName || "Judith"} {course.instructor?.lastName || "McKenzie"}</span>
                </p>
              </div>

              {/* Co-Instructors */}
              {course.instructors && course.instructors.length > 0 && (
                <div className="flex flex-col gap-2 pl-4 border-l-2 border-[#181C7B]">
                  <p className="text-[10px] text-[#717480] font-bold uppercase tracking-wider">Co-Instructors</p>
                  {course.instructors.map((inst: any) => (
                    <div key={inst._id} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-[#e2e8f0]">
                        <img 
                          src={inst.avatarUrl || "https://ui-avatars.com/api/?name=" + inst.firstName} 
                          alt={inst.firstName} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <p className="text-[13px] text-[#4e515c]">
                        <span className="font-semibold text-[#202127]">{inst.firstName} {inst.lastName}</span>
                        {inst.title && <span className="text-[11px] text-[#717480] ml-1.5">({inst.title})</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <p className="text-[14px] text-[#4e515c]">Price</p>
              <p className="text-[16px] font-bold text-[#202127] underline decoration-1 underline-offset-4">
                {priceText}
              </p>
            </div>
            
            <button onClick={handleEnrollClick} className="rounded-[4px] bg-[#181C7B] w-[200px] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-blue-900 mb-2">
              Enroll Now
            </button>
            <p className="text-[12px] text-[#202127] font-bold">
              {course.programme ? (
                <span className="font-normal text-[#4e515c]">{course.programme} · {course.modules?.length} free video lessons</span>
              ) : course.enrollmentCount > 0 ? (
                <>{course.enrollmentCount.toLocaleString()} <span className="font-normal text-[#4e515c]">already enrolled</span></>
              ) : (
                <span className="font-normal text-[#4e515c]">Be the first to enroll!</span>
              )}
            </p>
          </div>
          
          {/* Right: course preview video, or the brand shape when there's no video */}
          {preview ? (
            <div className="mt-10 w-full lg:mt-0 lg:w-[420px] xl:w-[520px] shrink-0">
              <div className="overflow-hidden rounded-[12px] bg-black shadow-2xl aspect-video">
                <LessonVideo url={preview.url} title={preview.title} className="h-full w-full" />
              </div>
              <p className="mt-3 line-clamp-1 text-[13px] text-[#4e515c]">Now playing: {preview.title}</p>
            </div>
          ) : (
          <div className="hidden lg:block w-[450px] h-[450px] relative">
            {/* Placeholder for the large abstract shape */}
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
              <path fill="#181C7B" d="M 100 0 A 100 100 0 1 0 200 100 C 200 44 156 0 100 0 Z" />
              <path fill="#1e4ed8" d="M 50 100 L 150 50 L 120 150 Z" />
            </svg>
          </div>
          )}

        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1512px] px-5 md:px-10 lg:px-[120px] relative -mt-16 z-20 pb-24">
        
        {/* 5-Column Stats Card */}
        <div className="bg-white rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#e2e8f0] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex-1 w-full md:w-auto md:border-r border-b md:border-b-0 border-gray-200 pb-4 md:pb-0 pr-0 md:pr-6">
            <h3 className="text-[16px] font-bold text-[#202127] mb-1">{course.modules?.length || 5} modules</h3>
            <p className="text-[12px] text-[#717480]">{course.modulesDescription || "Gain insight into a topic and learn the fundamentals."}</p>
          </div>
          <div className="flex-1 w-full md:w-auto md:border-r border-b md:border-b-0 border-gray-200 pb-4 md:pb-0 px-0 md:px-6">
            <h3 className="text-[16px] font-bold text-[#202127] flex items-center gap-1 mb-1">
              {course.averageRating ?? "—"} {course.averageRating ? <FaStar className="text-[#181C7B] text-[12px]" /> : null}
            </h3>
            <p className="text-[12px] text-[#717480]">
              ({course.reviewCount ?? course.reviews?.length ?? 0} reviews)
            </p>
          </div>
          <div className="flex-1 w-full md:w-auto md:border-r border-b md:border-b-0 border-gray-200 pb-4 md:pb-0 px-0 md:px-6">
            <h3 className="text-[16px] font-bold text-[#202127] mb-1">{course.level || "Entry Level"}</h3>
            <p className="text-[12px] text-[#717480]">{course.entry || course.entryLevelDescription || "No prior experience required"}</p>
          </div>
          <div className="flex-1 w-full md:w-auto md:border-r border-b md:border-b-0 border-gray-200 pb-4 md:pb-0 px-0 md:px-6">
            <h3 className="text-[16px] font-bold text-[#202127] mb-1">{course.learningType || "Self-paced Learning"}</h3>
            <p className="text-[12px] text-[#717480]">
              {course.videoHours > 0 ? `${course.videoHours} hours of video` : `Approx. ${course.duration || "14 hours"}`}
            </p>
            <p className="text-[12px] text-[#717480]">{course.learningTypeDescription || "Learn at your own pace"}</p>
          </div>
          <div className="flex-1 w-full md:w-auto pl-0 md:pl-6">
            <h3 className="text-[16px] font-bold text-[#202127] flex items-center gap-1 mb-1">
              <FaThumbsUp className="text-[#181C7B] text-[12px]" />
              {course.averageRating >= 4 ? `${Math.round((course.averageRating / 5) * 100)}%` : course.reviewCount > 0 ? `${Math.round((course.averageRating / 5) * 100)}%` : "N/A"}
            </h3>
            <p className="text-[12px] text-[#717480]">
              {course.reviewCount > 0 ? "of learners liked this course" : "No ratings yet"}
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 mb-12 border-b border-[#e2e8f0] pb-2 max-w-[1100px] relative overflow-x-auto whitespace-nowrap scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id, tab.name)}
              className={`pb-2 text-[15px] font-bold transition-colors relative shrink-0 ${
                activeTab === tab.name
                  ? "text-[#181C7B]"
                  : "text-[#202127] hover:text-[#4e515c]"
              }`}
            >
              {tab.name}
              {activeTab === tab.name && (
                <div className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-[#181C7B]"></div>
              )}
            </button>
          ))}
          {/* Decorative Entry Level tag shown in screenshot */}
          <div className="absolute right-0 bottom-3 text-[13px] font-bold text-[#202127] hidden md:block">
            {course.level || "Entry Level"}
          </div>
        </div>

        {/* --- SECTIONS (Continuous Scroll) --- */}

        {/* ABOUT SECTION */}
        <section id="about" className="max-w-[1100px] mb-16 scroll-mt-[160px]">
          {/* Checkmarks Grid */}
          <h3 className="text-[20px] font-bold text-[#202127] mb-6">What you'll learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-16">
            {(course.whatYouWillTeach?.length > 0
              ? course.whatYouWillTeach
              : ["Core concepts and foundational knowledge for this course."]
            ).map((obj: string, i: number) => (
              <div key={i} className="flex items-start gap-4">
                <FaCheck className="text-[#202127] mt-1 shrink-0 text-[12px]" />
                <p className="text-[14px] text-[#4e515c] leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>

          {/* Skills you'll gain */}
          <div className="mb-16">
            <h3 className="text-[20px] font-bold text-[#202127] mb-6">Skills you'll gain</h3>
            <div className="flex flex-wrap gap-3 items-center">
              {(course.skills?.length > 0
                ? course.skills
                : [course.topic, course.category?.name || course.category].filter(Boolean)
              ).map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-[#f0f4f8] text-[#4e515c] px-4 py-2 rounded-[4px] text-[13px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Progression pathway and fees (academic and foundation programmes) */}
          {course.pathway?.length > 0 && (
            <div className="mb-16">
              <h3 className="text-[20px] font-bold text-[#202127] mb-2">Pathway and fees</h3>
              {course.entry && <p className="text-[14px] text-[#4e515c] mb-6">{course.entry}.</p>}
              <div className="overflow-x-auto rounded-[8px] border border-[#e2e8f0] bg-white">
                <table className="w-full min-w-[560px] text-left text-[14px]">
                  <thead className="bg-[#f0f4f8] text-[12px] uppercase tracking-wider text-[#4e515c]">
                    <tr>
                      <th className="px-5 py-3 font-bold">Stage</th>
                      <th className="px-5 py-3 font-bold">Duration</th>
                      <th className="px-5 py-3 font-bold">Fee</th>
                      <th className="px-5 py-3 font-bold">Progression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.pathway.map((step: any) => (
                      <tr key={step.stage} className="border-t border-[#e2e8f0] align-top">
                        <td className="px-5 py-4 font-bold text-[#202127]">{step.stage}</td>
                        <td className="px-5 py-4 text-[#4e515c]">{step.duration}</td>
                        <td className="px-5 py-4 font-bold text-[#202127]">₦{step.fee.toLocaleString()}</td>
                        <td className="px-5 py-4 text-[#4e515c]">{step.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Details to know */}
          <div className="mb-16">
            <h3 className="text-[20px] font-bold text-[#202127] mb-8">Details to know</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">
              <div>
                <FaLinkedin className="text-[24px] text-[#0077b5] mb-3" />
                <h4 className="text-[15px] font-bold text-[#202127] mb-1">Shareable certificate</h4>
                <p className="text-[13px] text-[#717480]">Add to your LinkedIn profile</p>
              </div>
              <div>
                <FaClipboardList className="text-[24px] text-[#202127] mb-3" />
                <h4 className="text-[15px] font-bold text-[#202127] mb-1">Assessments</h4>
                <p className="text-[13px] text-[#717480]">
                  {course.modules?.filter((m: any) => m.quiz && m.quiz.title).length || 0} quizzes
                </p>
              </div>
              <div>
                <div className="w-[24px] h-[24px] flex items-center justify-center border-2 border-[#202127] rounded-[4px] mb-3">
                  <span className="font-bold text-[#202127] text-[12px]">EN</span>
                </div>
                <h4 className="text-[15px] font-bold text-[#202127] mb-1">Taught in {course.language || "English"}</h4>
                <p className="text-[13px] text-[#181C7B] font-bold">
                  {course.subtitleLanguage ? `Also available in ${course.subtitleLanguage}` : "English subtitles available"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-[#181C7B] my-8"></div>
        </section>

        {/* MODULES SECTION */}
        <section id="modules" className="mb-16 scroll-mt-[160px]">
          <h2 className="text-[28px] font-bold text-[#202127] mb-4">There are {course.modules?.length || 5} modules in this course</h2>
          <p className="text-[14px] text-[#4e515c] max-w-[800px] mb-6 leading-relaxed">
            {course.aboutCourseText || course.description}
          </p>
          {(course.isCatalog || course.videoCredit) && (
            <p className="text-[13px] text-[#717480] max-w-[800px] mb-8">
              {course.videoCredit || CATALOG_VIDEO_CREDIT} Select a lesson to play it above.
            </p>
          )}

          <CourseModules course={course} onPlayLesson={playLesson} />
        </section>

        {/* RECOMMENDATIONS SECTION */}
        <section id="recommendations" className="mb-20 scroll-mt-[160px]">
          <CourseRecommendations />
        </section>

        {/* TRUSTED BY OTHERS / TESTIMONIALS SECTION */}
        <section id="trusted" className="mb-20 scroll-mt-[160px]">
          <CourseTestimonials />
        </section>

        {/* REVIEWS SECTION */}
        <section id="reviews" className="scroll-mt-[160px]">
          <CourseReviews 
            courseId={course._id}
            reviews={course.reviews || []} 
            averageRating={course.averageRating ?? 0}
            reviewCount={course.reviewCount ?? course.reviews?.length ?? 0}
          />
        </section>

      </div>
      
    </div>
  );
};

export default NormalCourseLayout;
