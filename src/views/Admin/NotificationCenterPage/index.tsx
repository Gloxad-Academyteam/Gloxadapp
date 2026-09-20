"use client";

import React from "react";
import { FiCheck, FiEye, FiAlertTriangle, FiDollarSign } from "react-icons/fi";
import { HiOutlineExternalLink } from "react-icons/hi";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markNotificationsAsRead } from "@services/notifications";
import { useEffect } from "react";
import { useSocket } from "@hooks/useSocket";

const getIconForType = (type: string) => {
  switch (type) {
    case 'course_approved':
      return <div className="w-10 h-10 rounded-full bg-[#f0f4ff] text-[#3b82f6] flex items-center justify-center shrink-0"><FiCheck className="text-[18px]" /></div>;
    case 'course_rejected':
      return <div className="w-10 h-10 rounded-full bg-[#ffe8e8] text-[#e02b2b] flex items-center justify-center shrink-0"><FiAlertTriangle className="text-[18px]" /></div>;
    default:
      return <div className="w-10 h-10 rounded-full bg-[#fffbf0] text-[#d97706] flex items-center justify-center shrink-0"><FiEye className="text-[18px]" /></div>;
  }
};

const TABS = ["All Activities", "Pending Approvals", "System Alerts", "Financial Requests"];

const NotificationCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("All Activities");
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { data, isLoading } = useQuery({ 
    queryKey: ["notifications"], 
    queryFn: fetchNotifications 
  });
  const notifications = data?.data?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  useEffect(() => {
    if (!socket) return;
    
    socket.on("new_notification", (newNotif: any) => {
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData?.data?.notifications) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            notifications: [newNotif, ...oldData.data.notifications]
          }
        };
      });
    });

    return () => {
      socket.off("new_notification");
    };
  }, [socket, queryClient]);

  return (
    <div className="w-full pb-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#202127]">Notification Center</h1>
          <p className="text-[14px] text-[#717480] mt-1">Stay updated with tutor activities, course changes, and financial updates.</p>
        </div>
        <button 
          onClick={() => markAsRead()}
          className="bg-white border border-[#e2e8f0] text-[#4e515c] font-bold text-[13px] px-4 py-2.5 rounded-[8px] flex items-center gap-2 hover:border-[#3b82f6] transition-colors"
        >
          <FiCheck /> Mark all as read
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Main Content - Notification List */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-[#e2e8f0] mb-6">
            {TABS.map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[13px] font-bold transition-colors relative ${
                    isActive ? "text-[#181C7B]" : "text-[#A0AEC0] hover:text-[#4e515c]"
                  }`}
                >
                  {tab}
                  {isActive && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#181C7B] rounded-t-[4px]"></div>}
                </button>
              );
            })}
          </div>

          {/* Notification Cards */}
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-[#717480] text-[14px] text-center py-8">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-[#717480] text-[14px] text-center py-8">No notifications to display.</p>
            ) : notifications.map((n: any) => (
              <div key={n._id} className={`bg-white border ${n.isRead ? 'border-[#e2e8f0]' : 'border-[#3b82f6] bg-[#f0f4ff]/30'} rounded-[12px] p-5 hover:border-[#cbd5e1] transition-colors`}>
                <div className="flex items-start gap-4">
                  {getIconForType(n.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-[14px] font-bold text-[#202127] pr-4">{n.title}</h3>
                      <span className="text-[11px] text-[#A0AEC0] shrink-0 font-medium">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[13px] text-[#717480] leading-relaxed mb-4">{n.message}</p>
                    {n.actionUrl && (
                      <div className="flex items-center gap-3">
                        <button onClick={() => window.location.href = n.actionUrl} className="bg-white border border-[#e2e8f0] text-[#202127] font-bold text-[12px] px-4 py-2 rounded-[6px] hover:bg-[#f8fafc] transition-colors">View Details</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="text-[#181C7B] font-bold text-[13px] hover:underline flex items-center gap-1 mx-auto">
              Load older notifications ↓
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-[280px] space-y-6 shrink-0">
          
          {/* Notification Insights */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6">
            <h3 className="text-[14px] font-bold text-[#202127] mb-4">Notification Insights</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#f8fafc] rounded-[8px] p-4 text-center">
                <p className="text-[8px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Unread</p>
                <p className="text-[28px] font-bold text-[#181C7B]">{unreadCount}</p>
              </div>
              <div className="bg-[#f8fafc] rounded-[8px] p-4 text-center">
                <p className="text-[8px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-1">Total</p>
                <p className="text-[28px] font-bold text-[#e02b2b]">{notifications.length}</p>
              </div>
            </div>

            <h4 className="text-[12px] font-bold text-[#202127] mb-3">Priority Distribution</h4>
            {/* Priority bar */}
            <div className="flex h-2 rounded-full overflow-hidden mb-4">
              <div className="bg-[#e02b2b]" style={{ width: '15%' }}></div>
              <div className="bg-[#d97706]" style={{ width: '35%' }}></div>
              <div className="bg-[#3b82f6]" style={{ width: '50%' }}></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#e02b2b]"></span><span className="text-[#4e515c]">High Priority</span></div>
                <span className="text-[#A0AEC0] font-bold">15%</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#d97706]"></span><span className="text-[#4e515c]">Medium Priority</span></div>
                <span className="text-[#A0AEC0] font-bold">35%</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span><span className="text-[#4e515c]">Low Priority</span></div>
                <span className="text-[#A0AEC0] font-bold">50%</span>
              </div>
            </div>
          </div>

          {/* Activity Trend */}
          <div className="bg-[#1e293b] rounded-[12px] p-6 text-white relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold">Activity Trend</h3>
              <HiOutlineExternalLink className="text-[16px] text-[#94a3b8] cursor-pointer" />
            </div>
            {/* Simple SVG line chart */}
            <svg viewBox="0 0 200 60" className="w-full h-[80px] mb-4">
              <polyline fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                points="0,40 20,35 40,30 60,38 80,25 100,32 120,20 140,28 160,15 180,22 200,18" />
              <polyline fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4,4"
                points="0,30 200,30" />
            </svg>
            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              Notifications are up 12% compared to last week, primarily due to increased tutor registrations.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#ffe8e8] border border-[#fca5a5] rounded-[12px] p-6">
            <h3 className="text-[11px] font-bold text-[#e02b2b] uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between bg-white border border-[#e2e8f0] rounded-[8px] px-4 py-3 text-[13px] font-bold text-[#202127] hover:border-[#3b82f6] transition-colors">
                Manage Tutors <span className="text-[#A0AEC0]">›</span>
              </button>
              <button className="w-full flex items-center justify-between bg-white border border-[#e2e8f0] rounded-[8px] px-4 py-3 text-[13px] font-bold text-[#202127] hover:border-[#3b82f6] transition-colors">
                Financial Reports <span className="text-[#A0AEC0]">›</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotificationCenterPage;
