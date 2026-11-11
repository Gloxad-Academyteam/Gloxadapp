"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TutorCoursesOnly from "@components/TutorCoursesOnly";
import { usePathname, useSearchParams } from "next/navigation";
import ImageComponent from "@components/ImageComponent/ImageComponent";
import { FaTimes, FaSearch } from "react-icons/fa";
import Button from "@components/Button";
import { FiChevronRight, FiMenu, FiX } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import useAuth from "@hooks/useAuth";
import { coursesHref } from "@utils/coursesHref";
import { FaBars, FaChevronDown } from "react-icons/fa6";
import HeaderSearch from "./HeaderSearch";
import SocialIcons from "./SocialIcons";
import ProfileMenu from "./ProfileMenu";

// One pair of sign in and sign up buttons for every header: a quiet outlined "Log in" and a solid "Sign up"
const AUTH_LOGIN_CLASS =
  "inline-flex h-[40px] items-center justify-center rounded-full border border-[#cfd6ea] bg-white px-5 text-[14px] font-semibold text-[#0B1F4D] transition-colors hover:border-[#0B1F4D] hover:bg-[#f4f6fb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4D]/30";
const AUTH_SIGNUP_CLASS =
  "inline-flex h-[40px] items-center justify-center rounded-full bg-[#0B1F4D] px-5 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(11,31,77,0.25)] transition-colors hover:bg-[#13306f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4D]/40 focus-visible:ring-offset-2";

const exploreColumns = [
  {
    title: "Explore Categories",
    links: ["Development & Engineering", "Data & AI", "Design & User Experience", "Product & Business", "Security & Infrastructure", "Digital Marketing"],
  },
  {
    title: "Explore roles",
    links: ["Frontend Developer", "Data Analyst", "UI/UX Designer", "Backend Developer", "Cyber Security Specialist", "Product Designer"],
  },
  {
    title: "Trending Courses",
    links: ["Python", "JavaScript", "HTML", "Dart (with Flutter)", "PHP", "UI/UX Design"],
  },
  {
    title: "Courses",
    links: ["Trimester Courses", "Free Courses", "Scholarships"],
  },
];

/* ================================================================
   DESKTOP — landing header (used on "/" and "/teach")
   ================================================================ */
