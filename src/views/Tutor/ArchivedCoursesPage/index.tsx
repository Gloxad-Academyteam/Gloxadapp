"use client";

import React, { useState } from "react";
import { FaChartBar, FaEllipsisV, FaFilter, FaFileExport, FaTrashAlt } from "react-icons/fa";

const ARCHIVED_COURSES = [
  {
    id: 1,
    title: "Quantum Physics 101: Foundation",
    status: "Outdated Content",
    published: "Jan 12, 2021",
    archived: "Oct 05, 2023",
    thumbnail: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Legacy Web Architectures",
    status: "Course Retired",
    published: "May 20, 2019",
    archived: "Jan 15, 2024",
    thumbnail: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "Intro to Blockchain Systems",
    status: "Replaced by v2.0",
    published: "Aug 30, 2022",
    archived: "Feb 12, 2024",
    thumbnail: "https://via.placeholder.com/150",
  },
];

const BULK_ARCHIVED = [
  { id: 101, name: "Molecular Biology: Advanced Studies", originalDate: "Mar 02, 2020", archiveDate: "Nov 18, 2023", reason: "Curriculum Update" },
  { id: 102, name: "Introduction to 19th Century Literature", originalDate: "Sep 15, 2018", archiveDate: "Dec 01, 2023", reason: "Retired" },
  { id: 103, name: "Basic Algebra", originalDate: "Jun 10, 2021", archiveDate: "Jan 05, 2024", reason: "Rejected" },
  { id: 104, name: "Basic Algebra", originalDate: "Jun 10, 2021", archiveDate: "Jan 05, 2024", reason: "Outdated" },
];

export default function ArchivedCoursesPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Outdated Content":
      case "Outdated": return "bg-[#ffe4e6] text-[#e11d48]";
      case "Course Retired":
      case "Retired": return "bg-[#e0f2fe] text-[#0284c7]";
      case "Replaced by v2.0": return "bg-[#f1f5f9] text-[#475569]";
      case "Curriculum Update": return "bg-[#e0e7ff] text-[#4f46e5]";
      case "Rejected": return "bg-[#ffe4e6] text-[#e11d48]";
      default: return "bg-[#f1f5f9] text-[#475569]";
    }
  };

  return (
    <div className="w-full h-full bg-[#fcfcfd] p-4 sm:p-6 lg:p-10 text-[#202127] overflow-y-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight mb-2">Archived Courses</h1>
          <p className="text-[14px] text-[#717480] max-w-[600px] leading-[1.6]">
            Review and manage courses that have been removed from the active catalog. You can restore courses to active status or view historical performance data.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-[6px] text-[13px] font-bold text-[#4e515c] hover:bg-[#f8fafc] transition-colors">
            <FaFilter className="text-[#a0aab8]" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-[6px] text-[13px] font-bold text-[#4e515c] hover:bg-[#f8fafc] transition-colors">
            <FaFileExport className="text-[#a0aab8]" /> Export Report
          </button>
        </div>
      </div>

      {/* Grid View for highly visible archived courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {ARCHIVED_COURSES.map(course => (
          <div key={course.id} className="bg-white border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-[160px] bg-[#e2e8f0] w-full">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${getBadgeColor(course.status)}`}>
                  {course.status}
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-[16px] font-bold text-[#07004d] mb-4 line-clamp-2">{course.title}</h3>
              <div className="flex justify-between items-center text-[12px] text-[#717480] mb-2">
                <span>Published</span>
                <span className="font-medium text-[#4e515c]">{course.published}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] text-[#717480] mb-6">
                <span>Archived</span>
                <span className="font-medium text-[#4e515c]">{course.archived}</span>
              </div>
              <div className="mt-auto flex items-center gap-2">
                <button className="flex-1 py-2 bg-[#07004d] text-white text-[13px] font-bold rounded-[6px] hover:bg-[#0a006e] transition-colors">
                  Restore Course
                </button>
                <button className="w-10 h-10 border border-[#e2e8f0] rounded-[6px] flex items-center justify-center text-[#717480] hover:bg-[#f8fafc] transition-colors">
                  <FaChartBar />
                </button>
                <button className="w-10 h-10 border border-[#e2e8f0] rounded-[6px] flex items-center justify-center text-[#717480] hover:bg-[#f8fafc] transition-colors">
                  <FaEllipsisV />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Archive View Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-[16px] overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-5 bg-[#fcfcfd] border-b border-[#e2e8f0]">
          <h2 className="text-[16px] font-bold text-[#202127]">Bulk Archive View</h2>
          <div className="flex items-center gap-4">
            {selectedIds.length > 0 && <span className="text-[13px] font-medium text-[#717480]">{selectedIds.length} Items Selected</span>}
            <button className={`px-4 py-2 text-[13px] font-bold rounded-[6px] transition-colors ${selectedIds.length > 0 ? 'bg-[#e11d48] text-white hover:bg-[#be123c]' : 'bg-[#ffe4e6] text-[#f43f5e] opacity-50 cursor-not-allowed'}`}>
              Delete Permanently
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#717480] uppercase tracking-wider">
                <th className="px-5 py-4 w-[50px]"><input type="checkbox" className="rounded-[4px] border-[#cbd5e1]" onChange={(e) => {
                  if (e.target.checked) setSelectedIds(BULK_ARCHIVED.map(c => c.id));
                  else setSelectedIds([]);
                }} checked={selectedIds.length === BULK_ARCHIVED.length && BULK_ARCHIVED.length > 0} /></th>
                <th className="px-5 py-4 min-w-[200px]">COURSE NAME</th>
                <th className="px-5 py-4 w-[150px]">ORIGINAL DATE</th>
                <th className="px-5 py-4 w-[150px]">ARCHIVE DATE</th>
                <th className="px-5 py-4 w-[150px]">REASON</th>
                <th className="px-5 py-4 w-[100px] text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {BULK_ARCHIVED.map(course => (
                <tr key={course.id} className="hover:bg-[#fcfcfd] transition-colors">
                  <td className="px-5 py-4">
                    <input type="checkbox" className="rounded-[4px] border-[#cbd5e1]" checked={selectedIds.includes(course.id)} onChange={() => toggleSelect(course.id)} />
                  </td>
                  <td className="px-5 py-4 text-[13px] font-bold text-[#202127]">{course.name}</td>
                  <td className="px-5 py-4 text-[13px] text-[#717480]">{course.originalDate}</td>
                  <td className="px-5 py-4 text-[13px] text-[#717480]">{course.archiveDate}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getBadgeColor(course.reason)}`}>
                      {course.reason}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button className="text-[13px] font-bold text-[#07004d] hover:underline">Restore</button>
                      <button className="text-[#a0aab8] hover:text-[#e11d48] transition-colors"><FaTrashAlt /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-[#fcfcfd]">
          <p className="text-[12px] text-[#717480]">Showing {BULK_ARCHIVED.length} of 58 archived courses</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-[4px] border border-[#e2e8f0] flex items-center justify-center text-[#cbd5e1] bg-white cursor-not-allowed">{"<"}</button>
            <button className="w-8 h-8 rounded-[4px] border border-[#e2e8f0] flex items-center justify-center text-[#4e515c] hover:bg-[#f8fafc] transition-colors bg-white">{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
