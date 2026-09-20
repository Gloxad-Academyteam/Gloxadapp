import React from "react";
import { FaTimes, FaCheckCircle, FaPlayCircle } from "react-icons/fa";

interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onSubmit?: () => void;
  isLoading?: boolean;
}

export default function CoursePreviewModal({ isOpen, onClose, data, onSubmit, isLoading }: PreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-8 animate-in fade-in duration-200">
      <div className="bg-[#fcfcfd] w-full max-w-[1000px] max-h-[90vh] rounded-[20px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#e2e8f0] flex items-center justify-between shrink-0">
          <h2 className="text-[18px] font-bold text-[#202127]">Course Preview</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0f4f8] text-[#717480] transition-colors">
            <FaTimes className="text-[16px]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <span className="inline-block px-3 py-1 bg-[#f0f4f8] text-[#3e92cc] text-[12px] font-bold rounded-[6px] mb-3 uppercase tracking-wider">
                  {data?.category || "Category"}
                </span>
                <h1 className="text-[28px] font-bold text-[#202127] leading-tight mb-4">
                  {data?.title || "Complete Figma Megacourse: UI/UX Design Masterclass"}
                </h1>
                <p className="text-[15px] text-[#717480] leading-relaxed">
                  {data?.topic || "Master UI/UX design principles, wireframing, prototyping, and create stunning interfaces."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center text-[13px] text-[#717480] font-medium border-y border-[#e2e8f0] py-4">
                <span className="flex items-center gap-2"><FaCheckCircle className="text-[#8bc34a]" /> Beginner Level</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-[#8bc34a]" /> 12 Weeks</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-[#8bc34a]" /> English</span>
              </div>

              <div>
                <h3 className="text-[18px] font-bold text-[#202127] mb-4">What you'll learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(data?.whatYouWillTeach?.length ? data.whatYouWillTeach : ["Design Theory", "Wireframing", "Prototyping", "User Research"]).map((item: string, idx: number) => (
                    item && (
                      <div key={idx} className="flex items-start gap-3">
                        <FaCheckCircle className="text-[#3e92cc] mt-1 shrink-0" />
                        <span className="text-[14px] text-[#717480]">{item}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Floating Video Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-lg overflow-hidden sticky top-0">
                {/* Video Placeholder */}
                <div className="aspect-video bg-[#1a1c23] relative flex items-center justify-center cursor-pointer group">
                  <FaPlayCircle className="text-[48px] text-white/80 group-hover:text-white transition-colors group-hover:scale-110 duration-300" />
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[12px] px-2 py-1 rounded-[4px] font-medium backdrop-blur-sm">Preview Course</span>
                </div>
                
                <div className="p-6">
                  <div className="text-[28px] font-bold text-[#202127] mb-4">Free</div>
                  <button className="w-full py-3 bg-[#07004d] hover:bg-[#0a006e] text-white text-[14px] font-bold rounded-[8px] transition-colors mb-4">
                    Enroll Now
                  </button>
                  <p className="text-[12px] text-center text-[#717480]">Full lifetime access to course materials</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#fcfcfd] border-t border-[#e2e8f0] flex items-center justify-between shrink-0">
          <p className="text-[13px] text-[#717480] font-medium">Please review all information before submitting.</p>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="px-6 py-2 rounded-[8px] border border-[#e2e8f0] text-[14px] font-bold text-[#202127] hover:bg-white transition-colors">
              Go Back
            </button>
            <button 
              onClick={onSubmit}
              disabled={isLoading}
              className="px-6 py-2 rounded-[8px] bg-[#8bc34a] text-[14px] font-bold text-white hover:bg-[#7cb342] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