const LandingHeader = () => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const { isAuthenticated, authenticatedUser, handleLogout, isLoggingOut } = useAuth();
  const pathname = usePathname() ?? "";
  const isAuthPage = pathname.startsWith("/auth");

  const isTutorActive = pathname.startsWith("/teach");
  const isInstitutionActive = pathname.startsWith("/auth") || pathname.startsWith("/institution");
  const isNexusActive = pathname.startsWith("/courses");
  const isStudentActive = !isTutorActive && !isInstitutionActive && !isNexusActive;

  if (isAuthPage) {
    return (
      <header className="relative z-50 bg-white font-sans hidden lg:block">
        <div className="h-[80px] border-b border-[#efeff5] bg-white">
          <div className="mx-auto flex h-full w-full max-w-[1512px] items-center px-5 md:px-10 lg:px-8 xl:px-[120px]">
            <Link href="/" className="flex items-center">
              <img
                src="/gloxadlogo.png"
                alt="GLOXAD Logo"
                className="h-[40px] w-[124px] object-contain"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // The <header> is just a spacer that keeps page content below the fixed bar;
  // Row 3 (hero nav) is not fixed, so it scrolls away with the page.
  return (
    <header className="relative z-50 hidden h-[128px] font-sans lg:block">
      {/* FIXED bar: rows 1 + 2 stay on screen while the page scrolls underneath */}
      <div className="fixed inset-x-0 top-0 z-50 bg-white">
        {/* Row 1 */}
        <div className="relative z-20 h-[48px] border-b border-[#efeff5] bg-white">
          <div className="mx-auto flex h-full w-full max-w-[1512px] items-center px-5 md:px-10 lg:px-8 xl:px-[120px]">
            <nav className="flex items-center gap-1 text-[14px] font-semibold text-[#52607A]">
              <Link
                href="/"
                className={`rounded-full px-4 py-1.5 transition-colors ${
                  isStudentActive
                    ? "bg-[#0B1F4D] text-white"
                    : "hover:bg-[#f1f3f9] hover:text-[#0B1F4D]"
                }`}
              >
                Students
              </Link>
              <Link
                href="/teach"
                className={`hidden sm:block rounded-full px-4 py-1.5 transition-colors ${
                  isTutorActive
                    ? "bg-[#0B1F4D] text-white"
                    : "hover:bg-[#f1f3f9] hover:text-[#0B1F4D]"
                }`}
              >
                Tutors
              </Link>
              <Link
                href="/institution"
                className={`hidden sm:block rounded-full px-4 py-1.5 transition-colors ${
                  isInstitutionActive
                    ? "bg-[#0B1F4D] text-white"
                    : "hover:bg-[#f1f3f9] hover:text-[#0B1F4D]"
                }`}
              >
                Institution
              </Link>
              <Link
                href={coursesHref(isAuthenticated)}
                className={`hidden md:block rounded-full px-4 py-1.5 transition-colors ${
                  isNexusActive
                    ? "bg-[#0B1F4D] text-white"
                    : "hover:bg-[#f1f3f9] hover:text-[#0B1F4D]"
                }`}
              >
                Gloxad Nexus
              </Link>
            </nav>
            <div className="flex flex-1 items-center justify-end gap-4 text-[#202127]">
              <SocialIcons />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="h-[80px] border-b border-[#efeff5] bg-white relative z-20">
          <div className="mx-auto flex h-full w-full max-w-[1512px] items-center justify-between px-5 md:px-10 lg:px-8 xl:px-[120px]">
            <div className="flex min-w-0 flex-1 items-center gap-4 xl:gap-6">
              <Link href="/" className="flex items-center mr-2">
                <img
                  src="/gloxadlogo.png"
                  alt="GLOXAD Logo"
                  className="h-[56px] w-auto object-contain"
                />
              </Link>

              {isTutorActive ? (
                <nav className="hidden lg:flex items-center gap-6 text-[14px] font-bold text-[#4e515c] ml-4">
                  <Link href="/" className="hover:text-[#1e4ed8] transition-colors">Home</Link>
                  <TutorCoursesOnly><Link href={coursesHref(isAuthenticated)} className="hover:text-[#1e4ed8] transition-colors">Our Courses</Link></TutorCoursesOnly>
                  <Link href="/trimester" className="hover:text-[#1e4ed8] transition-colors">Trimester Courses</Link>
                  <Link href="/free" className="hover:text-[#1e4ed8] transition-colors">Free Courses</Link>
                  <Link href="/scholarships" className="hover:text-[#1e4ed8] transition-colors">Scholarships</Link>
                  <Link href="/#faqs" className="hover:text-[#1e4ed8] transition-colors">FAQs</Link>
                </nav>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsExploreOpen((value) => !value)}
                    className="hidden h-[44px] items-center gap-2 rounded-full bg-[#f1f3f9] px-5 text-[14px] font-semibold text-[#0B1F4D] transition-colors hover:bg-[#e6eaf5] md:flex"
                  >
                    Explore
                    <FaChevronDown className="text-[11px] text-[#6b7389]" />
                  </button>

                  <HeaderSearch />
                </>
              )}
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-3 xl:ml-6 xl:gap-4">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2 xl:gap-3">
                  <Link href="/auth/signin" className={AUTH_LOGIN_CLASS}>Log in</Link>
                  <Link href="/auth/signup" className={AUTH_SIGNUP_CLASS}>Sign up</Link>
                </div>
              ) : (
                <>
                  <Link href={authenticatedUser?.role === "admin" ? "/admin" : "/dashboard"} className={AUTH_SIGNUP_CLASS}>
                    Dashboard
                  </Link>
                  <ProfileMenu authenticatedUser={authenticatedUser} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
                </>
              )}
            </div>
          </div>
        </div>

        {isExploreOpen && (
          <>
            {/* Dark Overlay */}
            <div
              className="fixed inset-0 top-[128px] -z-10 bg-[#0a1b56]/60 transition-opacity"
              onClick={() => setIsExploreOpen(false)}
            />

            {/* Mega Menu Dropdown */}
            <div className="absolute left-0 top-full z-50 w-full border-b border-[#efeff5] bg-white shadow-xl">
              <div className="mx-auto flex max-w-[1512px] flex-col justify-center px-5 py-10 md:flex-row md:gap-[80px] lg:px-8 xl:px-[120px]">
                {exploreColumns.map((column) => (
                  <div key={column.title} className="flex-1">
                    <h3 className="text-[16px] font-bold text-[#202127]">
                      {column.title}
                    </h3>
                    <div className="mt-5 flex flex-col gap-4">
                      {column.links.map((link) => (
                        <Link
                          key={link}
                          href={`/courses?search=${encodeURIComponent(link.toLowerCase())}`}
                          className="text-[14px] font-medium text-[#4e515c] transition-colors hover:text-[#07006f]"
                          onClick={() => setIsExploreOpen(false)}
                        >
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Row 3 - Transparent to blend with Hero (Only on Student Landing Page) */}
      {!isTutorActive && (
        <div className="absolute top-[120px] left-0 right-0 h-[64px] bg-transparent z-10 pointer-events-none">
          <div className="mx-auto flex h-full w-full max-w-[1512px] items-center px-5 md:px-10 lg:px-8 xl:px-[120px] pointer-events-auto">
            <nav className="flex h-full items-center gap-5 text-[14px] font-medium text-white/80 xl:gap-8">
              <Link href="/" className="font-bold text-white transition-colors">Home</Link>
              <TutorCoursesOnly><Link href={coursesHref(isAuthenticated)} className="hover:text-white transition-colors">Our Courses</Link></TutorCoursesOnly>
              <Link href="/trimester" className="hover:text-white transition-colors">Trimester Courses</Link>
              <Link href="/free" className="hover:text-white transition-colors">Free Courses</Link>
              <Link href="/scholarships" className="hover:text-white transition-colors">Scholarships</Link>
              <Link href="/#faqs" className="hover:text-white transition-colors">FAQs</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

const Header = () => {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const authProps = useAuth();
  const {
    isAuthenticated,
    authenticatedUser,
    handleLogout,
    isLoggingOut,
  } = authProps;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  if (pathname === "/" || pathname === "/teach") {
    return (
      <>
        <LandingHeader />
        <HeaderMobile
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          authProps={authProps}
        />
      </>
    );
  }

  return (
    <>
      {/* ================================================================
          DESKTOP — app header (dashboard / other in-app pages)
          ================================================================ */}
      <header className="sticky top-0 z-50 hidden border-b border-[#efeff5] bg-white font-sans lg:block">
        {/* Top Tier */}
        <div className="h-[80px] border-b border-[#efeff5] bg-white">
          <div className="mx-auto flex h-full w-full max-w-[1512px] items-center justify-between px-5 md:px-10 lg:px-8 xl:px-[120px]">
            <div className="flex min-w-0 flex-1 items-center gap-4 xl:gap-6">
              <Link href="/" className="flex items-center mr-2">
                <img
                  src="/gloxadlogo.png"
                  alt="GLOXAD Logo"
                  className="h-[40px] w-[124px] object-contain"
                />
              </Link>

              <button
                type="button"
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className="hidden h-[44px] items-center gap-2 rounded-full bg-[#f1f3f9] px-5 text-[14px] font-semibold text-[#0B1F4D] transition-colors hover:bg-[#e6eaf5] md:flex"
              >
                <span>Explore</span>
                <FaChevronDown className="text-[11px] text-[#6b7389]" />
              </button>

              <HeaderSearch />
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-4 text-[24px] text-[#202127] xl:ml-6 xl:gap-6">
              {!isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/auth/signin" className={AUTH_LOGIN_CLASS}>Log in</Link>
                  <Link href="/auth/signup" className={AUTH_SIGNUP_CLASS}>Sign up</Link>
                </div>
              ) : (
                <>
                  <ProfileMenu authenticatedUser={authenticatedUser} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Tier (Sub Navigation) */}
        <div className="h-[56px] bg-white">
          <div className="mx-auto flex h-full w-full max-w-[1512px] items-center px-5 md:px-10 lg:px-8 xl:px-[120px]">
            {pathname.startsWith('/dashboard') || pathname === '/messages' || pathname === '/scholarships' && isAuthenticated ? (
              <nav className="flex h-full items-center gap-5 overflow-x-auto whitespace-nowrap text-[14px] font-bold text-[#4e515c] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:gap-8">
                <Link href="/dashboard" className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/dashboard' && (!search.includes('tab') || search.includes('tab=home')) ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Home</Link>
                <Link href="/dashboard?tab=my-courses" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">My Courses</Link>
                <TutorCoursesOnly><Link href="/dashboard/explore" className={`h-full flex items-center border-b-2 transition-colors hover:text-[#030069] ${pathname.includes('/dashboard/explore') ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Our Courses</Link></TutorCoursesOnly>
                <Link href="/dashboard?tab=trimester" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">Trimester Courses</Link>
                <Link href="/dashboard?tab=free" className={`h-full flex items-center border-b-2 transition-colors hover:text-[#030069] ${pathname === '/dashboard' && search.includes('tab=free') ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Free Courses</Link>
                <Link href="/dashboard/practice" className={`h-full flex items-center border-b-2 transition-colors hover:text-[#030069] ${pathname.startsWith('/dashboard/practice') ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Practice</Link>
                <Link href="/scholarships" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">Scholarships</Link>
                <Link href="/#faqs" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">FAQs</Link>
                <Link href="/messages" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">Messages</Link>
              </nav>
            ) : (
              <nav className="flex h-full items-center gap-5 overflow-x-auto whitespace-nowrap text-[14px] font-bold text-[#4e515c] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:gap-8">
                <Link href="/" className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/' ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Home</Link>
                <TutorCoursesOnly><Link href={coursesHref(isAuthenticated)} className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/courses' ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Our Courses</Link></TutorCoursesOnly>
                <Link href="/trimester" className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/trimester' ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Trimester Courses</Link>
                <Link href="/free" className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/free' ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Free Courses</Link>
                <Link href="/scholarships" className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/scholarships' ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Scholarships</Link>
                <Link href="/#faqs" className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/faqs' ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>FAQs</Link>
              </nav>
            )}
          </div>
        </div>

        {/* Explore Dropdown Overlay */}
        {isExploreOpen && (
          <>
            <div
              className="fixed inset-0 top-[136px] z-40 bg-[#0a1b56]/60 transition-opacity"
              onClick={() => setIsExploreOpen(false)}
            />
            <div className="absolute left-0 top-[136px] z-50 w-full border-b border-[#efeff5] bg-white shadow-xl">
              <div className="mx-auto flex max-w-[1512px] flex-col justify-center px-5 py-10 md:flex-row md:gap-[80px] lg:px-[120px]">
                {exploreColumns.map((column) => (
                  <div key={column.title} className="flex-1">
                    <h3 className="text-[16px] font-bold text-[#202127]">
                      {column.title}
                    </h3>
                    <div className="mt-5 flex flex-col gap-4">
                      {column.links.map((link) => (
                        <Link
                          key={link}
                          href={`/courses?search=${encodeURIComponent(link.toLowerCase())}`}
                          className="text-[14px] font-medium text-[#4e515c] transition-colors hover:text-[#07006f]"
                          onClick={() => setIsExploreOpen(false)}
                        >
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </header>

      <HeaderMobile
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        authProps={authProps}
      />
    </>
  );
};

/* ================================================================
   MOBILE — shared drawer header (below lg, all pages)
   ================================================================ */
const HeaderMobile = ({ isOpen, setIsOpen, authProps }: any) => {
  const { isAuthenticated, authenticatedUser, handleLogout, isLoggingOut } = authProps;
  const pathname = usePathname() ?? "";
  const isAuthPage = pathname.startsWith("/auth");
  const isTutorActive = pathname.startsWith("/teach");
  const isInstitutionActive = pathname.startsWith("/auth") || pathname.startsWith("/institution");
  const isNexusActive = pathname.startsWith("/courses");
  const isStudentActive = !isTutorActive && !isInstitutionActive && !isNexusActive;
  const isLanding = pathname === "/" || pathname === "/teach";
  const close = () => setIsOpen(false);

  // Close on route change / Escape, and lock page scroll while the drawer is open
  useEffect(() => {
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setIsOpen]);

  if (isAuthPage) {
    return (
      <div className="sticky top-0 z-50 lg:hidden">
        <div className="relative z-50 flex h-[64px] items-center justify-center border-b border-neutral-4 bg-white px-[20px] py-[10px]">
          <Link href="/" onClick={close}>
            <ImageComponent width="108px" height="auto" src="/gloxadlogo.png" alt="Logo" />
          </Link>
        </div>
      </div>
    );
  }

  const audience = [
    { href: "/", label: "Students", active: isStudentActive },
    { href: "/teach", label: "Tutors", active: isTutorActive },
    { href: "/institution", label: "Institution", active: isInstitutionActive },
  ];

  const learnLinks: { href: string; label: string; active?: boolean; tutorOnly?: boolean }[] = isAuthenticated
    ? [
        { href: authenticatedUser?.role === "admin" ? "/admin" : "/dashboard", label: authenticatedUser?.role === "admin" ? "Admin dashboard" : authenticatedUser?.role === "instructor" ? "Tutor dashboard" : "My dashboard" },
        { href: "/dashboard?tab=my-courses", label: "My courses" },
        { href: "/dashboard/explore", label: "Our courses", active: isNexusActive, tutorOnly: true },
        { href: "/dashboard?tab=trimester", label: "Trimester courses" },
        { href: "/dashboard?tab=free", label: "Free courses" },
        { href: "/dashboard/practice", label: "Practice" },
        { href: "/scholarships", label: "Scholarships" },
        { href: "/messages", label: "Messages" },
        { href: "/#faqs", label: "FAQs" },
      ]
    : [
        { href: coursesHref(isAuthenticated), label: "Our courses", active: isNexusActive, tutorOnly: true },
        { href: "/free", label: "Free courses" },
        { href: "/trimester", label: "Trimester courses" },
        { href: "/scholarships", label: "Scholarships" },
        { href: "/#faqs", label: "FAQs" },
      ];

  const row = (link: (typeof learnLinks)[number]) => (
    <li key={link.href + link.label}>
      <Link
        href={link.href}
        onClick={close}
        className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-[15px] transition-colors ${
          link.active || pathname === link.href ? "bg-[#eef1f8] font-semibold text-[#0B1F4D]" : "font-medium text-[#2b2f45] hover:bg-[#f4f6fb]"
        }`}
      >
        {link.label}
        <FiChevronRight aria-hidden className="text-[16px] text-[#9aa0b4]" />
      </Link>
    </li>
  );

  return (
    <div className="sticky top-0 z-50 lg:hidden">
      {/* MOBILE bar: logo on the left, menu button on the right */}
      <div className="relative z-50 flex h-[58px] items-center justify-between border-b border-[#efeff5] bg-white/95 px-4 backdrop-blur sm:h-[62px] sm:px-6">
        <Link href="/" onClick={close} className="shrink-0" aria-label="Gloxad Academy home">
          {isLanding ? (
            <img src="/gloxadlogo.png" alt="Logo" className="h-[38px] w-auto object-contain" />
          ) : (
            <ImageComponent width="80px" height="auto" src="/gloxadlogo.png" alt="Logo" />
          )}
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e6f0] bg-white text-[#0B1F4D] transition-colors hover:bg-[#f4f6fb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4D]/30"
        >
          <FiMenu className="text-[19px]" />
        </button>
      </div>

      {/* The backdrop and drawer share one viewport-sized, clipping layer, so a closed drawer parked off screen can never widen the page */}
      <div
        className={`fixed inset-0 z-[60] overflow-hidden ${isOpen ? "visible" : "invisible [transition:visibility_0s_linear_0.3s]"}`}
      >
        <div
          className={`absolute inset-0 bg-[#0B1F4D]/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={close}
          aria-hidden
        />

        <aside
          id="mobile-menu"
          aria-label="Menu"
          aria-hidden={!isOpen}
          className={`absolute inset-y-0 right-0 flex h-[100dvh] w-[88vw] max-w-[340px] flex-col bg-white shadow-[-12px_0_40px_rgba(11,31,77,0.18)] transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
        <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#efeff5] px-5 sm:h-[62px]">
          <img src="/gloxadlogo.png" alt="Gloxad Academy" className="h-[34px] w-auto object-contain" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f3f9] text-[#0B1F4D] transition-colors hover:bg-[#e6eaf5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4D]/30"
          >
            <FiX className="text-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <HeaderSearch variant="mobile" onDone={close} />

          <p className="mb-2 mt-5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a90a6]">Switch to</p>
          <div role="tablist" aria-label="Audience" className="grid grid-cols-3 gap-1 rounded-full border border-[#e3e6f0] bg-[#f4f6fb] p-1">
            {audience.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                role="tab"
                aria-selected={item.active}
                className={`flex h-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
                  item.active ? "bg-[#0B1F4D] text-white shadow-[0_2px_6px_rgba(11,31,77,0.25)]" : "text-[#52607A] hover:text-[#0B1F4D]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a90a6]">Explore</p>
          <ul className="flex flex-col gap-0.5">
            {learnLinks.map((link) => (link.tutorOnly ? <TutorCoursesOnly key={link.label}>{row(link)}</TutorCoursesOnly> : row(link)))}
          </ul>
        </div>

        <div className="shrink-0 border-t border-[#efeff5] bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          {!isAuthenticated ? (
            <div className="flex gap-3">
              <Link href="/auth/signin" onClick={close} className="flex h-[46px] flex-1 items-center justify-center rounded-full border border-[#cfd6ea] bg-white text-[14px] font-semibold text-[#0B1F4D] transition-colors hover:border-[#0B1F4D] hover:bg-[#f4f6fb]">Log in</Link>
              <Link href="/auth/signup" onClick={close} className="flex h-[46px] flex-1 items-center justify-center rounded-full bg-[#0B1F4D] text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(11,31,77,0.25)] transition-colors hover:bg-[#13306f]">Sign up</Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleLogout();
                close();
              }}
              disabled={isLoggingOut}
              className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-full bg-[#fff3f2] text-[14px] font-semibold text-[#b93832] transition hover:bg-[#ffe9e7] disabled:cursor-wait disabled:opacity-60"
            >
              <LuLogOut size={18} aria-hidden />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          )}
          <SocialIcons className="mt-4 justify-center" />
        </div>
      </aside>
      </div>
    </div>
  );
};

export default Header;
