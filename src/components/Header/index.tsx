"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ImageComponent from "@components/ImageComponent/ImageComponent";
import { FaTimes, FaSearch, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Button from "@components/Button";
import { PiUserCircleLight } from "react-icons/pi";
import useAuth from "@hooks/useAuth";
import { coursesHref } from "@utils/coursesHref";
import { FaBars, FaChevronDown } from "react-icons/fa6";

const LANDING_SOCIALS = [
  { label: "LinkedIn", Icon: FaLinkedin, color: "#0A66C2" },
  { label: "Twitter", Icon: FaTwitter, color: "#1DA1F2" },
  { label: "Instagram", Icon: FaInstagram, color: "#262626" },
  { label: "Facebook", Icon: FaFacebook, color: "#1877F2" },
];

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
            <nav className="flex items-center gap-3 text-[16px] font-medium text-[#4e515c] xl:gap-6">
              <Link
                href="/"
                className={`rounded-[16px] px-4 py-1 transition-colors ${
                  isStudentActive
                    ? "bg-[#0a1b56] text-white"
                    : "hover:text-[#0a1b56]"
                }`}
              >
                Students
              </Link>
              <Link
                href="/teach"
                className={`hidden sm:block rounded-[16px] px-4 py-1 transition-colors ${
                  isTutorActive
                    ? "bg-[#0a1b56] text-white"
                    : "hover:text-[#0a1b56]"
                }`}
              >
                Tutors
              </Link>
              <Link
                href="/institution"
                className={`hidden sm:block rounded-[16px] px-4 py-1 transition-colors ${
                  isInstitutionActive
                    ? "bg-[#0a1b56] text-white"
                    : "hover:text-[#0a1b56]"
                }`}
              >
                Institution
              </Link>
              <Link
                href={coursesHref(isAuthenticated)}
                className={`hidden md:block rounded-[16px] px-4 py-1 transition-colors ${
                  isNexusActive
                    ? "bg-[#0a1b56] text-white"
                    : "hover:text-[#0a1b56]"
                }`}
              >
                Gloxad Nexus
              </Link>
            </nav>
            <div className="flex flex-1 items-center justify-end gap-4 text-[#202127]">
              {/* Same social links, sizes and brand colours as the institution page's top bar */}
              <div className="flex items-center gap-4">
                {LANDING_SOCIALS.map(({ label, Icon, color }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="transition-transform hover:scale-110"
                    style={{ color }}
                  >
                    <Icon size={28} />
                  </a>
                ))}
              </div>
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
                  <Link href={coursesHref(isAuthenticated)} className="hover:text-[#1e4ed8] transition-colors">Our Courses</Link>
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
                    className="hidden h-[42px] items-center gap-2 rounded-full border border-[#0a1b56] px-5 text-[14px] font-bold text-[#0a1b56] md:flex hover:bg-gray-50 transition-colors"
                  >
                    Explore
                    <FaChevronDown className="text-[12px] text-[#0a1b56]" />
                  </button>

                  <form className="hidden h-[46px] w-full min-w-0 max-w-[500px] items-center rounded-full border border-[#dedee7] pl-5 pr-1.5 lg:flex hover:border-gray-300 transition-colors">
                    <input
                      aria-label="Search courses"
                      placeholder="What do you want to learn?"
                      className="w-full border-0 bg-transparent p-0 text-[15px] placeholder:text-[#a4a5ad] focus:ring-0"
                    />
                    <button
                      type="submit"
                      aria-label="Submit search"
                      className="btn-interactive flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#1e4ed8] text-white hover:bg-blue-800 transition-colors"
                    >
                      <FaSearch className="text-[14px]" />
                    </button>
                  </form>
                </>
              )}
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-3 xl:ml-6 xl:gap-4">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2 xl:gap-3">
                  <Link href="/auth/signup">
                    <button className="h-[38px] rounded-full bg-[#4aa3df] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#3e92cc]">
                      Sign Up
                    </button>
                  </Link>
                  <Link href="/auth/signin">
                    <button className="h-[38px] rounded-full border border-[#202127] px-5 text-[14px] font-bold text-[#202127] transition-colors hover:bg-gray-50">
                      Login
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link href={authenticatedUser?.role === "admin" ? "/admin" : "/dashboard"}>
                    <button className="h-[38px] rounded-full bg-[#0a1b56] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#07006f]">
                      Dashboard
                    </button>
                  </Link>
                  <Button
                    key="button-link-landing"
                    ghost
                    renderContent={() => (
                      <button aria-label="Profile" className="hover:text-[#1e4ed8] transition-colors flex items-center">
                        {authenticatedUser?.avatar ? (
                          <img src={authenticatedUser.avatar} alt="User" className="w-[32px] h-[32px] rounded-full object-cover border border-gray-200" />
                        ) : (
                          <PiUserCircleLight className="text-[32px]" />
                        )}
                      </button>
                    )}
                    renderDropdown={() => (
                      <div className="flex flex-col p-5 gap-4 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
                        <div className="border-b pb-2 mb-2">
                          <p className="font-bold text-[14px]">{authenticatedUser?.name || "User"}</p>
                          <p className="text-[12px] text-gray-500">{authenticatedUser?.email}</p>
                        </div>
                        <Button
                          text={isLoggingOut ? "Logging out..." : "Logout"}
                          onClick={() => handleLogout()}
                          disabled={isLoggingOut}
                          outline
                          className="w-full text-center"
                        />
                      </div>
                    )}
                  />
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
              <Link href={coursesHref(isAuthenticated)} className="hover:text-white transition-colors">Our Courses</Link>
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
                className="hidden h-[42px] items-center gap-2 rounded-full border border-[#1e4ed8] px-5 text-[14px] font-medium text-[#202127] md:flex hover:bg-gray-50 transition-colors"
              >
                <span className="text-[#1e4ed8] font-bold">Explore</span>
                <FaChevronDown className="text-[12px] text-[#1e4ed8]" />
              </button>

              <form className="hidden h-[46px] w-full min-w-0 max-w-[500px] items-center rounded-full border border-[#dedee7] pl-5 pr-1.5 lg:flex hover:border-gray-300 transition-colors">
                <input
                  aria-label="Search courses"
                  placeholder="What do you want to learn?"
                  className="w-full border-0 bg-transparent p-0 text-[15px] placeholder:text-[#a4a5ad] focus:ring-0"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#1e4ed8] text-white hover:bg-blue-800 transition-colors"
                >
                  <FaSearch className="text-[14px]" />
                </button>
              </form>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-4 text-[24px] text-[#202127] xl:ml-6 xl:gap-6">
              {!isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/auth/signin">
                    <Button text="Login" outline className="!h-[38px] !px-5 !text-[14px]" />
                  </Link>
                  <Link href="/auth/signup">
                    <Button text="Sign Up" className="!h-[38px] !px-5 !text-[14px]" />
                  </Link>
                </div>
              ) : (
                <>
                  <Button
                    key="button-link"
                    ghost
                    renderContent={() => (
                      <button aria-label="Profile" className="hover:text-[#1e4ed8] transition-colors flex items-center">
                        {authenticatedUser?.avatar ? (
                          <img src={authenticatedUser.avatar} alt="User" className="w-[32px] h-[32px] rounded-full object-cover border border-gray-200" />
                        ) : (
                          <PiUserCircleLight className="text-[32px]" />
                        )}
                      </button>
                    )}
                    renderDropdown={() => (
                      <div className="flex flex-col p-5 gap-4 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
                        <div className="border-b pb-2 mb-2">
                          <p className="font-bold text-[14px]">{authenticatedUser?.name || "User"}</p>
                          <p className="text-[12px] text-gray-500">{authenticatedUser?.email}</p>
                        </div>
                        <Button
                          text={isLoggingOut ? "Logging out..." : "Logout"}
                          onClick={() => handleLogout()}
                          disabled={isLoggingOut}
                          outline
                          className="w-full text-center"
                        />
                      </div>
                    )}
                  />
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
                <Link href="/dashboard/explore" className={`h-full flex items-center border-b-2 transition-colors hover:text-[#030069] ${pathname.includes('/dashboard/explore') ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Our Courses</Link>
                <Link href="/dashboard?tab=trimester" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">Trimester Courses</Link>
                <Link href="/dashboard?tab=free" className={`h-full flex items-center border-b-2 transition-colors hover:text-[#030069] ${pathname === '/dashboard' && search.includes('tab=free') ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Free Courses</Link>
                <Link href="/scholarships" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">Scholarships</Link>
                <Link href="/#faqs" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">FAQs</Link>
                <Link href="/messages" className="h-full flex items-center border-b-2 border-transparent hover:text-[#030069] transition-colors">Messages</Link>
              </nav>
            ) : (
              <nav className="flex h-full items-center gap-5 overflow-x-auto whitespace-nowrap text-[14px] font-bold text-[#4e515c] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:gap-8">
                <Link href="/" className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/' ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Home</Link>
                <Link href={coursesHref(isAuthenticated)} className={`h-full flex items-center border-b-2 hover:text-[#030069] transition-colors ${pathname === '/courses' ? 'border-[#030069] text-[#030069]' : 'border-transparent'}`}>Our Courses</Link>
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
        <div
          className={
            "h-[64px] px-[20px] py-[10px] items-center justify-center flex border-b border-neutral-4 bg-white relative z-50"
          }
        >
          <Link href="/" onClick={() => setIsOpen(false)}>
            <ImageComponent
              width="108px"
              height="auto"
              src="/gloxadlogo.png"
              alt="Logo"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 lg:hidden">
      {/* MOBILE bar: logo on the left, menu button on the right */}
      <div className="relative z-50 flex h-[56px] items-center justify-between border-b border-[#efeff5] bg-white px-4 sm:h-[60px] sm:px-6">
        <Link href="/" onClick={() => setIsOpen(false)} className="shrink-0" aria-label="Gloxad Academy home">
          {isLanding ? (
            // Home and Tutors pages: same 40px logo as the institution page on phones
            <img src="/gloxadlogo.png" alt="Logo" className="h-[40px] w-auto object-contain" />
          ) : (
            <ImageComponent width="80px" height="auto" src="/gloxadlogo.png" alt="Logo" />
          )}
        </Link>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-[#202127] transition-colors hover:bg-[#f2f3f8]"
        >
          {isOpen ? <FaTimes className="text-[18px]" /> : <FaBars className="text-[18px]" />}
        </button>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] h-[100dvh] w-[86vw] max-w-[320px] bg-white shadow-xl transition-transform duration-300 transform flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Close Button */}
        <div className="flex justify-end px-6 pt-6 pb-4">
          <button onClick={() => setIsOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#202127] text-[#202127] hover:bg-gray-50">
            <FaTimes className="text-[14px]" />
          </button>
        </div>

        <div className="flex flex-col pb-10 min-h-full">
          <nav className="flex flex-col text-[16px] font-medium text-[#202127]">
            {isAuthenticated ? (
              <>
                <Link href={authenticatedUser?.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setIsOpen(false)} className={`px-6 py-3 transition-colors ${isStudentActive ? 'bg-[#0a1b56] text-white' : 'hover:text-[#0a1b56]'}`}>{authenticatedUser?.role === "admin" ? "Admin Dashboard" : authenticatedUser?.role === "instructor" ? "Tutor Dashboard" : "Students (Home)"}</Link>
                <Link href="/teach" onClick={() => setIsOpen(false)} className={`px-6 py-3 transition-colors ${isTutorActive ? 'bg-[#0a1b56] text-white' : 'hover:text-[#0a1b56]'}`}>Tutors</Link>
                <Link href="/institution" onClick={() => setIsOpen(false)} className={`px-6 py-3 transition-colors ${isInstitutionActive ? 'bg-[#0a1b56] text-white' : 'hover:text-[#0a1b56]'}`}>Institution</Link>
                <Link href="/dashboard?tab=my-courses" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">My Courses</Link>
                <Link href="/dashboard/explore" onClick={() => setIsOpen(false)} className={`px-6 py-3 transition-colors ${isNexusActive ? 'bg-[#0a1b56] text-white' : 'hover:text-[#0a1b56]'}`}>Our Courses</Link>
                <Link href="/dashboard?tab=trimester" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">Trimester Courses</Link>
                <Link href="/dashboard?tab=free" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">Free Courses</Link>
                <Link href="/scholarships" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">Scholarships</Link>
                <Link href="/#faqs" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">FAQs</Link>
                <Link href="/messages" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">Messages</Link>
              </>
            ) : (
              <>
                <Link href="/" onClick={() => setIsOpen(false)} className={`px-6 py-3 transition-colors ${isStudentActive ? 'bg-[#0a1b56] text-white' : 'hover:text-[#0a1b56]'}`}>Students (Home)</Link>
                <Link href="/teach" onClick={() => setIsOpen(false)} className={`px-6 py-3 transition-colors ${isTutorActive ? 'bg-[#0a1b56] text-white' : 'hover:text-[#0a1b56]'}`}>Tutors</Link>
                <Link href="/institution" onClick={() => setIsOpen(false)} className={`px-6 py-3 transition-colors ${isInstitutionActive ? 'bg-[#0a1b56] text-white' : 'hover:text-[#0a1b56]'}`}>Institution</Link>
                <Link href={coursesHref(isAuthenticated)} onClick={() => setIsOpen(false)} className={`px-6 py-3 transition-colors ${isNexusActive ? 'bg-[#0a1b56] text-white' : 'hover:text-[#0a1b56]'}`}>Our Courses</Link>
                <Link href="/free" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">Free Courses</Link>
                <Link href="/trimester" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">Trimester Courses</Link>
                <Link href="/scholarships" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">Scholarships</Link>
                <Link href="/#faqs" onClick={() => setIsOpen(false)} className="px-6 py-3 hover:text-[#0a1b56] transition-colors">FAQs</Link>
              </>
            )}
          </nav>

          <div className="mt-6 flex flex-col text-[16px] font-medium text-[#202127]">
            {!isAuthenticated ? (
              <div className="flex gap-3 px-6 pt-2">
                <Link href="/auth/signin" onClick={() => setIsOpen(false)} className="flex h-[42px] flex-1 items-center justify-center rounded-full border border-[#202127] text-[14px] font-bold transition-colors hover:bg-gray-50">Login</Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="flex h-[42px] flex-1 items-center justify-center rounded-full bg-[#0a1b56] text-[14px] font-bold text-white transition-colors hover:bg-[#07006f]">Sign Up</Link>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
