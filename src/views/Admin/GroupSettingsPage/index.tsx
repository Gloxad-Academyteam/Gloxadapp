import React from "react";
import { FiSearch, FiArchive, FiFlag, FiLink, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { BsFileEarmarkPdf, BsFileEarmarkWord } from "react-icons/bs";
import { BiLinkExternal } from "react-icons/bi";

const GroupSettingsPage = () => {
  return (
    <div className="w-full pb-10">
      
      <div className="mb-8">
        <p className="text-[#181C7B] text-[11px] font-bold uppercase tracking-wider mb-1">Academic Portal</p>
        <h1 className="text-[32px] font-bold text-[#202127]">Group Settings</h1>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Main Content Column */}
        <div className="flex-1 space-y-8">
          
          {/* General Info */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 rounded-full border-2 border-[#181C7B] flex items-center justify-center text-[#181C7B] font-bold text-[12px]">i</div>
              <h2 className="text-[18px] font-bold text-[#202127]">General Info</h2>
            </div>

            <div className="mb-5">
              <label className="block text-[#181C7B] text-[11px] font-bold uppercase tracking-wider mb-2">Group Name</label>
              <input 
                type="text" 
                defaultValue="Advanced Curatorial Practice A-204"
                className="w-full bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] focus:border-[#3b82f6] focus:bg-white rounded-[8px] px-4 py-3 text-[14px] text-[#202127] outline-none transition-colors font-medium"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#181C7B] text-[11px] font-bold uppercase tracking-wider mb-2">Description</label>
              <textarea 
                defaultValue="Focusing on post-structuralist frameworks in contemporary gallery management. This group serves as the primary collaboration hub for the final exhibition project."
                className="w-full h-[100px] bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] focus:border-[#3b82f6] focus:bg-white rounded-[8px] px-4 py-3 text-[14px] text-[#4e515c] outline-none transition-colors resize-none leading-relaxed"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button className="bg-[#020617] hover:bg-[#1e293b] text-white font-bold text-[14px] px-6 py-2.5 rounded-[8px] transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white rounded-[12px] p-8 pt-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#181C7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <h2 className="text-[18px] font-bold text-[#202127]">Participants</h2>
              </div>
              <button className="text-[#181C7B] font-bold text-[13px] hover:underline flex items-center gap-1">
                + Add Members
              </button>
            </div>

            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input 
                type="text" 
                placeholder="Search by name or role..." 
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] pl-10 pr-4 py-3 text-[13px] outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="space-y-1">
              {[
                { name: "Dr. Helena Vance", role: "Lead Faculty", tag: "OWNER", tagColor: "bg-[#fff5f5] text-[#e02b2b]" },
                { name: "Marcus Sterling", role: "Graduate Student", tag: "MODERATOR", tagColor: "bg-[#f0f4ff] text-[#3b82f6]" },
                { name: "Julian Rossi", role: "Graduate Student", tag: "MEMBER", tagColor: "bg-[#f8fafc] text-[#717480]" },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[8px] hover:bg-[#f8fafc] transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={`https://i.pravatar.cc/150?u=${user.name}`} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                    <div>
                      <h4 className="text-[14px] font-bold text-[#202127]">{user.name}</h4>
                      <p className="text-[12px] text-[#717480]">{user.role}</p>
                    </div>
                  </div>
                  <span className={`${user.tagColor} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                    {user.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Resources */}
          <div className="bg-white rounded-[12px] p-8 pt-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold text-[#202127]">Shared Resources</h2>
              <div className="flex items-center gap-2 text-[#A0AEC0]">
                <button className="w-8 h-8 rounded-[6px] bg-[#f0f4ff] text-[#3b82f6] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </button>
                <button className="w-8 h-8 rounded-[6px] hover:bg-[#f8fafc] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* PDF Card */}
              <div className="border border-[#e2e8f0] rounded-[12px] p-5 hover:border-[#3b82f6] transition-colors cursor-pointer flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-[8px] bg-[#fff5f5] text-[#e02b2b] flex items-center justify-center mb-4">
                    <BsFileEarmarkPdf className="text-[20px]" />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#202127] leading-tight mb-2">Curatorial_Theory_Vol1.pdf</h4>
                </div>
                <p className="text-[9px] font-bold text-[#A0AEC0] uppercase tracking-wider">PDF • 4.2 MB • 2 DAYS AGO</p>
              </div>

              {/* DOCX Card */}
              <div className="border border-[#e2e8f0] rounded-[12px] p-5 hover:border-[#3b82f6] transition-colors cursor-pointer flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-[8px] bg-[#f0f4ff] text-[#3b82f6] flex items-center justify-center mb-4">
                    <BsFileEarmarkWord className="text-[20px]" />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#202127] leading-tight mb-2">Exhibition_Plan_Draft.docx</h4>
                </div>
                <p className="text-[9px] font-bold text-[#A0AEC0] uppercase tracking-wider">DOCX • 1.1 MB • 5 HOURS AGO</p>
              </div>

              {/* Link Card */}
              <div className="border border-[#e2e8f0] rounded-[12px] p-5 hover:border-[#3b82f6] transition-colors cursor-pointer flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-[8px] bg-[#fffbf0] text-[#d97706] flex items-center justify-center mb-4">
                    <BiLinkExternal className="text-[20px]" />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#202127] leading-tight mb-2">Gallery_3D_Virtual_Tour</h4>
                </div>
                <p className="text-[9px] font-bold text-[#A0AEC0] uppercase tracking-wider">EXTERNAL LINK • YESTERDAY</p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#cbd5e1] rounded-[12px] p-5 hover:border-[#3b82f6] hover:bg-[#f8fafc] transition-colors cursor-pointer flex flex-col items-center justify-center text-center h-[160px]">
                <FiUploadCloud className="text-[24px] text-[#A0AEC0] mb-2" />
                <h4 className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Drop New File</h4>
              </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-[320px] space-y-6">
          
          {/* Notification Settings */}
          <div className="bg-[#020617] rounded-[12px] p-6 text-white shadow-xl">
            <h3 className="text-[16px] font-bold mb-6">Notification Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#cbd5e1]">Email digests</span>
                <div className="w-10 h-6 bg-[#3b82f6] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#cbd5e1]">Browser push</span>
                <div className="w-10 h-6 bg-[#334155] rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#cbd5e1]">New member alerts</span>
                <div className="w-10 h-6 bg-[#3b82f6] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Background design element from the image */}
            <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] p-6">
            <h3 className="text-[11px] font-bold text-[#181C7B] uppercase tracking-wider mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#3b82f6] hover:shadow-sm transition-all group">
                <FiArchive className="text-[18px] text-[#181C7B] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#202127]">Archive</span>
              </button>
              <button className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#3b82f6] hover:shadow-sm transition-all group">
                <FiFlag className="text-[18px] text-[#181C7B] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#202127]">Report</span>
              </button>
              <button className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#3b82f6] hover:shadow-sm transition-all group">
                <FiLink className="text-[18px] text-[#181C7B] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#202127]">Group Link</span>
              </button>
              <button className="bg-[#fff5f5] border border-transparent rounded-[8px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#e02b2b] transition-all group">
                <FiTrash2 className="text-[18px] text-[#e02b2b] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#e02b2b]">Delete</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupSettingsPage;
