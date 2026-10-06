import Link from "next/link";
import { IconType } from "react-icons";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import {
  LuArrowUp,
  LuBarChart3,
  LuBookOpen,
  LuCalendar,
  LuGauge,
  LuGraduationCap,
  LuNetwork,
  LuUsers,
  LuVideo,
  LuWallet,
  LuWorkflow,
} from "react-icons/lu";
import CategoryImage from "@components/CategoryImage";
import { landingImages } from "../images";
import LandingFooter from "./LandingFooter";
import TeacherDashboardArt from "./TeacherDashboardArt";

const containerClass = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";
const cardShadow = "shadow-[0_10px_34px_-14px_rgba(40,50,140,0.18)]";

const CAPABILITIES: { title: string; text: string; Icon: IconType; span: string }[] = [
  { title: "Manage Students", text: "Comprehensive student lifecycle management from enrollment to alumni relations with unified profiles.", Icon: LuUsers, span: "lg:col-span-3" },
  { title: "Manage Teachers", text: "Schedule monitoring, performance review, and digital resource allocation for your entire faculty.", Icon: LuGraduationCap, span: "lg:col-span-3" },
  { title: "Course Creation", text: "Intuitive drag-and-drop course builder for rich, multimedia academic content.", Icon: LuBookOpen, span: "lg:col-span-2" },
  { title: "Track Performance", text: "Real-time data visualization of institutional growth and student success metrics.", Icon: LuBarChart3, span: "lg:col-span-2" },
  { title: "Live Classes", text: "Integrated low-latency video infrastructure for synchronous virtual learning.", Icon: LuVideo, span: "lg:col-span-2" },
];

const STEPS = [
  { title: "Register", text: "Submit your institutional credentials for secure environment setup." },
  { title: "Onboard", text: "System configuration and basic training for your admin team." },
  { title: "Design", text: "Structure your curriculum and department hierarchies digitally." },
  { title: "Execute", text: "Launch your first set of courses and welcome your students." },
  { title: "Scale", text: "Expand your reach and optimize through data-driven insights." },
];

const PROGRAMS = [
  { track: "Premium Track", title: "Advanced Data Science", students: "1.2k Students", duration: "12 Weeks", image: landingImages.programDataScience },
  { track: "Standard Track", title: "Full-Stack Development", students: "2.5k Students", duration: "24 Weeks", image: landingImages.programFullStack },
  { track: "Executive Track", title: "Institutional Leadership", students: "480 Leaders", duration: "8 Weeks", image: landingImages.programLeadership },
];

const BENEFITS: { title: string; text: string; Icon: IconType }[] = [
  { title: "Better Organization", text: "Centralize all institutional assets, from student records to intellectual property.", Icon: LuNetwork },
  { title: "Real-time Tracking", text: "Monitor academic progress and institutional health as it happens.", Icon: LuGauge },
  { title: "Structured Learning", text: "Ensure consistent quality across all courses with unified curriculum frameworks.", Icon: LuWorkflow },
  { title: "Additional Revenue", text: "Open new digital monetization channels with global reach capability.", Icon: LuWallet },
];

const TESTIMONIALS = [
  {
    quote: "Gloxad Academy has redefined how we perceive digital education. The level of control and clarity we have over our faculty's performance is unprecedented.",
    name: "Dr. Alistair Vance",
    role: "Dean of Innovation, Northview University",
    image: landingImages.leaderMan,
  },
  {
    quote: "The transition was remarkably smooth. Our students are more engaged, and our teachers find the dashboard tools incredibly intuitive for course management.",
    name: "Sarah Jenkins",
    role: "Director of Digital Learning, EduTech Global",
    image: landingImages.leaderWoman,
  },
];

