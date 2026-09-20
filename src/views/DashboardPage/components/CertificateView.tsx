import React from "react";
import { FaChevronLeft } from "react-icons/fa";

interface CertificateViewProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  score: string;
  certificateId: string;
  onBack: () => void;
}

const CertificateView: React.FC<CertificateViewProps> = ({
  studentName,
  courseName,
  completionDate,
  score,
  certificateId,
  onBack,
}) => {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Google Font for the cursive name */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        .font-cursive {
          font-family: 'Great Vibes', cursive;
        }
        .cert-bg {
          background: #fdfdfd;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }
        /* Top Left Blue Shapes */
        .shape-tl-1 {
          position: absolute;
          top: -50px;
          left: -50px;
          width: 0;
          height: 0;
          border-top: 250px solid #07004d;
          border-right: 250px solid transparent;
        }
        .shape-tl-2 {
          position: absolute;
          top: 60px;
          left: -60px;
          width: 350px;
          height: 80px;
          background: #07004d;
          transform: rotate(-45deg);
        }
        .shape-tl-3 {
          position: absolute;
          top: 180px;
          left: 40px;
          width: 80px;
          height: 12px;
          background: #07004d;
          transform: rotate(-45deg);
        }
        .shape-tl-4 {
          position: absolute;
          top: 70px;
          left: 200px;
          width: calc(100% - 280px);
          height: 3px;
          background: #ffc107;
        }
        .shape-tl-5 {
          position: absolute;
          top: 70px;
          right: 80px;
          width: 3px;
          height: 40%;
          background: #ffc107;
        }
        
        /* Bottom Right Blue Shapes */
        .shape-br-1 {
          position: absolute;
          bottom: -50px;
          right: -50px;
          width: 0;
          height: 0;
          border-bottom: 250px solid #07004d;
          border-left: 250px solid transparent;
        }
        .shape-br-2 {
          position: absolute;
          bottom: 60px;
          right: -60px;
          width: 350px;
          height: 80px;
          background: #07004d;
          transform: rotate(-45deg);
        }
        .shape-br-3 {
          position: absolute;
          bottom: 180px;
          right: 40px;
          width: 80px;
          height: 12px;
          background: #07004d;
          transform: rotate(-45deg);
        }
        .shape-br-4 {
          position: absolute;
          bottom: 70px;
          left: 80px;
          width: 3px;
          height: 20%;
          background: #ffc107;
        }
        .shape-br-5 {
          position: absolute;
          bottom: 70px;
          left: 80px;
          width: calc(100% - 280px);
          height: 3px;
          background: #ffc107;
        }

        /* Gold Badge */
        .gold-badge {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, #07004d 30%, #ffc107 40%, #ffd700 60%, #b8860b 80%, #ffc107 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          border: 4px dashed #fff;
          outline: 4px solid #b8860b;
        }
        .gold-badge::before {
          content: 'CERTIFIED';
          color: white;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 1px;
          text-align: center;
          position: absolute;
          width: 100%;
        }

        /* Watermark */
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 140px;
          font-weight: 900;
          color: rgba(7, 0, 77, 0.03);
          z-index: 0;
          pointer-events: none;
          letter-spacing: 10px;
        }
      `}</style>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#202127] font-bold text-[14px] hover:text-[#181C7B] w-fit transition-colors"
      >
        <FaChevronLeft className="text-[12px]" /> Back
      </button>

      {/* Certificate Container */}
      <div className="w-full max-w-[1000px] aspect-[1.414] mx-auto cert-bg flex items-center justify-center p-8 md:p-16">
        {/* Geometric Shapes */}
        <div className="shape-tl-1"></div>
        <div className="shape-tl-2"></div>
        <div className="shape-tl-3"></div>
        <div className="shape-tl-4"></div>
        <div className="shape-tl-5"></div>
        
        <div className="shape-br-1"></div>
        <div className="shape-br-2"></div>
        <div className="shape-br-3"></div>
        <div className="shape-br-4"></div>
        <div className="shape-br-5"></div>

        <div className="watermark">GLOXAD</div>

        {/* Certificate Content */}
        <div className="relative z-10 flex flex-col items-center text-center w-full h-full justify-between p-4">
          
          <div className="flex flex-col items-center mt-4">
            <h1 className="text-[42px] md:text-[64px] font-black text-[#07004d] leading-none mb-4 tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
              CERTIFICATE
            </h1>
            <div className="bg-[#ffc107] px-8 py-2">
              <span className="text-white text-[16px] md:text-[22px] font-bold tracking-widest uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>
                Of Completion
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center w-full max-w-[600px] mt-8">
            <h2 className="font-cursive text-[60px] md:text-[80px] text-[#07004d] leading-[0.8] mb-4">
              {studentName}
            </h2>
            <div className="w-[80%] border-t-[3px] border-dashed border-[#a0aec0] mb-8"></div>
            
            <p className="text-[16px] md:text-[20px] text-[#202127] leading-relaxed max-w-[500px]">
              has completed the <span className="font-bold text-[#07004d]">{courseName}</span> course on {completionDate} with a score of <span className="font-bold">{score}</span>.
            </p>
          </div>

          <div className="w-full flex justify-between items-end mt-auto px-4 md:px-12 pb-4">
            {/* Signature Area */}
            <div className="flex flex-col items-center w-[200px]">
              <div className="w-full border-t-[3px] border-dotted border-[#07004d] mb-3"></div>
              <span className="font-bold text-[#07004d] text-[18px]">Course Speaker</span>
            </div>

            {/* Gold Badge */}
            <div className="gold-badge mx-4"></div>

            {/* Date & ID */}
            <div className="flex flex-col items-start text-left w-[200px]">
              <span className="font-bold text-[#07004d] text-[16px] mb-1">Date: {completionDate}</span>
              <span className="font-bold text-[#07004d] text-[16px]">Certificate ID: {certificateId}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CertificateView;
