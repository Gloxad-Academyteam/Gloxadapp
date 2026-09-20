import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaStar, FaPlay } from 'react-icons/fa';

const defaultModules = [
  { title: "Inclusive education and special education: Equality and equity", moduleNumber: 1, duration: "3 hours to complete" },
  { title: "Supporting disability inclusion", moduleNumber: 2, duration: "2 hours to complete" },
  { title: "Systemic support for educators", moduleNumber: 3, duration: "3 hours to complete" },
  { title: "Principles and approaches for disability inclusion", moduleNumber: 4, duration: "2 hours to complete" },
  { title: "Inclusive teaching", moduleNumber: 5, duration: "1 hour to complete" }
];

const CourseModules = ({ course }: { course?: any }) => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const modules = course?.modules?.length > 0 ? course.modules : defaultModules;

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-[1100px] mt-8">
      {/* Left Column - Modules Accordion */}
      <div className="flex-1 flex flex-col gap-0">
        <div className="border border-[#e2e8f0] rounded-[8px] overflow-hidden bg-white">
          {modules.map((mod: any, index: number) => (
            <div 
              key={index} 
              className={`border-b border-[#e2e8f0] last:border-b-0 cursor-pointer p-6 hover:bg-gray-50 transition ${expandedModule === index ? 'bg-gray-50' : ''}`}
              onClick={() => setExpandedModule(expandedModule === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-[#202127] mb-1 leading-[1.4]">
                    {mod.title}
                  </h3>
                  <p className="text-[13px] text-[#717480]">
                    Module {mod.moduleNumber || (index + 1)} • {mod.duration || `${mod.lessons?.length || 0} lessons`}
                  </p>
                </div>
                <div className="text-[#181C7B]">
                  {expandedModule === index ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>
              </div>
              {expandedModule === index && (
                <div className="mt-4 pt-4 border-t border-[#e2e8f0] text-[14px] text-[#4e515c] leading-relaxed space-y-4">
                  {mod.description && <p className="mb-4">{mod.description}</p>}
                  {mod.lessons && mod.lessons.length > 0 ? (
                    <div className="flex flex-col gap-3 pl-2 mt-2" onClick={(e) => e.stopPropagation()}>
                      {mod.lessons.map((lesson: any, lIdx: number) => (
                        <div key={lesson._id || lIdx} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <FaPlay className="text-[#181C7B] text-[10px] shrink-0" />
                            <span className="text-[14px] text-[#202127] font-medium">{lesson.title}</span>
                          </div>
                          <span className="text-[12px] text-[#717480]">{lesson.duration || "Self-paced"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !mod.description && <p className="text-[13px] text-[#717480] italic">No lectures uploaded for this module yet.</p>
                  )}
                  {mod.quiz && mod.quiz.title && (
                    <div className="flex items-center gap-2 mt-4 p-3 bg-[#f0f4f8] rounded-[6px]" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[14px] font-bold text-[#181C7B]">📝 Quiz:</span>
                      <span className="text-[13px] text-[#202127] font-medium">{mod.quiz.title}</span>
                      <span className="text-[12px] text-[#717480] ml-auto">({mod.quiz.questions?.length || 0} questions)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Certificate Banner */}
        <div className="mt-8 flex items-center gap-4 bg-white p-6 border border-[#e2e8f0] rounded-[8px] shadow-sm">
          <div className="bg-[#eaf2fd] h-12 w-12 rounded-[8px] flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#181C7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15H17M17 15L18.2 17.4C18.3 17.6 18.2 17.9 18 18L16.6 18.7C16.4 18.8 16.1 18.7 16 18.5L15 17" stroke="#181C7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.60005 15H7.00005M7.00005 15L5.80005 17.4C5.70005 17.6 5.80005 17.9 6.00005 18L7.40005 18.7C7.60005 18.8 7.90005 18.7 8.00005 18.5L9.00005 17" stroke="#181C7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 7H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V7Z" stroke="#181C7B" strokeWidth="2"/>
              <path d="M6 7V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V7" stroke="#181C7B" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h4 className="text-[16px] font-bold text-[#202127] mb-1">Earn a career certificate</h4>
            <p className="text-[13px] text-[#717480] leading-relaxed">
              Add this credential to your LinkedIn profile, resume, or CV. Share it on social media and in your performance review.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Instructor Info */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-6 mb-6 shadow-sm">
          <h3 className="text-[18px] font-bold text-[#202127] mb-2">Instructor</h3>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[13px] text-[#717480]">Instructor ratings</span>
            <div className="w-3 h-3 rounded-full bg-[#181C7B] text-white flex items-center justify-center text-[8px]">i</div>
            <span className="text-[14px] font-bold text-[#202127] flex items-center gap-1 ml-1">
              4.8 <FaStar className="text-[#181C7B] text-[12px]" />
            </span>
            <span className="text-[13px] text-[#717480]">(266 ratings)</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-200">
              <img 
                src={course?.instructor?.avatarUrl || "https://i.pravatar.cc/150?img=11"} 
                alt="Instructor" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-[#202127] underline decoration-1 underline-offset-2 cursor-pointer hover:text-[#181C7B] mb-1">
                {course?.instructor?.firstName || "Omowumi"} {course?.instructor?.lastName || "Sharon"}
              </h4>
              <p className="text-[13px] text-[#4e515c] mb-2">GLOXAD ACADEMY</p>
              <div className="flex items-center gap-2 text-[12px] text-[#717480]">
                <span>2 Courses</span>
                <span>•</span>
                <span>43,539 learners</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-6 shadow-sm flex flex-col items-start gap-3">
          <h3 className="text-[18px] font-bold text-[#202127]">Offered by</h3>
          <img src="/gloxadlogo.png" alt="Gloxad Academy" className="h-8 object-contain" />
          <h4 className="text-[15px] font-bold text-[#202127]">GLOXAD ACADEMY</h4>
          <button className="text-[14px] font-bold text-[#181C7B] mt-1 hover:underline">Learn more</button>
        </div>
      </div>
    </div>
  );
};

export default CourseModules;