const FAQS = [
  {
    question: "How long does the digital onboarding take?",
    answer:
      "Setup follows the five steps above: register, onboard your admin team, design your departments and curriculum, launch your first courses, then scale. Our team will confirm a timeline for your institution when your application is reviewed.",
  },
  {
    question: "Can we apply our own institutional branding?",
    answer:
      "Yes. During onboarding you upload your logo and choose your brand color and display name, which are used across your institutional portal.",
  },
  {
    question: "How reliable is the live class infrastructure?",
    answer:
      "Live classes run on integrated low-latency video infrastructure built for synchronous virtual learning. Contact our team for details on service levels for your institution.",
  },
];

const SectionHeading = ({ title, text, align = "center" }: { title: string; text: string; align?: "center" | "left" }) => (
  <div className={align === "center" ? "text-center" : ""}>
    <h2 className="text-[26px] font-bold leading-tight text-[#14162b] sm:text-[30px]">{title}</h2>
    <p className="mt-2 text-[13px] text-[#4a4d66] sm:text-[14px]">{text}</p>
  </div>
);

const LandingPage = () => (
  <div className="overflow-x-clip">
    <main>
      {/* Hero */}
      <section className="bg-[#f2f5fe]">
        <div className={`${containerClass} grid items-center gap-14 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a3d91] sm:text-[11px]">
              Precision Institutional Learning
            </p>
            <h1 className="mt-5 max-w-[620px] text-[42px] font-bold leading-[1.2] text-[#14162b] sm:text-[56px] lg:text-[62px] lg:leading-[1.38]">
              The New Standard <br className="hidden lg:block" />
              of <span className="text-[#030069]">Academic <br className="hidden lg:block" />Excellence.</span>
            </h1>
            <p className="mt-7 max-w-[500px] text-[15px] leading-[1.75] text-[#3f4257] sm:text-[16px]">
              A curated educational ecosystem designed for elite institutions. Seamlessly manage curricula, student
              engagement, and institutional growth through an editorial-grade interface.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/institution/activate"
                className="inline-flex items-center justify-center rounded-[6px] bg-[#052a78] px-9 py-4 text-[14px] font-bold text-white shadow-[0_10px_20px_-8px_rgba(5,42,120,0.6)] transition-colors hover:bg-[#031d58]"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-[6px] bg-[#cdd4fb] px-9 py-4 text-[14px] font-bold text-[#052a78] transition-colors hover:bg-[#bcc5f8]"
              >
                Request Demo
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px] lg:mx-0 lg:ml-auto">
            <img
              src={landingImages.heroBackdrop}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 w-[96%] rotate-[4deg] opacity-80"
            />
            <div className="relative aspect-[457/468] rotate-[2.4deg] overflow-hidden rounded-[34px] bg-[#c9cdd6] shadow-[0_30px_60px_-30px_rgba(20,30,90,0.45)] sm:rounded-[40px]">
              <CategoryImage
                src={landingImages.hero}
                className="h-full w-full object-cover grayscale-[0.55] contrast-[0.95] brightness-[1.04]"
                fallback={null}
              />
            </div>
            <div className="absolute -bottom-3 left-0 w-[190px] rounded-[16px] bg-white p-4 shadow-[0_18px_40px_-14px_rgba(30,40,120,0.35)] sm:-left-6 sm:bottom-4">
              <p className="font-display text-[22px] font-bold leading-none text-[#0a3d91]">98%</p>
              <p className="mt-1.5 text-[11px] leading-snug text-[#4a4d66]">Institutional retention rate across top global academies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core capabilities */}
      <section id="features" className="scroll-mt-4 bg-[#f0f3fe]">
        <div className={`${containerClass} py-16 sm:py-24`}>
          <SectionHeading align="left" title="Core Capabilities" text="The tools you need to govern your entire academic operation." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {CAPABILITIES.map(({ title, text, Icon, span }, index) => (
              <article
                key={title}
                className={`rounded-[20px] bg-white p-7 ${cardShadow} ${span} ${index === 4 ? "sm:col-span-2" : ""}`}
              >
                <Icon className="text-[#0a3d91]" size={26} />
                <h3 className="mt-5 text-[18px] font-bold text-[#14162b]">{title}</h3>
                <p className="mt-3 max-w-[460px] text-[13px] leading-[1.75] text-[#4a4d66]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Unified experience */}
      <section className="bg-white">
        <div className={`${containerClass} py-16 sm:py-24`}>
          <SectionHeading title="Unified Experience" text="A seamless platform tailored for every role within your institution." />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[358fr_342fr_358fr] lg:items-start lg:gap-7">
            {[
              { title: "Institution Dashboard", text: "Full administrative control and institutional analytics at your fingertips.", art: <img src={landingImages.institutionDashboard} alt="" className="h-full w-full object-cover" /> },
              { title: "Teacher Dashboard", text: "Focused classroom management tools and content delivery systems.", art: <TeacherDashboardArt /> },
              { title: "Student Dashboard", text: "Personalized learning paths and progress tracking for maximum engagement.", art: <img src={landingImages.studentDashboard} alt="" className="h-full w-full object-cover" /> },
            ].map(({ title, text, art }, index) => (
              <article key={title} className={index === 2 ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-20px)] lg:col-span-1 lg:mx-0 lg:w-auto" : ""}>
                <div className="aspect-square overflow-hidden rounded-[28px] bg-[#14405e] sm:rounded-[32px]">{art}</div>
                <h3 className="mt-5 px-1 text-[17px] font-bold text-[#14162b]">{title}</h3>
                <p className="mt-2 max-w-[320px] px-1 text-[12px] leading-[1.7] text-[#6a6d83]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Path to digital transformation */}
      <section id="how-it-works" className="scroll-mt-4 bg-[#02006e]">
        <div className={`${containerClass} py-16 sm:py-20`}>
          <h2 className="text-center text-[26px] font-bold text-white sm:text-[30px]">Path to Digital Transformation</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
            {STEPS.map(({ title, text }, index) => (
              <li key={title} className="relative lg:pr-8">
                <span aria-hidden className="font-display block text-[40px] font-bold leading-none text-[#2d2d9c]">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-[17px] font-bold text-white">{title}</h3>
                <p className="mt-2 max-w-[200px] text-[12px] leading-[1.7] text-[#a9acd8]">{text}</p>
                {index < STEPS.length - 1 && (
                  <span aria-hidden className="absolute right-3 top-[72px] hidden h-px w-8 bg-[#2d2d9c] lg:block" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Active programs */}
      <section className="bg-white">
        <div className={`${containerClass} py-16 sm:py-24`}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading align="left" title="Active Programs" text="Currently running high-impact institutional curricula." />
            <Link href="/institution/activate" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#0a3d91] hover:underline">
              View All Programs <FiArrowRight />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PROGRAMS.map(({ track, title, students, duration, image }) => (
              <article key={title} className={`overflow-hidden rounded-[20px] bg-white ${cardShadow}`}>
                <div className="aspect-[802/384] overflow-hidden bg-[#14405e]">
                  <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a3a1f]">{track}</p>
                  <h3 className="mt-3 text-[18px] font-bold text-[#14162b]">{title}</h3>
                  <p className="mt-4 flex items-center gap-5 text-[11px] text-[#6a6d83]">
                    <span className="inline-flex items-center gap-1.5">
                      <LuUsers size={13} /> {students}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <LuCalendar size={13} /> {duration}
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Evolve beyond traditional limits */}
      <section className="bg-[#f0f3fe]">
        <div className={`${containerClass} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <h2 className="text-[26px] font-bold leading-tight text-[#14162b] sm:text-[30px]">Evolve Beyond Traditional Limits</h2>
            <ul className="mt-9 flex flex-col gap-6">
              {BENEFITS.map(({ title, text, Icon }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#e1e7f8] text-[#0a3d91]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#14162b]">{title}</h3>
                    <p className="mt-1 max-w-[380px] text-[12px] leading-[1.7] text-[#4a4d66]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-[1.05fr_1fr] items-start gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <img src={landingImages.evolveControlRoom} alt="" loading="lazy" className="aspect-[269/235] w-full rounded-[22px] object-cover" />
              <img src={landingImages.evolveTablet} alt="" loading="lazy" className="aspect-[269/292] w-full rounded-[22px] object-cover" />
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative aspect-[257/295] overflow-hidden rounded-[22px] bg-[#04141f]">
                <CategoryImage src={landingImages.evolveGrowth} className="h-full w-full object-cover opacity-55 saturate-[0.9]" fallback={null} />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#02121c]/75 via-[#02121c]/25 to-[#02121c]/55" />
                <LuArrowUp
                  aria-hidden
                  className="absolute left-1/2 top-[12%] -translate-x-1/2 text-[#5fd3ee] drop-shadow-[0_0_14px_rgba(95,211,238,0.9)]"
                  size={64}
                  strokeWidth={2.4}
                />
              </div>
              <img src={landingImages.evolveWorldMap} alt="" loading="lazy" className="aspect-[257/234] w-full rounded-[22px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white">
        <div className={`${containerClass} py-16 sm:py-24`}>
          <h2 className="text-center text-[26px] font-bold text-[#14162b] sm:text-[30px]">Voice of the Leadership</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {TESTIMONIALS.map(({ quote, name, role, image }) => (
              <figure key={name} className={`relative rounded-[24px] bg-white p-8 sm:p-10 ${cardShadow}`}>
                <span aria-hidden className="font-display absolute right-8 top-5 text-[64px] font-bold leading-none text-[#e3e7f5]">
                  &rdquo;
                </span>
                <blockquote className="relative max-w-[400px] text-[15px] italic leading-[1.8] text-[#2a2c42]">&ldquo;{quote}&rdquo;</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[10px] bg-[#c9cfe3]">
                    <CategoryImage src={image} className="h-full w-full object-cover" fallback={null} />
                  </span>
                  <span>
                    <span className="block text-[13px] font-bold text-[#14162b]">{name}</span>
                    <span className="mt-0.5 block text-[11px] text-[#6a6d83]">{role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f0f3fe]">
        <div className="mx-auto w-full max-w-[760px] px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="text-center text-[26px] font-bold text-[#14162b] sm:text-[30px]">Frequently Asked Questions</h2>
          <div className="mt-10 flex flex-col gap-3">
            {FAQS.map(({ question, answer }) => (
              <details key={question} className={`group rounded-[12px] bg-white ${cardShadow}`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[14px] font-bold text-[#14162b] [&::-webkit-details-marker]:hidden">
                  {question}
                  <FiChevronDown className="shrink-0 text-[#4a4d66] transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-[13px] leading-[1.75] text-[#4a4d66]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-white">
        <div className={`${containerClass} py-16 sm:py-24`}>
          <div className="rounded-[26px] bg-gradient-to-r from-[#0a3a8e] via-[#0f4aa6] to-[#0b43a0] px-6 py-16 text-center shadow-[0_34px_50px_-28px_rgba(10,58,142,0.7)] sm:rounded-[30px] sm:py-24">
            <h2 className="mx-auto max-w-[860px] text-[30px] font-bold leading-[1.1] tracking-tight text-white sm:text-[44px]">
              Start managing your institution with clarity and control
            </h2>
            <p className="mt-6 text-[14px] text-[#d4def5] sm:text-[15px]">Join the next generation of digital-first academic institutions today.</p>
            <Link
              href="/institution/activate"
              className="mt-8 inline-flex items-center justify-center rounded-[8px] bg-white px-9 py-4 text-[15px] font-bold text-[#0a3d91] shadow-lg transition-colors hover:bg-[#eef2ff]"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </main>
    <LandingFooter />
  </div>
);

export default LandingPage;
