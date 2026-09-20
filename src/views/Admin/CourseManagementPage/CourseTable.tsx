"use client";

import React from "react";
import { useRouter } from "next/navigation";

export interface Course {
  id: string;
  title: string;
  tutorName: string;
  tutorAvatar: string;
  category: string;
  dateSubmitted?: string;
  dateRejected?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface CourseTableProps {
  courses: Course[];
  activeTab: string;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, activeTab }) => {
  const router = useRouter();

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#fafbfc]">
              <th className="py-4 px-6 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider">Course Title</th>
              <th className="py-4 px-6 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider">Tutor Name</th>
              <th className="py-4 px-6 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider">Category</th>
              <th className="py-4 px-6 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider">
                {activeTab === "Rejected" ? "Date Rejected" : "Date Submitted"}
              </th>
              <th className="py-4 px-6 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-[#f0f4f8] last:border-none hover:bg-[#f8fafc] transition-colors">
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f0f4ff] rounded-[8px] flex items-center justify-center text-[#3b82f6]">
                      {/* Simple document/play icon placeholder */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                    <span className="font-bold text-[#202127]">{course.title}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img src={course.tutorAvatar} alt={course.tutorName} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-[#4e515c] font-medium">{course.tutorName}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="bg-[#f0f4f8] text-[#4e515c] font-bold text-[12px] px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-[#717480]">
                  {activeTab === "Rejected" ? course.dateRejected : course.dateSubmitted}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {course.status === "PENDING" && (
                    <span className="bg-[#fffbf0] text-[#d97706] font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-2 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span> PENDING
                    </span>
                  )}
                  {course.status === "APPROVED" && (
                    <span className="bg-[#e6f7ef] text-[#048848] font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-2 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#048848]"></span> APPROVED
                    </span>
                  )}
                  {course.status === "REJECTED" && (
                    <span className="bg-[#ffe8e8] text-[#e02b2b] font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-2 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e02b2b]"></span> REJECTED
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <button 
                    onClick={() => router.push(`/admin/courses/${course.id}`)}
                    className="text-[#3b82f6] font-bold text-[13px] hover:text-[#181C7B] transition-colors"
                  >
                    {activeTab === "Rejected" ? "Review Appeal" : "View Details"}
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#717480]">
                  No courses found for this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      {courses.length > 0 && (
        <div className="p-4 border-t border-[#e2e8f0] flex items-center justify-between bg-[#fafbfc]">
          <span className="text-[#717480] text-[13px]">
            Showing 1-{courses.length} of {courses.length} Courses
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#e2e8f0] bg-white text-[#A0AEC0] hover:text-[#202127]">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#e2e8f0] bg-white text-[#A0AEC0] hover:text-[#202127]">
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTable;
