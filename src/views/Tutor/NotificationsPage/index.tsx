"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheck, FaExclamation, FaTimes, FaBook, FaUserPlus, FaStar, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import axiosInstance from "@utils/axiosInstance";
import { toast } from "react-toastify";
const formatDistanceToNow = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      toast.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.post("/notifications/mark-read");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'course_approved':
        return <div className="w-12 h-12 rounded-full bg-[#e6f7ff] text-[#3e92cc] flex items-center justify-center shrink-0"><FaCheck className="text-[16px]" /></div>;
      case 'course_rejected':
        return <div className="w-12 h-12 rounded-full bg-[#fff1f2] text-[#e11d48] flex items-center justify-center shrink-0"><FaExclamation className="text-[16px]" /></div>;
      case 'new_enrollment':
        return <div className="w-12 h-12 rounded-full bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center shrink-0"><FaUserPlus className="text-[16px]" /></div>;
      case 'new_review':
        return <div className="w-12 h-12 rounded-full bg-[#fef9c3] text-[#ca8a04] flex items-center justify-center shrink-0"><FaStar className="text-[16px]" /></div>;
      case 'system_alert':
      default:
        return <div className="w-12 h-12 rounded-full bg-[#f1f5f9] text-[#64748b] flex items-center justify-center shrink-0"><FaInfoCircle className="text-[16px]" /></div>;
    }
  };

  return (
    <div className="w-full h-full bg-[#fcfcfd] p-4 sm:p-6 lg:p-10 text-[#202127] overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#07004d] mb-1">Notifications</h1>
          <p className="text-[14px] text-[#717480]">Stay updated with your courses, students, and platform activities.</p>
        </div>
        <button onClick={markAllAsRead} className="flex items-center gap-2 text-[#07004d] text-[13px] font-bold hover:underline">
          <FaCheck className="text-[10px]" /> Mark all as read
        </button>
      </div>

      {/* Notifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <p className="text-[#717480]">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-[#717480]">You have no notifications right now.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className={`bg-white rounded-[16px] border ${notification.isRead ? 'border-[#e2e8f0]' : 'border-[#3e92cc]'} p-6 shadow-sm flex gap-4`}>
              {getIconForType(notification.type)}
              <div className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-[16px] font-bold ${notification.isRead ? 'text-[#202127]' : 'text-[#07004d]'}`}>{notification.title}</h3>
                  <span className="text-[12px] text-[#717480]">{formatDistanceToNow(notification.createdAt)}</span>
                </div>
                <p className="text-[14px] text-[#202127] mb-6 leading-relaxed">
                  {notification.message}
                </p>
                {notification.actionUrl && (
                  <Link href={notification.actionUrl} className="inline-flex items-center gap-2 text-[#07004d] text-[13px] font-bold hover:underline">
                    View Details <FaArrowRight className="text-[10px]" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
