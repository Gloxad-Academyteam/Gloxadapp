"use client";

import React, { useState } from "react";

const AdminSettingsPage: React.FC = () => {
  const [allowCreateAccount, setAllowCreateAccount] = useState(true);
  const [allowResetPassword, setAllowResetPassword] = useState(true);
  const [graceDays, setGraceDays] = useState("50");

  return (
    <div className="w-full max-w-[800px] pb-10">
      
      <h1 className="text-[28px] font-bold text-[#202127] mb-8">Admin Settings</h1>

      {/* Account Restriction */}
      <div className="mb-10">
        <h2 className="text-[18px] font-bold text-[#202127] mb-6">Account restriction</h2>

        {/* Allow creating new account */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-bold text-[#202127] mb-1">Allow creating new account</h3>
            <p className="text-[13px] text-[#717480]">By default, any user visiting GLOXAD can create account</p>
          </div>
          <button
            onClick={() => setAllowCreateAccount(!allowCreateAccount)}
            className={`w-[44px] h-[24px] rounded-full relative transition-colors shrink-0 ${
              allowCreateAccount ? "bg-[#181C7B]" : "bg-[#cbd5e1]"
            }`}
          >
            <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${
              allowCreateAccount ? "right-[3px]" : "left-[3px]"
            }`}></div>
          </button>
          <span className={`ml-3 text-[13px] font-bold ${allowCreateAccount ? "text-[#181C7B]" : "text-[#A0AEC0]"}`}>
            {allowCreateAccount ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* Allow resetting password */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#202127] mb-1">Allow resetting password</h3>
            <p className="text-[13px] text-[#717480]">Allow user to reset their password</p>
          </div>
          <button
            onClick={() => setAllowResetPassword(!allowResetPassword)}
            className={`w-[44px] h-[24px] rounded-full relative transition-colors shrink-0 ${
              allowResetPassword ? "bg-[#181C7B]" : "bg-[#cbd5e1]"
            }`}
          >
            <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${
              allowResetPassword ? "right-[3px]" : "left-[3px]"
            }`}></div>
          </button>
          <span className={`ml-3 text-[13px] font-bold ${allowResetPassword ? "text-[#181C7B]" : "text-[#A0AEC0]"}`}>
            {allowResetPassword ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>



      {/* Divider */}
      <div className="border-t border-[#e2e8f0] mb-10"></div>

      {/* Admin Signature for Certificates */}
      <div className="mb-10">
        <h2 className="text-[18px] font-bold text-[#202127] mb-6">Certificate Signature</h2>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#202127] mb-1">Upload Admin Signature</h3>
            <p className="text-[13px] text-[#717480] max-w-[500px]">
              This signature will appear on all automatically generated student certificates. Please upload a clear PNG with a transparent background.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-[120px] h-[60px] border border-dashed border-[#cbd5e1] rounded-[8px] flex items-center justify-center bg-[#f8fafc]">
              <span className="text-[11px] text-[#A0AEC0] font-bold">No signature</span>
            </div>
            <button className="px-4 h-[36px] bg-[#181C7B] text-white rounded-[6px] text-[13px] font-bold hover:bg-[#0f1255] transition-colors">
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e2e8f0] mb-10"></div>

      {/* Account Deletion */}
      <div>
        <h2 className="text-[18px] font-bold text-[#202127] mb-6">Account Deletion</h2>

        <div className="mb-4">
          <h3 className="text-[15px] font-bold text-[#202127] mb-3">Grace Delay</h3>
          <div className="flex items-center justify-between gap-6">
            <p className="text-[13px] text-[#717480] leading-relaxed max-w-[500px]">
              This is the numbers of days without a login after which an account schedule for deletion is permanently deleted
            </p>
            <input
              type="number"
              value={graceDays}
              onChange={(e) => setGraceDays(e.target.value)}
              className="w-[80px] bg-white border border-[#e2e8f0] rounded-[8px] px-4 py-2.5 text-[14px] text-[#202127] font-medium outline-none focus:border-[#181C7B] text-center"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminSettingsPage;
