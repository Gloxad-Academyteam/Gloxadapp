import Hero from "./components/Hero";
import ExploreCourses from "./components/ExploreCourses";
import TrimesterBanner from "./components/TrimesterBanner";
import { ScholarshipsCarousel } from "./components/ScholarshipsCarousel";
import TrustedPartners from "./components/TrustedPartners";
import FreeCourses from "./components/FreeCourses";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import FAQSection from "./components/FAQSection";
import FutureStartsHere from "./components/FutureStartsHere";
import TutorCoursesOnly from "@components/TutorCoursesOnly";

type IndexPageProps = {
  /** "dashboard" renders the slim, text-only hero used inside the signed-in student dashboard. */
  variant?: "public" | "dashboard";
};

const IndexPage = ({ variant = "public" }: IndexPageProps) => {
  return (
    <div className="w-full overflow-x-hidden bg-[#181C7B] font-sans">
      <Hero compact={variant === "dashboard"} />

      <main className="bg-white rounded-t-[40px] relative z-10 -mt-[40px] pt-8 md:pt-14 pb-16 shadow-[0_-20px_60px_rgba(0,0,0,0.25)] border-t border-white/10">
        <TutorCoursesOnly>
          <ExploreCourses />
        </TutorCoursesOnly>

        <div className="mx-auto flex flex-col gap-8 w-full max-w-[1272px] px-5 md:px-10 lg:px-0 mb-16">
          <TrimesterBanner />
          <ScholarshipsCarousel />
        </div>

        <TrustedPartners />
        <FreeCourses />
        <HowItWorks />
        <Testimonials />

        <div id="faqs" className="mx-auto w-full max-w-[1272px] px-5 py-10 md:px-10 md:py-14 lg:px-0">
          <FAQSection />
        </div>

        <FutureStartsHere />
      </main>
    </div>
  );
};

export default IndexPage;
