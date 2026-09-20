"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiOutlineArrowRightOnRectangle, 
  HiOutlineGlobeAlt, 
  HiOutlineUser,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineCloudArrowUp,
  HiOutlineVideoCamera,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineStar,
  HiOutlineCreditCard,
  HiOutlineCog8Tooth,
  HiOutlineMagnifyingGlass
} from "react-icons/hi2";
import useAuth from "@hooks/useAuth";

const SidebarItem = ({
  icon: Icon,
  label,
  to,
  active,
  isOpen,
}: {
  icon: any;
  label: string;
  to: string;
  active?: boolean;
  isOpen?: boolean;
}) => (
  <Link href={to}
    className={`flex items-center gap-4 px-5 py-3.5 mx-3 rounded-[12px] font-medium transition-all duration-200 ${
      active
        ? "bg-[#07004d] text-white shadow-md"
        : "text-[#202127] hover:bg-black/5 border border-transparent"
    } ${!active && label === "Overview" ? "border-black/20" : ""}`}
  >
    <Icon className={`w-[24px] h-[24px] text-[24px] shrink-0 ${active ? "text-white" : "text-[#4e515c]"}`} />
    {isOpen && <span className="whitespace-nowrap">{label}</span>}
  </Link>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const { authenticatedUser, handleLogout } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#fcfcfd] relative w-full">
      {/* Sidebar */}
      <aside
        className={`bg-[#9bd4ee] transition-all duration-300 flex flex-col z-[30] shrink-0
          ${isSidebarOpen ? "w-[280px] absolute md:relative h-full left-0" : "w-[80px] hidden md:flex h-full"}
          ${!isSidebarOpen && "md:w-[80px] -left-full md:left-0"}
        `}
      >
        <div className="flex items-center justify-between h-[80px] px-6">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm p-2">
                <span className="text-[#07004d] font-bold text-[10px]">AA</span>
              </div>
              <span className="text-[14px] font-medium text-[#202127]">Admin</span>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-4 w-full">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm p-2">
                <span className="text-[#07004d] font-bold text-[10px]">AA</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-[#4e515c] hover:text-[#07004d] hidden md:block mt-4"
          >
            <span className="text-[20px] font-bold">☰</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <SidebarItem
            icon={HiOutlineSquares2X2}
            label="Overview"
            to="/admin"
            active={pathname === "/admin"}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineUserGroup}
            label="Tutors Management"
            to="/admin/tutors"
            active={pathname.includes("/admin/tutors")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineBookOpen}
            label="Course Management"
            to="/admin/courses"
            active={pathname.includes("/admin/courses")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineAcademicCap}
            label="Students Management"
            to="/admin/students"
            active={pathname.includes("/admin/students")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineCloudArrowUp}
            label="Upload Courses"
            to="/admin/upload"
            active={pathname.includes("/admin/upload")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineVideoCamera}
            label="Live Session"
            to="/admin/live"
            active={pathname.includes("/admin/live")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineChatBubbleOvalLeft} 
            label="Messages"
            to="/admin/messages"
            active={pathname.includes("/admin/messages")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineStar}
            label="Review"
            to="/admin/reviews"
            active={pathname.includes("/admin/reviews")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineCreditCard}
            label="Finance"
            to="/admin/finance"
            active={pathname.includes("/admin/finance")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={HiOutlineCog8Tooth}
            label="Settings"
            to="/admin/settings"
            active={pathname.includes("/admin/settings")}
            isOpen={isSidebarOpen}
          />
        </div>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 mx-3 w-[calc(100%-24px)] text-left rounded-[12px] text-[#FF4D4F] hover:bg-black/5 transition-colors font-medium"
          >
            <HiOutlineArrowRightOnRectangle className="w-[24px] h-[24px] text-[24px]" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`absolute inset-0 bg-black/50 z-[20] md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Admin Header */}
        <header className="h-[80px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-4 md:px-8 shrink-0 z-10 w-full">
          <div className="flex items-center gap-6 w-full max-w-[600px]">
            {/* Gloxad Logo instead of Menu icon on Desktop */}
            <div className="hidden md:flex items-center shrink-0">
              <img src="/gloxadlogo.png" alt="Gloxad" className="h-8 object-contain" />
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-[#4e515c] hover:text-[#07004d] md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-2 transition-colors"
            >
              <span className="text-[24px]">☰</span>
            </button>
            
            <div className="hidden md:flex items-center bg-white border border-[#e2e8f0] rounded-full pl-5 pr-1 py-1 w-full max-w-[400px] shadow-sm">
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="bg-transparent border-none outline-none text-[14px] text-[#717480] w-full"
              />
              <button className="w-[34px] h-[34px] rounded-full bg-[#1e40af] flex items-center justify-center text-white shrink-0 hover:bg-[#1e3a8a] transition-colors">
                <HiOutlineMagnifyingGlass className="text-[16px]" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-[#202127] hover:text-[#07004d] transition-colors" title="Go to Website">
              <HiOutlineGlobeAlt className="text-[24px]" />
            </a>
            <Link href="/admin/settings" className="text-[#202127] hover:text-[#07004d] transition-colors" title="Admin Profile & Settings">
              <HiOutlineUser className="text-[24px]" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className={`flex-1 overflow-y-auto bg-[#ffffff] w-full relative ${pathname.includes('/messages') ? '' : 'p-6 lg:p-10'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
