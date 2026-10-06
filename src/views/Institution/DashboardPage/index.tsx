"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import { FiCheck, FiEdit2 } from "react-icons/fi";
import {
  LuAlertTriangle,
  LuArrowUpRight,
  LuBarChart3,
  LuBanknote,
  LuBell,
  LuBookOpen,
  LuCalendar,
  LuDownload,
  LuFileText,
  LuGraduationCap,
  LuHelpCircle,
  LuLayoutDashboard,
  LuLayoutGrid,
  LuLifeBuoy,
  LuMenu,
  LuPlus,
  LuSearch,
  LuSettings,
  LuTrendingUp,
  LuUserPlus,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";
import CategoryImage from "@components/CategoryImage";
import { useOnboarding } from "../context/OnboardingContext";
import { institutionImages } from "../images";

const NAV: { label: string; Icon: IconType }[] = [
  { label: "Dashboard", Icon: LuLayoutDashboard },
  { label: "Teachers", Icon: LuUsers },
  { label: "Students", Icon: LuUsers },
  { label: "Curriculum", Icon: LuBookOpen },
  { label: "Faculty", Icon: LuGraduationCap },
  { label: "Finances", Icon: LuBanknote },
  { label: "Analytics", Icon: LuBarChart3 },
];

const STATS: { label: string; value: string; trend: string; Icon: IconType; tone: string; positive?: boolean; featured?: boolean }[] = [
  { label: "Total Students", value: "14,282", trend: "+12%", Icon: LuUsers, tone: "bg-[#e1e8fb] text-[#0a3d91]", positive: true, featured: true },
  { label: "Total Teachers", value: "843", trend: "+4%", Icon: LuGraduationCap, tone: "bg-[#e1e8fb] text-[#0a3d91]", positive: true },
  { label: "Active Courses", value: "126", trend: "Stable", Icon: LuBookOpen, tone: "bg-[#fde7dc] text-[#b4501e]" },
  { label: "Inst. Growth", value: "94.8%", trend: "+2.4%", Icon: LuTrendingUp, tone: "bg-[#e1e8fb] text-[#0a3d91]", positive: true },
];

const PROGRAMS = [
  {
    title: "Advanced Data Science",
    tags: [
      ["ADVANCED", "bg-[#dbe7fb] text-[#0a3d91]"],
      ["STEM", "bg-[#eceef5] text-[#4a4d66]"],
    ],
    avatars: [institutionImages.avatarWoman, institutionImages.avatarMan],
    extra: "+124",
    enrolled: "1,402",
    progress: 68,
  },
  {
    title: "Digital Architecture I",
    tags: [
      ["FOUNDATION", "bg-[#fde7dc] text-[#b4501e]"],
      ["DESIGN", "bg-[#eceef5] text-[#4a4d66]"],
    ],
    avatars: [institutionImages.avatarWoman2, institutionImages.avatarMan2],
    extra: "+82",
    enrolled: "894",
    progress: 42,
  },
];

const CHART = [
  { day: "Mon", height: 42, color: "#335b9a" },
  { day: "Tue", height: 66, color: "#6485b9" },
  { day: "Wed", height: 30, color: "#2c5392" },
  { day: "Thu", height: 80, color: "#9db0d0" },
  { day: "Fri", height: 50, color: "#47699f" },
  { day: "Sat", height: 92, color: "#cdd6e6" },
  { day: "Sun", height: 44, color: "#3d629d" },
];

const ACTIVITY: { text: string; meta: string; Icon: IconType; tone: string }[] = [
  { text: "Fee payment processed for 124 students", meta: "12 minutes ago • Finances", Icon: FiCheck, tone: "bg-[#d9f2e0] text-[#1e7e4b]" },
  { text: "Dr. Sarah Jenkins updated 'Bio-Ethics' syllabus", meta: "2 hours ago • Curriculum", Icon: FiEdit2, tone: "bg-[#dbe7fb] text-[#0a55c8]" },
  { text: "Server maintenance scheduled for 02:00 AM", meta: "5 hours ago • Systems", Icon: LuAlertTriangle, tone: "bg-[#fde7dc] text-[#c2410c]" },
  { text: "New course 'AI Ethics' has been approved", meta: "Yesterday • Faculty", Icon: LuGraduationCap, tone: "bg-[#ece3fb] text-[#6d3fc4]" },
];

const formatToday = (date: Date) =>
  `${date.toLocaleDateString("en-US", { weekday: "long" })}, ${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

const comingSoon = (label: string) => toast.info(`${label} is coming soon.`);

const DashboardPage = () => {
  const { state } = useOnboarding();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => setToday(formatToday(new Date())), []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const institutionName = state.branding.displayName || "Gloxad University";
  const tagline = state.branding.tagline || "Institutional Portal";

  const sidebar = (
    <div className="flex h-full flex-col px-4 py-8">
      <div className="px-3">
        <h2 className="font-display text-[26px] font-bold leading-tight text-[#0a3d91]">{institutionName}</h2>
        <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.18em] text-[#4a4d66]">{tagline}</p>
      </div>
      <nav aria-label="Portal" className="mt-8 flex flex-col gap-1">
        {NAV.map(({ label, Icon }, index) => {
          const isActive = index === 0;
          return (
            <button
              key={label}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                setIsMenuOpen(false);
                if (!isActive) comingSoon(label);
              }}
              className={`flex items-center gap-4 border-l-4 px-4 py-3.5 text-left text-[16px] transition-colors ${
                isActive
                  ? "border-[#0a3d91] bg-white font-bold text-[#0a3d91]"
                  : "border-transparent text-[#3f4257] hover:bg-white/70"
              }`}
            >
              <Icon size={22} /> {label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1 pt-10">
        {[
          { label: "Settings", Icon: LuSettings },
          { label: "Support", Icon: LuLifeBuoy },
        ].map(({ label, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => comingSoon(label)}
            className="flex items-center gap-4 px-4 py-3 text-left text-[16px] text-[#3f4257] transition-colors hover:bg-white/70"
          >
            <Icon size={22} /> {label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fd]">
      <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between gap-3 border-b border-[#e3e6f3] bg-white px-4 sm:h-[76px] sm:px-6 lg:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-8">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#14162b] hover:bg-[#f2f3ff] lg:hidden"
          >
            <LuMenu size={24} />
          </button>
          <Link href="/institution" aria-label="Gloxad home" className="shrink-0">
            <img src="/gloxadlogo.png" alt="Gloxad" className="h-[34px] w-auto object-contain sm:h-[44px]" />
          </Link>
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              comingSoon("Search");
            }}
            className="relative hidden max-w-[520px] flex-1 md:block"
          >
            <input
              type="search"
              aria-label="Search"
              placeholder="What do you want to learn?"
              className="w-full rounded-full border border-[#dde0f0] bg-white py-3 pl-6 pr-14 text-[15px] text-[#1b1d33] placeholder:text-[#9a9db3] outline-none focus:border-[#0a55c8] focus:ring-2 focus:ring-[#0a55c8]/15"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#0a55c8] text-white hover:bg-[#0846a8]"
            >
              <LuSearch size={18} />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button type="button" aria-label="Notifications" onClick={() => comingSoon("Notifications")} className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#14162b] hover:bg-[#f2f3ff]">
            <LuBell size={22} />
            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#e5322d]" />
          </button>
          <button type="button" aria-label="Help" onClick={() => comingSoon("Help")} className="hidden h-10 w-10 items-center justify-center rounded-full text-[#14162b] hover:bg-[#f2f3ff] sm:flex">
            <LuHelpCircle size={22} />
          </button>
          <button type="button" aria-label="Apps" onClick={() => comingSoon("Apps")} className="hidden h-10 w-10 items-center justify-center rounded-full text-[#14162b] hover:bg-[#f2f3ff] sm:flex">
            <LuLayoutGrid size={22} />
          </button>
          <span aria-hidden className="mx-1 hidden h-10 w-px bg-[#e3e6f3] sm:block" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[15px] font-medium leading-tight text-[#0a3d91]">Admin User</p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#4a4d66]">System Controller</p>
            </div>
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[10px] bg-[#0a3d91] text-[14px] font-bold text-white sm:h-12 sm:w-12">
              AU
              <span className="absolute inset-0">
                <CategoryImage src={institutionImages.adminAvatar} className="h-full w-full object-cover" fallback={null} />
              </span>
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-[76px] hidden h-[calc(100vh-76px)] w-[280px] shrink-0 overflow-y-auto bg-[#f0f3fb] lg:block xl:w-[300px]">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-[#0b0a2a]/50"
            />
            <div className="relative h-full w-[290px] max-w-[85vw] overflow-y-auto bg-[#f0f3fb] shadow-xl">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setIsMenuOpen(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[#14162b] hover:bg-white"
              >
                <LuX size={20} />
              </button>
              {sidebar}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 pb-16 pt-8 sm:px-8 lg:px-10 xl:px-12 xl:pt-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end lg:flex-col lg:items-stretch xl:flex-row xl:items-end">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0a3d91]">Institutional Overview</p>
              <h1 className="mt-2 text-[30px] font-bold leading-tight text-[#14162b] sm:text-[38px] xl:text-[44px]">
                Welcome back, Administrator
              </h1>
              <p className="mt-2 flex items-center gap-2 text-[15px] text-[#3f4257]">
                <LuCalendar size={16} /> {today || " "}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => comingSoon("Report download")}
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#c9d9fb] px-5 py-3 text-[15px] font-medium text-[#0a3d91] transition-colors hover:bg-[#b9cdf7]"
              >
                <LuDownload size={18} /> Download Report
              </button>
              <button
                type="button"
                onClick={() => comingSoon("New session")}
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#0a55c8] px-5 py-3 text-[15px] font-medium text-white shadow-[0_8px_18px_-8px_rgba(10,85,200,0.6)] transition-colors hover:bg-[#0846a8]"
              >
                <LuPlus size={18} /> New Session
              </button>
            </div>
          </div>

          <section aria-label="Key figures" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map(({ label, value, trend, Icon, tone, positive, featured }) => (
              <article
                key={label}
                className={`rounded-[12px] bg-white p-5 shadow-[0_4px_20px_-12px_rgba(30,40,120,0.2)] ${featured ? "border-l-4 border-[#0a3d91]" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${tone}`}>
                    <Icon size={22} />
                  </span>
                  <span className={`flex items-center gap-1 text-[13px] font-bold ${positive ? "text-[#1e8e4b]" : "text-[#4a4d66]"}`}>
                    {trend} {positive && <LuArrowUpRight size={14} />}
                  </span>
                </div>
                <p className="mt-5 text-[15px] text-[#3f4257]">{label}</p>
                <p className="font-display mt-1 text-[34px] font-bold leading-none text-[#14162b] sm:text-[38px]">{value}</p>
              </article>
            ))}
          </section>

          <div className="mt-10 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="flex min-w-0 flex-col gap-8">
              <section aria-labelledby="programs-title">
                <div className="flex items-center justify-between gap-4">
                  <h2 id="programs-title" className="text-[24px] font-bold text-[#14162b]">
                    Active Programs
                  </h2>
                  <button type="button" onClick={() => comingSoon("Programs")} className="text-[15px] font-medium text-[#0a55c8] hover:underline">
                    View All Programs
                  </button>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {PROGRAMS.map((program) => (
                    <article key={program.title} className="rounded-[12px] bg-white p-6 shadow-[0_4px_20px_-12px_rgba(30,40,120,0.2)]">
                      <div className="flex flex-wrap gap-2">
                        {program.tags.map(([tag, tone]) => (
                          <span key={tag} className={`rounded-[4px] px-3 py-1 text-[11px] font-bold tracking-wide ${tone}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="mt-4 text-[22px] font-bold text-[#14162b]">{program.title}</h3>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex -space-x-2.5">
                          {program.avatars.map((src) => (
                            <span key={src} className="h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-[#dbe1f4]">
                              <CategoryImage src={src} className="h-full w-full object-cover" fallback={null} />
                            </span>
                          ))}
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#e6e8f0] text-[10px] font-bold text-[#4a4d66]">
                            {program.extra}
                          </span>
                        </div>
                        <span className="text-[14px] text-[#3f4257]">{program.enrolled} Students enrolled</span>
                      </div>
                      <div className="mt-6 flex items-center justify-between text-[14px] font-bold text-[#14162b]">
                        <span>Curriculum Progress</span>
                        <span className="text-[#0a3d91]">{program.progress}%</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`${program.title} curriculum progress`}
                        aria-valuenow={program.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="mt-2 h-2 overflow-hidden rounded-full bg-[#e6e8f0]"
                      >
                        <div className="h-full rounded-full bg-[#0a3d91]" style={{ width: `${program.progress}%` }} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="analytics-title" className="rounded-[20px] bg-[#00347f] p-6 text-white sm:p-10">
                <h2 id="analytics-title" className="text-[26px] font-bold sm:text-[32px]">
                  Institutional Analytics
                </h2>
                <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-[#b9c9e8]">
                  Real-time performance metrics across all faculties for the Q4 academic period.
                </p>
                <div className="mt-8 flex h-[200px] items-end gap-2 sm:h-[240px] sm:gap-4" role="img" aria-label="Weekly activity, highest on Saturday">
                  {CHART.map(({ day, height, color }) => (
                    <div key={day} className="flex h-full flex-1 flex-col justify-end gap-3">
                      <span className="w-full rounded-[4px]" style={{ height: `${height}%`, backgroundColor: color }} />
                    </div>
                  ))}
                </div>
                <div aria-hidden className="mt-3 flex gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9fb4da] sm:gap-4 sm:text-[12px]">
                  {CHART.map(({ day }) => (
                    <span key={day} className="flex-1 text-center">
                      {day}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="flex min-w-0 flex-col gap-8">
              <section aria-labelledby="quick-title" className="rounded-[20px] bg-[#eef0fb] p-5 sm:p-6">
                <h2 id="quick-title" className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#3f4257]">
                  Quick Actions
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {[
                    { title: "Add New Student", sub: "Registration workflow", Icon: LuUserPlus, tone: "bg-[#dbe7fb] text-[#0a3d91]", href: "/institution/onboarding/students" },
                    { title: "Create Course", sub: "Curriculum architect", Icon: LuFileText, tone: "bg-[#e1e8fb] text-[#0a3d91]" },
                    { title: "Generate Report", sub: "Automated analytics", Icon: LuFileText, tone: "bg-[#fde7dc] text-[#b4501e]" },
                  ].map(({ title, sub, Icon, tone, href }) => {
                    const content = (
                      <>
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] ${tone}`}>
                          <Icon size={22} />
                        </span>
                        <span>
                          <span className="block text-[16px] font-bold text-[#14162b]">{title}</span>
                          <span className="block text-[13px] text-[#4a4d66]">{sub}</span>
                        </span>
                      </>
                    );
                    const className =
                      "flex w-full items-center gap-4 rounded-[10px] bg-white p-4 text-left transition-shadow hover:shadow-md";
                    return href ? (
                      <Link key={title} href={href} className={className}>
                        {content}
                      </Link>
                    ) : (
                      <button key={title} type="button" onClick={() => comingSoon(title)} className={className}>
                        {content}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section aria-labelledby="activity-title">
                <div className="flex items-center justify-between">
                  <h2 id="activity-title" className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#14162b]">
                    Recent Activity
                  </h2>
                  <span aria-hidden className="text-[#4a4d66]">•••</span>
                </div>
                <ol className="relative mt-6 flex flex-col gap-7">
                  <span aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-[#dde0f0]" />
                  {ACTIVITY.map(({ text, meta, Icon, tone }) => (
                    <li key={text} className="relative flex items-start gap-4">
                      <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}>
                        <Icon size={16} />
                      </span>
                      <div>
                        <p className="text-[15px] font-medium leading-snug text-[#14162b]">{text}</p>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#6a6d83]">{meta}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={() => comingSoon("The activity log")}
                  className="mt-8 w-full rounded-[10px] border border-[#d5d9ec] bg-white px-4 py-3.5 text-[15px] font-bold text-[#0a3d91] transition-colors hover:bg-[#f2f3ff]"
                >
                  View Full Activity Log
                </button>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
