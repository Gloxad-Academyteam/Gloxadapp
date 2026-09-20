"use client";

import React, { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiDownload, FiShare2, FiChevronLeft } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import useAuth from "../../hooks/useAuth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CourseCertificatePage() {
  const { id: courseId } = useParams()!;
  const router = useRouter();
  const { authenticatedUser: user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course.certificate", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      return res.data;
    },
    enabled: !!courseId
  });

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${courseData?.title?.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) return <div className="p-20 text-center text-[#717480]">Loading certificate...</div>;

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const studentName = user ? `${user.firstName} ${user.lastName}` : "Student Name";
  const instructorName = courseData?.instructor ? `${courseData.instructor.firstName} ${courseData.instructor.lastName}` : "Instructor Name";

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-[#202127] flex flex-col">
      {/* Header */}
      <header className="h-[70px] bg-white border-b border-[#dedee7] flex items-center justify-between px-6 shrink-0">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#4e515c] hover:text-[#07006f] transition-colors font-bold text-[14px]">
          <FiChevronLeft className="text-[20px]" /> Back
        </button>
        <div className="flex items-center gap-4">
          <button onClick={handleDownload} className="px-4 py-2 bg-white border border-[#dedee7] text-[#202127] rounded-[6px] text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50">
            <FiShare2 /> Share
          </button>
          <button onClick={handleDownload} className="px-4 py-2 bg-[#07006f] text-white rounded-[6px] text-[13px] font-bold flex items-center gap-2 hover:bg-[#0a0050]">
            <FiDownload /> Download PDF
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 flex justify-center items-start">
        
        {/* Certificate Container */}
        <div 
          ref={certificateRef}
          className="w-full max-w-[1000px] aspect-[1.414/1] relative shadow-xl overflow-hidden flex flex-col items-center justify-center p-12"
          style={{ 
            backgroundImage: "url('/images/certificate_bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Decorative Corner Elements (Removed since the image has its own design) */}
          
          <div className="absolute top-8 left-12 flex flex-col items-center">
            <div className="w-[50px] h-[50px] bg-[#07006f] rounded-full flex items-center justify-center text-white font-bold text-[20px] mb-1">
              G
            </div>
            <span className="text-[14px] font-bold text-[#07006f] tracking-widest uppercase">Gloxad</span>
          </div>

          <div className="text-center w-full z-10">
            <h1 className="text-[54px] font-serif text-[#07006f] mb-2">CERTIFICATE</h1>
            <h2 className="text-[24px] font-light tracking-[0.2em] text-[#717480] uppercase mb-12">OF COMPLETION</h2>
            
            <p className="text-[16px] text-[#4e515c] italic mb-4">This certificate is proudly presented to</p>
            
            <h3 className="text-[48px] font-serif text-[#202127] mb-8 border-b-2 border-[#e2e8f0] pb-2 inline-block px-12">
              {studentName}
            </h3>
            
            <p className="text-[16px] text-[#4e515c] italic mb-4">for successfully completing the course</p>
            
            <h4 className="text-[28px] font-bold text-[#07006f] mb-16 max-w-[800px] mx-auto leading-tight">
              {courseData?.title || "Advanced Web Development Masterclass"}
            </h4>

            <div className="flex items-end justify-between w-full max-w-[800px] mx-auto px-8">
              {/* Instructor Signature */}
              <div className="flex flex-col items-center w-[200px]">
                <div className="h-[40px] mb-2 flex items-end">
                  <span className="font-signature text-[32px] text-[#202127]">{instructorName}</span>
                </div>
                <div className="w-full h-[1px] bg-[#a0aab8] mb-2"></div>
                <span className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Course Instructor</span>
              </div>
              
              {/* Badge/Seal */}
              <div className="flex flex-col items-center">
                <div className="w-[100px] h-[100px] bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full flex items-center justify-center text-white relative shadow-lg mb-4">
                  <div className="w-[90px] h-[90px] border-2 border-dashed border-white/50 rounded-full flex flex-col items-center justify-center text-center p-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest mb-1">Gloxad</span>
                    <span className="text-[14px] font-serif font-bold">VERIFIED</span>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-[#202127]">{today}</span>
                <span className="text-[10px] font-bold text-[#717480] uppercase tracking-wider">Date of Issue</span>
              </div>

              {/* Admin Signature */}
              <div className="flex flex-col items-center w-[200px]">
                <div className="h-[40px] mb-2 flex items-end justify-center w-full relative">
                  {/* Mock admin signature image, would be dynamic in real life */}
                  <div className="absolute bottom-0 w-[120px] h-[40px] opacity-80" style={{ 
                    backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/f/f3/John_Hancock_Signature.svg')", 
                    backgroundSize: "contain", 
                    backgroundRepeat: "no-repeat", 
                    backgroundPosition: "center bottom" 
                  }}></div>
                </div>
                <div className="w-full h-[1px] bg-[#a0aab8] mb-2"></div>
                <span className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Platform Director</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
