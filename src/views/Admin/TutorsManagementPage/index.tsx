"use client";

import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { AiOutlineWarning } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "pending":
      return <span className="bg-[#fff9e6] text-[#d48806] px-3 py-1 rounded-full text-[12px] font-bold">PENDING</span>;
    case "approved":
      return <span className="bg-[#e6f7ef] text-[#048848] px-3 py-1 rounded-full text-[12px] font-bold">APPROVED</span>;
    case "rejected":
      return <span className="bg-[#ffe8e8] text-[#e02b2b] px-3 py-1 rounded-full text-[12px] font-bold">REJECTED</span>;
    default:
      return <span className="bg-[#e2e8f0] text-[#4e515c] px-3 py-1 rounded-full text-[12px] font-bold uppercase">{status}</span>;
  }
};

const TutorsManagementPage = () => {
  const [activeTab, setActiveTab] = useState("All Tutors");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["admin.tutors"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/users?role=instructor");
      return res.data.users;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await axiosInstance.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast.success("Tutor removed");
      queryClient.invalidateQueries({ queryKey: ["admin.tutors"] });
    },
    onError: () => toast.error("Failed to remove tutor")
  });

  // Dynamically filter tutors based on the active tab
  const filteredTutors = tutors.filter((tutor: any) => {
    const status = tutor.approvalStatus || "pending";
    if (activeTab === "All Tutors") return true;
    if (activeTab === "Pending") return status === "pending";
    if (activeTab === "Approved") return status === "approved";
    if (activeTab === "Rejected") return status === "rejected";
    return true;
  });

  const pendingCount = tutors.filter((t: any) => (t.approvalStatus || "pending") === "pending").length;
  const approvedCount = tutors.filter((t: any) => (t.approvalStatus || "pending") === "approved").length;

  return (
    <div className="w-full pb-10">
      
      {/* Top Pending Approvals Banner */}
      {pendingCount > 0 && (
        <div className="bg-[#fffbf0] border border-[#f5c370] rounded-[12px] p-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f59e0b] rounded-[8px] flex items-center justify-center text-white">
              <AiOutlineWarning className="text-[24px]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#8a4e00]">{pendingCount} Pending Approvals</h3>
              <p className="text-[14px] text-[#8a4e00] opacity-80">Review tutor credentials to maintain platform quality.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("Pending")}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-white px-6 py-2 rounded-[8px] font-bold text-[14px] transition-colors"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
        <h2 className="text-[22px] font-bold text-[#202127] mb-6">Tutors List</h2>

        {/* Tabs */}
        <div className="bg-[#f8fafc] p-2 rounded-[12px] inline-flex items-center gap-2 mb-6 border border-[#e2e8f0]">
          <button 
            onClick={() => setActiveTab("All Tutors")}
            className={`px-6 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${activeTab === "All Tutors" ? "bg-white shadow-sm text-[#202127] font-bold" : "text-[#717480] hover:text-[#202127]"}`}
          >
            All Tutors
          </button>
          
          <button 
            onClick={() => setActiveTab("Pending")}
            className={`px-6 py-2 rounded-[8px] text-[14px] font-medium transition-colors flex items-center gap-2 ${activeTab === "Pending" ? "bg-white shadow-sm text-[#181C7B] font-bold" : "text-[#717480] hover:text-[#202127]"}`}
          >
            <span>Pending</span>
            {pendingCount > 0 && <span className="bg-[#f59e0b] text-white text-[11px] font-bold px-2 py-[2px] rounded-full">{pendingCount}</span>}
          </button>

          <button 
            onClick={() => setActiveTab("Approved")}
            className={`px-6 py-2 rounded-[8px] text-[14px] font-medium transition-colors flex items-center gap-2 ${activeTab === "Approved" ? "bg-white shadow-sm text-[#181C7B] font-bold" : "text-[#717480] hover:text-[#202127]"}`}
          >
            <span>Approved</span>
            {approvedCount > 0 && <span className="bg-[#10b981] text-white text-[11px] font-bold px-2 py-[2px] rounded-full">{approvedCount}</span>}
          </button>

          <button 
            onClick={() => setActiveTab("Rejected")}
            className={`px-6 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${activeTab === "Rejected" ? "bg-white shadow-sm text-[#202127] font-bold" : "text-[#717480] hover:text-[#202127]"}`}
          >
            Rejected
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="pb-4 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider px-4">Name</th>
                <th className="pb-4 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider px-4">Status</th>
                <th className="pb-4 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider px-4">Reg. Date</th>
                <th className="pb-4 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider px-4">Title</th>
                <th className="pb-4 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider px-4">Location</th>
                <th className="pb-4 font-bold text-[12px] text-[#A0AEC0] uppercase tracking-wider px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#717480]">
                    Loading tutors...
                  </td>
                </tr>
              ) : filteredTutors.map((tutor: any) => {
                const title = tutor.headline || "Tutor";
                return (
                  <tr key={tutor._id} className="border-b border-[#f0f4f8] last:border-none hover:bg-[#f8fafc] transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {tutor.profileImage ? (
                          <img src={tutor.profileImage} alt={tutor.firstName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#e2e8f0] flex items-center justify-center font-bold text-[#202127]">
                            {(tutor.firstName?.charAt(0) || "") + (tutor.lastName?.charAt(0) || "")}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#202127] text-[14px]">{tutor.firstName} {tutor.lastName}</p>
                          <p className="text-[#A0AEC0] text-[13px]">{tutor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={tutor.approvalStatus || "pending"} />
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-[#717480] text-[13px]">
                      {new Date(tutor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-[#717480] text-[13px]">
                      {title.length > 25 ? `${title.substring(0, 25)}...` : title}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-[#717480] text-[13px]">
                      {tutor.country || "N/A"}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => {
                            if ((tutor.instructorStatus || "pending") === "pending") {
                              router.push(`/admin/tutors/verify/${tutor._id}`);
                            } else {
                              router.push(`/admin/tutors/${tutor._id}`);
                            }
                          }}
                          className="bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#181C7B] font-bold text-[12px] px-4 py-2 rounded-full transition-colors"
                        >
                          View details
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Remove ${tutor.firstName} ${tutor.lastName} as tutor? This cannot be undone.`)) {
                              deleteMutation.mutate(tutor._id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-[#A0AEC0] hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          <FiTrash2 className="text-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filteredTutors.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#717480]">
                    No tutors found for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default TutorsManagementPage;
