"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  HiCheckCircle, 
  HiEllipsisVertical, 
  HiPencil, 
  HiXCircle, 
  HiOutlineClock,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowsUpDown,
  HiOutlineExclamationCircle
} from "react-icons/hi2";
import { PiStack } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { TableSkeleton, Skeleton } from "../../../components/Skeleton";

// Vector Clipboard Illustration matching Figma design
const ClipboardIllustration = () => (
  <svg width="320" height="260" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
    {/* Back Clipboard (Tilted left) */}
    <g transform="translate(30, 25) rotate(-14 80 100)">
      <rect x="10" y="28" width="145" height="185" rx="14" fill="#FFFFFF" stroke="#07004D" strokeWidth="2.5" />
      <rect x="26" y="48" width="113" height="148" rx="8" fill="#EAECEF" />
      {/* Top Clip */}
      <rect x="42" y="10" width="80" height="28" rx="7" fill="#07004D" />
      <circle cx="82" cy="10" r="7.5" stroke="#07004D" strokeWidth="3" fill="#FFFFFF" />
    </g>

    {/* Front Clipboard (Standing upright) */}
    <g transform="translate(105, 40)">
      <rect x="10" y="28" width="150" height="190" rx="14" fill="#FFFFFF" stroke="#07004D" strokeWidth="2.5" />
      <rect x="26" y="48" width="118" height="152" rx="8" fill="#EAECEF" />
      {/* Top Clip */}
      <rect x="45" y="10" width="80" height="28" rx="7" fill="#07004D" />
      <circle cx="85" cy="10" r="7.5" stroke="#07004D" strokeWidth="3" fill="#FFFFFF" />
    </g>
  </svg>
);

