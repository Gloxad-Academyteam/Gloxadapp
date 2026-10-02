"use client";

import React, { useState } from "react";
import { FiTrash2, FiChevronLeft, FiChevronRight, FiSend, FiLink, FiImage, FiSmile, FiList } from "react-icons/fi";
import { AiOutlineUndo, AiOutlineRedo } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import { sendBroadcast } from "@services/admin/users";

const StudentsManagementPage = () => {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["admin.students"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/users?role=student");
      return res.data.users;
    }
  });

  const { data: recentTxData } = useQuery({
    queryKey: ["admin.recent-transactions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/recent-transactions?limit=5");
      return res.data.transactions || [];
    }
  });

  const broadcastMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await sendBroadcast({ targetRole: "student", title: "Announcement", message });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Broadcast sent to all students!");
      setBroadcastMessage("");
    },
    onError: () => toast.error("Failed to send broadcast")
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await axiosInstance.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast.success("Student deleted");
      queryClient.invalidateQueries({ queryKey: ["admin.students"] });
    },
    onError: () => toast.error("Failed to delete student")
  });

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return toast.error("Please enter a message");
    broadcastMutation.mutate(broadcastMessage);
  };

  const getInitials = (first: string, last: string) => {
    return `${(first || "").charAt(0)}${(last || "").charAt(0)}`.toUpperCase();
  };

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#181C7B] mb-1">Students Management</h1>
          <p className="text-[#717480] text-[14px]">Manage and monitor student enrollments and activities.</p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0 border border-[#e2e8f0] rounded-[8px] px-3 py-1.5 bg-white text-[13px] text-[#4e515c]">
          <span>{students.length > 0 ? "1" : "0"}-{students.length < 10 ? `0${students.length}` : students.length} of {students.length}</span>
          <div className="flex items-center gap-2 border-l border-[#e2e8f0] pl-3 ml-1">
            <button className="hover:text-[#202127]"><FiChevronLeft /></button>
            <button className="hover:text-[#202127]"><FiChevronRight /></button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] shadow-sm mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#fafafa]">
                <th className="py-4 font-bold text-[13px] text-[#717480] px-6">Name</th>
                <th className="py-4 font-bold text-[13px] text-[#717480] px-6">Email</th>
                <th className="py-4 font-bold text-[13px] text-[#717480] px-6">Phone number</th>
                <th className="py-4 font-bold text-[13px] text-[#717480] px-6">Enrolled Courses</th>
                <th className="py-4 font-bold text-[13px] text-[#717480] px-6">Location</th>
                <th className="py-4 font-bold text-[13px] text-[#717480] px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-10 text-center text-[#717480]">Loading students...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-[#717480]">No students found.</td></tr>
              ) : (
                students.map((student: any) => (
                  <tr key={student._id} className="border-b border-[#f0f4f8] last:border-none hover:bg-[#f8fafc] transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] uppercase bg-[#e2e8f0] text-[#202127]">
                          {getInitials(student.firstName, student.lastName)}
                        </div>
                        <span className="font-bold text-[#202127] text-[14px]">
                          {student.firstName}<br/>{student.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-[#4e515c] text-[13px]">
                      {student.email}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-[#4e515c] text-[13px]">
                      {student.phoneNumber || "N/A"}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-[#4e515c] text-[13px] font-medium">
                      {student.enrolledCoursesCount || 0} Courses
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-[#4e515c] text-[13px]">
                      {student.country || "N/A"}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <button className="border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#202127] font-medium text-[12px] px-4 py-1.5 rounded-[6px] transition-colors">
                          View<br/>more
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${student.firstName} ${student.lastName}? This cannot be undone.`)) {
                              deleteMutation.mutate(student._id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-[#e02b2b] hover:text-[#b91c1c] transition-colors disabled:opacity-40"
                        >
                          <FiTrash2 className="text-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Transactions (real data) */}
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[18px] text-[#181C7B]">Recent Course Purchases</h3>
            <span className="bg-[#dcfce7] text-[#16a34a] px-3 py-1 rounded-[4px] text-[11px] font-bold">Live</span>
          </div>
          <div className="space-y-4">
            {!recentTxData || recentTxData.length === 0 ? (
              <p className="text-[#A0AEC0] text-[13px] text-center py-6">No transactions yet.</p>
            ) : recentTxData.map((tx: any) => (
              <div key={tx._id} className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-[8px]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#f0f4f8] rounded-[8px] overflow-hidden">
                    {tx.course?.thumbnailUrl
                      ? <img src={tx.course.thumbnailUrl} alt={tx.course.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-[#181C7B] font-bold text-[16px]">C</div>
                    }
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#202127] mb-0.5 line-clamp-1">{tx.course?.title || "Unknown Course"}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#e2e8f0] overflow-hidden">
                        {tx.student?.avatarUrl
                          ? <img src={tx.student.avatarUrl} alt="" className="w-full h-full object-cover" />
                          : <span className="text-[9px] font-bold text-[#202127] flex items-center justify-center h-full">{tx.student?.firstName?.charAt(0)}</span>
                        }
                      </div>
                      <span className="text-[11px] text-[#717480]">{tx.student?.firstName} {tx.student?.lastName}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[16px] text-[#181C7B]">&#8358;{(tx.amount || 0).toLocaleString()}</p>
                  <p className="text-[11px] text-[#717480]">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Send Message Area */}
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[18px] text-[#181C7B]">Send Message to all Students</h3>
            <span className="bg-[#475569] text-white px-3 py-1 rounded-[4px] text-[11px] font-bold tracking-wider">Broadcast</span>
          </div>

          <div className="flex-1 border border-[#e2e8f0] rounded-[8px] overflow-hidden flex flex-col mb-4 bg-[#f8fafc]">
            {/* Toolbar */}
            <div className="flex items-center gap-4 p-3 border-b border-[#e2e8f0] bg-[#fafafa] text-[#4e515c] text-[14px]">
              <div className="flex items-center gap-2">
                <button className="hover:text-[#202127]"><AiOutlineUndo /></button>
                <button className="hover:text-[#202127]"><AiOutlineRedo /></button>
              </div>
              <div className="w-px h-4 bg-[#cbd5e1]"></div>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-[13px]">Fonts</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="w-px h-4 bg-[#cbd5e1]"></div>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-[13px]">12</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="w-px h-4 bg-[#cbd5e1]"></div>
              <div className="flex items-center gap-3 font-serif">
                <button className="font-bold hover:text-[#202127]">B</button>
                <button className="italic hover:text-[#202127]">I</button>
                <button className="underline hover:text-[#202127]">U</button>
              </div>
            </div>
            {/* Toolbar second row */}
            <div className="flex items-center gap-4 p-3 border-b border-[#e2e8f0] bg-[#fafafa] text-[#4e515c] text-[14px]">
               <button className="hover:text-[#202127]"><FiList /></button>
               <button className="hover:text-[#202127]"><FiLink /></button>
               <button className="hover:text-[#202127]"><FiImage /></button>
               <button className="hover:text-[#202127]"><FiSmile /></button>
            </div>

            {/* Text Area */}
            <textarea 
              className="flex-1 w-full bg-white p-4 outline-none text-[14px] text-[#202127] placeholder-[#A0AEC0] resize-none"
              placeholder="Type your message to all students here..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            ></textarea>
          </div>

          <button 
            onClick={handleSendBroadcast}
            disabled={broadcastMutation.isPending}
            className="w-full bg-[#0b0f59] text-white hover:bg-[#070a3d] transition-colors py-3.5 rounded-[8px] font-medium text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiSend />
            {broadcastMutation.isPending ? "Sending..." : "Send Notification"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentsManagementPage;
