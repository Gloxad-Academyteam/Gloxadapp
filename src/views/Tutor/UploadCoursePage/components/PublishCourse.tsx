import React, { useState } from "react";
import { FaSearch, FaTimes, FaUserPlus } from "react-icons/fa";
import { searchInstructors } from "@services/tutor/courses";
import CoursePreviewModal from "./CoursePreviewModal";

export default function PublishCourse({ data, updateData, onPrev, onSubmit, isLoading, errors = {} }: any) {
  const [instructorSearch, setInstructorSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Use data.instructors (populated user objects) as initial state
  const [selectedInstructors, setSelectedInstructors] = useState<any[]>(data.instructors || []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInstructorSearch(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const res = await searchInstructors(val);
      setSearchResults(res.data?.instructors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const addInstructor = (instructor: any) => {
    // Check duplicate
    if (selectedInstructors.some((i) => i._id === instructor._id)) {
      setInstructorSearch("");
      setSearchResults([]);
      return;
    }

    const updatedList = [...selectedInstructors, instructor];
    setSelectedInstructors(updatedList);
    updateData({ instructors: updatedList.map((i) => i._id) });
    setInstructorSearch("");
    setSearchResults([]);
  };

  const removeInstructor = (id: string) => {
    const updatedList = selectedInstructors.filter((i) => i._id !== id);
    setSelectedInstructors(updatedList);
    updateData({ instructors: updatedList.map((i) => i._id) });
  };

  return (
    <div className="w-full">
      <h2 className="text-[20px] font-bold mb-6 text-[#202127]">Publish Curriculum</h2>
      
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 shadow-sm">
        
        <h3 className="text-[16px] font-bold text-[#202127] mb-4">Message</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-[13px] font-semibold text-[#717480] mb-2">Welcome Message</label>
            <textarea
              value={data.welcomeMessage}
              onChange={(e) => updateData({ welcomeMessage: e.target.value })}
              placeholder="Enter course starting message here..."
              className={`w-full h-[120px] p-4 border ${errors.welcomeMessage ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc] resize-none`}
            ></textarea>
            {errors.welcomeMessage && <p className="text-red-500 text-[12px] mt-1">{errors.welcomeMessage}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#717480] mb-2">Congratulations Message</label>
            <textarea
              value={data.congratsMessage}
              onChange={(e) => updateData({ congratsMessage: e.target.value })}
              placeholder="Enter your course completed message here..."
              className={`w-full h-[120px] p-4 border ${errors.congratsMessage ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc] resize-none`}
            ></textarea>
            {errors.congratsMessage && <p className="text-red-500 text-[12px] mt-1">{errors.congratsMessage}</p>}
          </div>
        </div>

        <h3 className="text-[16px] font-bold text-[#202127] mb-4">Add Instructor (02)</h3>
        
        <div className="mb-6 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbd5e1]" />
          <input 
            type="text" 
            placeholder="Search by name, username, or email..." 
            value={instructorSearch}
            onChange={handleSearchChange}
            className="w-full h-[48px] pl-10 pr-4 border border-[#e2e8f0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc]"
          />
          
          {/* Suggestions Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#e2e8f0] rounded-[12px] shadow-xl z-[999] overflow-hidden">
              <p className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider px-4 py-2 border-b border-[#f1f5f9] bg-[#f8fafc]">
                Search Matches
              </p>
              <div className="max-h-[240px] overflow-y-auto">
                {searchResults.map((instructor) => (
                  <div 
                    key={instructor._id} 
                    onClick={() => addInstructor(instructor)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[#f0f4ff] cursor-pointer transition-colors border-b border-[#f1f5f9] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={instructor.avatarUrl || "https://ui-avatars.com/api/?name=" + instructor.firstName} 
                        alt={instructor.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-[13px] font-bold text-[#202127]">
                          {instructor.firstName} {instructor.lastName}
                        </p>
                        <p className="text-[11px] text-[#717480]">
                          {instructor.title || instructor.email || "Instructor"}
                        </p>
                      </div>
                    </div>
                    <button className="text-[#3e92cc] hover:text-[#2b7bb5] p-2">
                      <FaUserPlus />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {instructorSearch && searchResults.length === 0 && !isSearching && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#e2e8f0] rounded-[8px] p-4 text-center shadow-lg text-[13px] text-[#717480] z-[999]">
              No instructors found matching "{instructorSearch}"
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {selectedInstructors.map(inst => (
            <div key={inst._id} className="flex items-center justify-between bg-[#fcfcfd] border border-[#e2e8f0] rounded-[8px] p-3 w-full sm:w-[280px]">
              <div className="flex items-center gap-3">
                <img 
                  src={inst.avatarUrl || "https://ui-avatars.com/api/?name=" + inst.firstName} 
                  alt={inst.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-[14px] font-bold text-[#202127] leading-tight">{inst.firstName} {inst.lastName}</p>
                  <p className="text-[12px] text-[#717480] truncate max-w-[150px]">{inst.title || inst.email || "Co-instructor"}</p>
                </div>
              </div>
              <button onClick={() => removeInstructor(inst._id)} className="text-[#cbd5e1] hover:text-[#e11d48]">
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-12 flex items-center justify-between">
        <button 
          onClick={onPrev}
          className="px-8 py-3 rounded-[8px] border border-[#e2e8f0] text-[14px] font-bold text-[#202127] hover:bg-[#f6f8fa] transition-colors"
        >
          Previous
        </button>
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="px-8 py-3 rounded-[8px] bg-[#07004d] text-[14px] font-bold text-white hover:bg-[#0a006e] transition-colors"
        >
          Preview & Submit
        </button>
      </div>

      <CoursePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        data={data} 
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
