"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PiSquaresFour, 
  PiGraduationCap, 
  PiCloudArrowUp, 
  PiChatCircle, 
  PiStar, 
  PiMoney, 
  PiUser, 
  PiSignOut, 
  PiGlobe, 
  PiBell, 
  PiList, 
  PiMagnifyingGlass,
  PiCompass,
  PiCertificate,
  PiStudent,
  PiGear
} from "react-icons/pi";
import useAuth from "@hooks/useAuth";
import axiosInstance from "@utils/axiosInstance";
import ImageComponent from "@components/ImageComponent/ImageComponent";

const SidebarItem = ({ icon: Icon, label, to, active, isOpen }: any) => (
  <Link href={to}
    className={`flex items-center gap-4 px-6 py-[14px] transition-all duration-300 ${
      active
        ? "bg-[#3e92cc] text-white font-bold"
        : "text-[#4e515c] hover:bg-[#f4f7fb] hover:text-[#202127] font-medium"
    }`}
    title={!isOpen ? label : ""}
  >
    <Icon className="text-[20px] shrink-0" />
    {isOpen && <span className="text-[14px] whitespace-nowrap">{label}</span>}
  </Link>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { authenticatedUser, handleLogout } = useAuth();
  const user: any = authenticatedUser;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  // window isn't available on the server, so the sidebar's initial open/closed
  // state has to be decided after mount rather than in the useState initializer.
  useEffect(() => {
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications");
        const unread = res.data.notifications?.some((n: any) => !n.isRead);
        setHasUnread(unread);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    if (user) {
      checkNotifications();
    }
  }, [user, pathname]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-2 overflow-hidden w-full">
      {/* Top Navbar */}
      <header className="h-[80px] bg-white border-b border-neutral-4 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-20">
        
        {/* Left Side: Hamburger + Logo */}
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-8 hover:bg-neutral-2 hover:text-primary-6 transition-colors"
          >
            <PiList className="text-[24px]" />
          </button>
          
          <Link href="/" className="flex items-center">
            <ImageComponent
              width="110px"
              height="auto"
              src="/gloxadlogo.png"
              alt="Gloxad Logo"
            />
          </Link>
        </div>

        {/* Center: Search Bar (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-[600px] mx-8">
          <form onSubmit={handleSearch} className="relative w-full flex items-center">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to learn?" 
              className="w-full h-[48px] pl-6 pr-14 rounded-full border border-neutral-4 bg-white focus:outline-none focus:border-[#4aa3df] focus:ring-1 focus:ring-[#4aa3df] transition-all text-[14px] shadow-sm"
            />
            <button type="submit" className="absolute right-2 w-10 h-10 rounded-full bg-[#1e4ed8] text-white flex items-center justify-center hover:bg-[#07006f] transition-colors shadow-sm">
              <PiMagnifyingGlass className="text-[18px]" />
            </button>
          </form>
        </div>

        {/* Right Side: Icons + Profile */}
        <div className="flex items-center gap-3 md:gap-6">
          <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-neutral-8 hover:bg-neutral-2 transition-colors">
            <PiGlobe className="text-[24px]" />
          </button>
          
          {/* Mobile Search Button */}
          <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-neutral-8 hover:bg-neutral-2 transition-colors">
            <PiMagnifyingGlass className="text-[24px]" />
          </button>

          <Link href="/dashboard/notifications" className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-8 hover:bg-neutral-2 transition-colors relative">
            <PiBell className="text-[24px]" />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error-5 border border-white"></span>
            )}
          </Link>
          
          <Link href="/dashboard/settings" className="w-10 h-10 rounded-full overflow-hidden border border-[#dedee7] hover:border-[#1e4ed8] transition-colors shadow-sm cursor-pointer ml-1 md:ml-2 bg-primary-2 flex items-center justify-center shrink-0">
            {(user?.avatar || user?.avatarUrl) ? (
              <img src={user.avatar || user.avatarUrl} alt="User avatar" loading="lazy" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }} />
            ) : (
              <PiUser className="text-[22px] text-neutral-6" />
            )}
          </Link>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar */}
        <aside 
          className={`bg-white border-r border-neutral-4 flex flex-col transition-all duration-300 z-[30] 
            ${isSidebarOpen ? 'w-[250px] absolute md:relative h-full left-0' : 'w-[80px] hidden md:flex h-full'}
            ${!isSidebarOpen && 'md:w-[80px] -left-full md:left-0'}
          `}
        >
          <nav data-lenis-prevent className="flex-1 py-4 flex flex-col overflow-y-auto overflow-x-hidden">
            {user?.role === "instructor" ? (
              <>
                <div className="px-6 py-4 pb-6">
                  <p className="text-[16px] font-bold text-[#202127]">Tutor Dashboard</p>
                  <p className="text-[10px] font-semibold text-[#717480] uppercase tracking-wider mt-1">Mentoring Excellence</p>
                </div>
                <SidebarItem
                  icon={PiSquaresFour}
                  label="Dashboard"
                  to="/dashboard"
                  active={pathname === "/dashboard"}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiGraduationCap}
                  label="My Courses"
                  to="/dashboard/courses"
                  active={pathname.includes("/dashboard/courses")}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiCloudArrowUp}
                  label="Upload"
                  to="/dashboard/upload"
                  active={pathname.includes("/dashboard/upload")}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiChatCircle}
                  label="Messages"
                  to="/dashboard/messages"
                  active={pathname.includes("/dashboard/messages")}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiStar}
                  label="Reviews"
                  to="/dashboard/reviews"
                  active={pathname.includes("/dashboard/reviews")}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiMoney}
                  label="Earnings"
                  to="/dashboard/earnings"
                  active={pathname.includes("/dashboard/earnings")}
                  isOpen={isSidebarOpen}
                />
                <div className="my-4 border-t border-neutral-4"></div>
                <SidebarItem
                  icon={PiUser}
                  label="Account"
                  to="/dashboard/settings"
                  active={pathname.includes("/dashboard/settings")}
                  isOpen={isSidebarOpen}
                />
                <button
                  onClick={() => handleLogout()}
                  className={`flex items-center gap-4 px-6 py-[14px] text-[#4e515c] hover:bg-[#f4f7fb] hover:text-[#e30000] font-medium transition-colors w-full ${!isSidebarOpen && 'justify-center px-0'}`}
                  title={!isSidebarOpen ? "Logout" : ""}
                >
                  <PiSignOut className="text-[20px] shrink-0" />
                  {isSidebarOpen && <span className="text-[14px]">Logout</span>}
                </button>
              </>
            ) : (
              <>
                <SidebarItem
                  icon={PiGraduationCap}
                  label="My Learning"
                  to="/dashboard"
                  active={pathname === "/dashboard" || pathname === "/dashboard/"}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiCompass}
                  label="Our Courses"
                  to="/dashboard/explore"
                  active={pathname.includes("/dashboard/explore")}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiStudent}
                  label="Trimester Courses"
                  to="/lms"
                  active={pathname.startsWith("/lms")}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiCertificate}
                  label="Certificates"
                  to="/dashboard/certificates"
                  active={pathname.includes("/dashboard/certificates")}
                  isOpen={isSidebarOpen}
                />
                <SidebarItem
                  icon={PiGear}
                  label="Settings"
                  to="/dashboard/settings"
                  active={pathname.includes("/dashboard/settings")}
                  isOpen={isSidebarOpen}
                />
                <button
                  onClick={() => handleLogout()}
                  className={`flex items-center gap-4 px-6 py-[14px] text-[#4e515c] hover:bg-[#f4f7fb] hover:text-[#e30000] font-medium transition-colors w-full ${!isSidebarOpen && 'justify-center px-0'}`}
                  title={!isSidebarOpen ? "Logout" : ""}
                >
                  <PiSignOut className="text-[20px] shrink-0" />
                  {isSidebarOpen && <span className="text-[14px]">Logout</span>}
                </button>
              </>
            )}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 z-[20] md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Scrollable Content. data-lenis-prevent: the page-level Lenis smooth scroll (Providers)
            swallows wheel events, so inner scroll containers must opt out to scroll natively. */}
        <main data-lenis-prevent className="flex-1 overflow-y-auto bg-[#f8fafc] relative w-full">
           {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