export default function MyCoursesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Courses");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["tutor.courses"],
    queryFn: async () => {
      const res = await axiosInstance.get("/tutor/courses");
      if (!res.data?.courses) return [];
      
      return res.data.courses.map((c: any) => ({
        id: c._id,
        slug: c.slug,
        title: c.title,
        modules: c.modules?.length || 0,
        students: c.enrollmentCount || 0,
        category: c.category?.name || "General",
        uploadDate: new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: c.status === "published" ? "Approved" : c.status === "pending" ? "Pending" : c.status === "rejected" ? "Rejected" : "Draft",
        thumbnail: c.thumbnailUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=300&auto=format&fit=crop&q=80",
      }));
    }
  });

  const tabs = ["All Courses", "Approved", "Pending", "Rejected"];

  const filteredCourses = courses.filter((course: any) => {
    if (activeTab === "All Courses") return true;
    return course.status === activeTab;
  });

  const totalCount = courses.length;
  const approvedCount = courses.filter((c: any) => c.status === "Approved").length;
  const pendingCount = courses.filter((c: any) => c.status === "Pending").length;
  const rejectedCount = courses.filter((c: any) => c.status === "Rejected").length;

  if (isLoading) {
    return (
      <div className="w-full h-full bg-[#f8fafc] p-6 lg:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-12 w-44 rounded-xl" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  // 100% Pixel-Perfect Empty State matching Figma UI Image when no courses exist
  if (courses.length === 0) {
    return (
      <div className="w-full min-h-[85vh] bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-[500px] mx-auto flex flex-col items-center">
          <ClipboardIllustration />

          <h2 className="text-[26px] font-extrabold text-[#07004d] mt-6 mb-3 leading-tight">
            No Courses Yet
          </h2>

          <p className="text-[15px] text-[#717480] mb-8 leading-relaxed max-w-[420px]">
            You haven’t add in any courses. Start your career journey now!
          </p>

          <Link 
            href="/dashboard/upload" 
            className="px-12 py-4 bg-[#07004d] hover:bg-[#0a006e] text-white text-[16px] font-bold rounded-full transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            Add Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f8fafc] p-4 sm:p-6 lg:p-10 text-[#202127] overflow-y-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#07004d] leading-tight">My Courses</h1>
          <p className="text-[13px] text-[#8993a4] mt-1">Manage your curriculum and monitor course approval statuses.</p>
        </div>
        <Link 
          href="/dashboard/upload" 
          className="px-6 py-3 bg-[#07004d] text-white text-[14px] font-bold rounded-xl hover:bg-[#0a006e] transition-all duration-200 shrink-0 flex items-center gap-2 w-max shadow-sm"
        >
          + Create New Course
        </Link>
      </div>

      {/* 2. Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {/* TOTAL COURSES */}
        <div className="bg-white p-5 rounded-[16px] border border-[#f0f4f8] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold text-[#8993a4] uppercase tracking-wider">TOTAL COURSES</p>
            <div className="bg-[#eeecff] text-[#4c40e6] p-2 rounded-lg">
              <PiStack className="text-[18px]" />
            </div>
          </div>
          <div>
            <h3 className="text-[28px] font-extrabold text-[#07004d] leading-none mb-1.5">{totalCount}</h3>
            <p className="text-[12px] text-[#3e92cc] font-medium flex items-center gap-1">
              <span>↗</span> +3 this month
            </p>
          </div>
        </div>

        {/* APPROVED */}
        <div className="bg-white p-5 rounded-[16px] border border-[#f0f4f8] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold text-[#8993a4] uppercase tracking-wider">APPROVED</p>
            <HiCheckCircle className="text-[#3e92cc] text-[22px]" />
          </div>
          <div>
            <h3 className="text-[28px] font-extrabold text-[#07004d] leading-none mb-1.5">{approvedCount}</h3>
            <p className="text-[12px] text-[#a0aec0]">Live and accessible</p>
          </div>
        </div>

        {/* PENDING */}
        <div className="bg-white p-5 rounded-[16px] border border-[#f0f4f8] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold text-[#8993a4] uppercase tracking-wider">PENDING</p>
            <HiOutlineClock className="text-[#a0aec0] text-[22px]" />
          </div>
          <div>
            <h3 className="text-[28px] font-extrabold text-[#07004d] leading-none mb-1.5">{pendingCount}</h3>
            <p className="text-[12px] text-[#a0aec0]">Under academic review</p>
          </div>
        </div>

        {/* REJECTED */}
        <div className="bg-white p-5 rounded-[16px] border border-[#f0f4f8] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold text-[#8993a4] uppercase tracking-wider">REJECTED</p>
            <HiXCircle className="text-[#e53e3e] text-[22px]" />
          </div>
          <div>
            <h3 className="text-[28px] font-extrabold text-[#e53e3e] leading-none mb-1.5">{rejectedCount}</h3>
            <p className="text-[12px] text-[#a0aec0]">Needs revision</p>
          </div>
        </div>
      </div>

      {/* 3. Main Filter Tabs & Course Table Container */}
      <div className="bg-white rounded-[20px] border border-[#f0f4f8] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Header Tabs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#f0f4f8] px-6 py-2 bg-[#f8fafc]">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-[14px] font-bold whitespace-nowrap transition-all relative ${
                  activeTab === tab ? "text-[#07004d]" : "text-[#8993a4] hover:text-[#07004d]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#07004d] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[#8993a4] mt-3 sm:mt-0 ml-auto sm:ml-0">
            <button className="p-2 hover:text-[#07004d] rounded-lg transition-colors">
              <HiOutlineAdjustmentsHorizontal className="text-[20px]" />
            </button>
            <button className="p-2 hover:text-[#07004d] rounded-lg transition-colors">
              <HiOutlineArrowsUpDown className="text-[20px]" />
            </button>
          </div>
        </div>

        {/* Desktop Table Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-[#f0f4f8] text-[11px] font-bold text-[#8993a4] uppercase tracking-wider bg-[#f8fafc]">
          <div className="col-span-4">COURSE DETAIL</div>
          <div className="col-span-2">CATEGORY</div>
          <div className="col-span-2">UPLOAD DATE</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#f0f4f8]">
          {filteredCourses.map((course: any) => (
            <div 
              key={course.id} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#f8fafc] transition-colors"
            >
              {/* Course Detail */}
              <div 
                className="col-span-1 lg:col-span-4 flex items-center gap-4 cursor-pointer group" 
                onClick={() => router.push(`/dashboard/courses/${course.id}`)}
              >
                <div className="w-[64px] h-[44px] rounded-lg bg-gray-200 shrink-0 overflow-hidden shadow-xs">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#07004d] group-hover:underline leading-snug">{course.title}</h4>
                  <p className="text-[12px] text-[#8993a4] mt-0.5">
                    {course.modules} Modules • {course.status === "Rejected" ? "Rejected" : (course.students > 0 ? `${course.students} Students` : "New Upload")}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="col-span-1 lg:col-span-2">
                <span className="inline-block px-3.5 py-1 bg-[#e0f2fe] text-[#0284c7] text-[12px] font-semibold rounded-full">
                  {course.category}
                </span>
              </div>

              {/* Upload Date */}
              <div className="col-span-1 lg:col-span-2">
                <span className="text-[13px] text-[#4e515c] font-medium">{course.uploadDate}</span>
              </div>

              {/* Status */}
              <div className="col-span-1 lg:col-span-2">
                {course.status === "Approved" && (
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#3e92cc]">
                    <HiCheckCircle className="text-[16px]" /> Approved
                  </span>
                )}
                {course.status === "Pending" && (
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#2d3748]">
                    <HiOutlineClock className="text-[16px] text-[#a0aec0]" /> Pending
                  </span>
                )}
                {course.status === "Rejected" && (
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#e53e3e]">
                    <HiOutlineExclamationCircle className="text-[16px]" /> Rejected
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 lg:col-span-2 flex items-center justify-start lg:justify-end">
                {course.status === "Approved" && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === course.id ? null : course.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#4e515c] transition-colors"
                    >
                      <HiEllipsisVertical className="text-[20px]" />
                    </button>
                    {openDropdownId === course.id && (
                      <div className="absolute right-0 top-full mt-1 w-[180px] bg-white border border-[#f0f4f8] rounded-xl shadow-lg z-20 py-2 text-left">
                        <button
                          onClick={() => { setOpenDropdownId(null); router.push(`/dashboard/courses/${course.id}/edit`); }}
                          className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#4e515c] hover:bg-[#f8fafc] hover:text-[#07004d]"
                        >
                          ✏️ Edit Course
                        </button>
                        <button
                          onClick={() => { setOpenDropdownId(null); router.push(`/courses/${course.slug || course.id}`); }}
                          className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#4e515c] hover:bg-[#f8fafc] hover:text-[#3e92cc]"
                        >
                          👁️ View as Student
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {course.status === "Pending" && (
                  <button
                    title="Edit course"
                    onClick={() => router.push(`/dashboard/courses/${course.id}/edit`)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#4e515c] transition-colors"
                  >
                    <HiPencil className="text-[18px]" />
                  </button>
                )}

                {course.status === "Rejected" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/courses/${course.id}/feedback`)}
                      className="px-3 py-1.5 border border-[#e53e3e] text-[#e53e3e] bg-white text-[11px] font-bold rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                    >
                      View Reason
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/courses/${course.id}/appeal`)}
                      className="px-3.5 py-1.5 bg-[#07004d] text-white text-[11px] font-bold rounded-lg hover:bg-[#0f0066] transition-colors whitespace-nowrap"
                    >
                      Appeal
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="p-12 text-center text-[#8993a4] text-[14px]">
              No courses found in this status category.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#f0f4f8] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f8fafc]">
          <p className="text-[13px] text-[#8993a4]">
            Showing 1 to {filteredCourses.length} of {courses.length} courses
          </p>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a0aec0] hover:text-[#07004d] text-[14px]">
              &lt;
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#07004d] text-white text-[13px] font-bold flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-8 h-8 rounded-lg text-[#4e515c] hover:bg-gray-200 text-[13px] font-bold flex items-center justify-center">
              2
            </button>
            <button className="w-8 h-8 rounded-lg text-[#4e515c] hover:bg-gray-200 text-[13px] font-bold flex items-center justify-center">
              3
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a0aec0] hover:text-[#07004d] text-[14px]">
              &gt;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
