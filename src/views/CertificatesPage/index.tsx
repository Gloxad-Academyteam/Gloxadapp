"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiDownload } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";

export default function CertificatesPage() {
  const router = useRouter();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["certificates.enrollments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/enrollments/my-courses");
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-[#717480]">Loading certificates...</div>;

  // The API may return a list or an object wrapping one; anything else shows the empty state instead of crashing
  const enrollmentList: any[] = Array.isArray(enrollments)
    ? enrollments
    : Array.isArray(enrollments?.enrollments)
      ? enrollments.enrollments
      : Array.isArray(enrollments?.data)
        ? enrollments.data
        : [];
  const completedCourses = enrollmentList.filter((e: any) => e.progress?.percent === 100);

  return (
    <div className="p-8 h-full bg-[#fcfcfd]">
      <h1 className="text-[24px] font-bold text-[#07006f] mb-2">My Certifications</h1>
      <p className="text-[14px] text-[#717480] mb-8">View and download certificates for courses you have successfully completed.</p>
      
      {completedCourses.length === 0 ? (
        <div className="bg-white rounded-[16px] p-12 text-center border border-[#dedee7] shadow-sm">
          <div className="w-[80px] h-[80px] bg-[#f8fafc] rounded-full mx-auto mb-4 flex items-center justify-center text-[32px]">
            🎓
          </div>
          <h2 className="text-[18px] font-bold text-[#202127] mb-2">No certificates yet</h2>
          <p className="text-[14px] text-[#717480]">Complete a course 100% to earn your first certificate.</p>
          <button 
            onClick={() => router.push("/dashboard/courses")}
            className="mt-6 px-6 h-[42px] bg-[#07006f] text-white rounded-[8px] font-medium text-[14px] hover:bg-[#0a0050]"
          >
            Go to My Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedCourses.map((enrollment: any) => (
            <div key={enrollment._id} className="bg-white border border-[#dedee7] rounded-[16px] overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
              <div className="h-[140px] bg-[#07006f] flex items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                <h3 className="text-white font-bold text-[16px] leading-tight z-10">{enrollment.course?.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-[12px] text-[#717480] uppercase tracking-wider font-bold mb-1">Instructor</p>
                <p className="text-[14px] text-[#202127] font-medium mb-6">
                  {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                </p>
                <button 
                  onClick={() => router.push(`/learning/${enrollment.course?._id}/certificate`)}
                  className="w-full h-[42px] border border-[#07006f] text-[#07006f] rounded-[8px] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#f5f8ff] transition-colors"
                >
                  <FiDownload /> Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

