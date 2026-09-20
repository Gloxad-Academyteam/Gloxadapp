"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

export default function CourseCompletedPage() {
  const { id: courseId } = useParams()!;
  const router = useRouter();

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course.completed", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      return res.data;
    },
    enabled: !!courseId
  });

  if (isLoading) return <div className="p-20 text-center text-white">Loading...</div>;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 text-white" style={{ background: "linear-gradient(135deg, #07006f 0%, #1e3a8a 100%)" }}>
      
      <div className="max-w-[500px] w-full text-center">
        {/* Placeholder for Illustration */}
        <div className="w-[280px] h-[280px] mx-auto mb-8 bg-white/10 rounded-full flex items-center justify-center relative shadow-[0_0_80px_rgba(255,255,255,0.1)]">
          <img 
            src="/assets/completed_illustration_placeholder.svg" 
            alt="Course Completed"
            className="w-[200px] h-[200px] object-contain drop-shadow-2xl"
            onError={(e) => {
              // fallback if asset not found
              (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/3135/3135692.png";
              (e.target as HTMLImageElement).style.filter = "brightness(0) invert(1)";
            }}
          />
        </div>

        <h1 className="text-[36px] font-bold mb-4 drop-shadow-md">Course completed successfully!</h1>
        <p className="text-[16px] text-blue-100 mb-10 leading-relaxed max-w-[400px] mx-auto">
          Congratulations! You've successfully completed <span className="font-bold text-white">"{courseData?.title || 'the course'}"</span>. 
          Your certificate of completion is now available.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => router.push(`/learning/${courseId}/certificate`)}
            className="w-full sm:w-auto px-8 h-[52px] bg-white text-[#07006f] rounded-[8px] font-bold text-[15px] hover:bg-gray-100 transition-colors shadow-lg"
          >
            Download Certificate
          </button>
          <button 
            onClick={() => router.push("/dashboard/courses")}
            className="w-full sm:w-auto px-8 h-[52px] bg-transparent border-2 border-white text-white rounded-[8px] font-bold text-[15px] hover:bg-white/10 transition-colors"
          >
            Go to dashboard
          </button>
        </div>
      </div>

    </div>
  );
}
