"use client";

import React from "react";
import { FaTools, FaArrowLeft } from "react-icons/fa";

const ComingSoonPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-24 h-24 bg-[#e6f0ff] rounded-full flex items-center justify-center mb-6 shadow-inner">
        <FaTools className="text-4xl text-[#07004d]" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#07004d] mb-4 tracking-tight">
        Feature Coming Soon
      </h1>
      
      <p className="text-[#555] text-lg max-w-md mb-8 leading-relaxed">
        We are working hard behind the scenes to build this out! This section will be available in the upcoming release.
      </p>
      
      <button 
        onClick={() => window.history.back()}
        className="flex items-center gap-2 px-6 py-3 bg-[#07004d] text-white text-[15px] font-bold rounded-[8px] hover:bg-[#0a006e] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        <FaArrowLeft />
        Go Back
      </button>
    </div>
  );
};

export default ComingSoonPage;
