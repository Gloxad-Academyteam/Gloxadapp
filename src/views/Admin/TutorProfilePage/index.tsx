"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { FiMail, FiShield, FiSlash, FiBook, FiDollarSign, FiUsers } from "react-icons/fi";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";

const TutorProfilePage = () => {
  const { id } = useParams<{ id: string }>()!;
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin.tutor.profile", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/users/${id}`);
      return res.data.user;
    },
    enabled: !!id
  });

  if (isLoading) return <div className="p-10 text-center text-[#717480]">Loading tutor profile...</div>;
  if (isError || !data) return <div className="p-10 text-center text-red-500">Failed to load tutor profile.</div>;

  const tutor = data;
  const fullName = `${tutor.firstName} ${tutor.lastName}`;
  const status = tutor.approvalStatus || "pending";
  const courses: any[] = tutor.courses || [];
  const publishedCourses = courses.filter((c: any) => c.status === "published");
  const weeklyRevenue = tutor.weeklyRevenue || [
    { name: "Week 1", income: 0 },
    { name: "Week 2", income: 0 },
    { name: "Week 3", income: 0 },
    { name: "Week 4", income: 0 },
  ];

  return (
    <div className="w-full pb-20">
      {/* Header Profile Section */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8">
        <div className="flex gap-6 items-center">
          <div className="relative w-24 h-24">
            <div className="w-full h-full rounded-[16px] overflow-hidden bg-[#181C7B] flex items-center justify-center text-white text-[36px] font-bold shadow-sm">
              {tutor.avatarUrl
                ? <img src={tutor.avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                : tutor.firstName?.charAt(0)
              }
            </div>
            {status === "approved" && (
              <div className="absolute -bottom-2 -right-2 bg-[#181C7B] text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-4 mb-1 flex-wrap">
              <h1 className="text-[28px] font-bold text-[#202127]">{fullName}</h1>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider ${status === "approved" ? "bg-[#e6f7ef] text-[#048848]" : status === "rejected" ? "bg-[#ffe8e8] text-[#e02b2b]" : "bg-[#fff9e6] text-[#d48806]"}`}>
                {status.toUpperCase()} TUTOR
              </span>
            </div>
            <p className="text-[#3b82f6] text-[15px] font-medium">
              {tutor.areaOfExpertise || "Instructor"}
              {tutor.email && <span className="text-[#A0AEC0] font-normal mx-1">•</span>}
              <span className="text-[#717480] font-normal text-[14px]">{tutor.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-6 lg:mt-0">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] border border-[#cbd5e1] text-[#4e515c] hover:bg-[#f8fafc] transition-colors font-medium text-[14px]">
            <FiMail className="text-[18px]" /> Message Tutor
          </button>
          <button
            onClick={() => router.push(`/admin/tutors/verify/${id}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] border border-[#3b82f6] text-[#3b82f6] hover:bg-[#eff6ff] transition-colors font-medium text-[14px]"
          >
            <FiShield className="text-[18px]" /> Review Application
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-colors font-medium text-[14px]">
            <FiSlash className="text-[18px]" /> Suspend Account
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#eff6ff] rounded-[10px] flex items-center justify-center text-[#3b82f6]"><FiBook className="text-[22px]" /></div>
          <div>
            <p className="text-[12px] text-[#717480] font-medium">Total Courses</p>
            <p className="text-[24px] font-bold text-[#202127]">{courses.length}</p>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f0fdf4] rounded-[10px] flex items-center justify-center text-[#10b981]"><FiUsers className="text-[22px]" /></div>
          <div>
            <p className="text-[12px] text-[#717480] font-medium">Total Sales</p>
            <p className="text-[24px] font-bold text-[#202127]">{tutor.totalSales || 0}</p>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#fefce8] rounded-[10px] flex items-center justify-center text-[#d97706]"><FiDollarSign className="text-[22px]" /></div>
          <div>
            <p className="text-[12px] text-[#717480] font-medium">Total Revenue</p>
            <p className="text-[24px] font-bold text-[#202127]">&#8358;{(tutor.totalRevenue || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Main Column */}
        <div className="xl:col-span-2 space-y-6">

          {/* Biography */}
          {(tutor.teachingExperienceBio || tutor.areaOfExpertise) && (
            <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
              <h3 className="font-bold text-[18px] text-[#202127] mb-4">Tutor Biography</h3>
              <p className="text-[#4e515c] text-[14px] leading-relaxed">
                {tutor.teachingExperienceBio || `Tutor specializing in ${tutor.areaOfExpertise}.`}
              </p>
            </div>
          )}

          {/* Financial Performance Chart */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[18px] text-[#202127]">Revenue (Last 4 Weeks)</h3>
              <div className="flex items-center gap-4 text-[12px] text-[#717480] font-medium">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#181C7B]"></span>Income (₦)</div>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyRevenue} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={32}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#A0AEC0" }} dy={10} />
                  <Tooltip formatter={(val: any) => [`₦${Number(val).toLocaleString()}`, "Income"]} />
                  <Bar dataKey="income" fill="#181C7B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {tutor.totalRevenue === 0 && (
              <p className="text-center text-[13px] text-[#A0AEC0] mt-2">No sales recorded yet for this tutor.</p>
            )}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Courses Uploaded */}
            <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[16px] text-[#202127]">Courses Uploaded</h3>
                <span className="text-[12px] text-[#717480] font-medium">{courses.length} total</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#A0AEC0] mb-3 pb-2 border-b border-[#f1f5f9] uppercase tracking-wider">
                <span>Course</span>
                <span>Price</span>
              </div>
              {courses.length === 0 ? (
                <p className="text-[13px] text-[#A0AEC0] text-center py-4">No courses uploaded yet.</p>
              ) : (
                <div className="space-y-3">
                  {courses.slice(0, 5).map((c: any) => (
                    <div key={c._id} className="flex justify-between items-center text-[13px]">
                      <span className="text-[#4e515c] truncate pr-2 max-w-[180px]" title={c.title}>{c.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.status === "published" ? "bg-[#dcfce7] text-[#16a34a]" : c.status === "pending" ? "bg-[#fef9c3] text-[#ca8a04]" : "bg-[#fee2e2] text-[#dc2626]"}`}>
                          {c.status}
                        </span>
                        <span className="font-bold text-[#202127]">&#8358;{(c.price || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Courses Sold */}
            <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[16px] text-[#202127]">Courses Sold</h3>
                <span className="text-[12px] text-[#717480] font-medium">{tutor.totalSales || 0} total</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#A0AEC0] mb-3 pb-2 border-b border-[#f1f5f9] uppercase tracking-wider">
                <span>Course</span>
                <span>Sold</span>
              </div>
              {courses.filter((c: any) => c.sold > 0).length === 0 ? (
                <p className="text-[13px] text-[#A0AEC0] text-center py-4">No sales recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {courses.filter((c: any) => c.sold > 0).sort((a: any, b: any) => b.sold - a.sold).slice(0, 5).map((c: any) => (
                    <div key={c._id} className="flex justify-between items-center text-[13px]">
                      <span className="text-[#4e515c] truncate pr-2 max-w-[180px]" title={c.title}>{c.title}</span>
                      <span className="font-bold text-[#202127]">{c.sold}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Profile Details */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
            <h3 className="font-bold text-[18px] text-[#202127] mb-6">Profile Details</h3>
            <div className="space-y-4 text-[13px]">
              {[
                { label: "Full Name", value: fullName },
                { label: "Email", value: tutor.email },
                { label: "Country", value: tutor.country || "N/A" },
                { label: "Phone", value: tutor.phoneNumber || "N/A" },
                { label: "Expertise", value: tutor.areaOfExpertise || "N/A" },
                { label: "Joined", value: new Date(tutor.createdAt).toLocaleDateString() },
                { label: "Status", value: status },
              ].map(item => (
                <div key={item.label} className="flex justify-between pb-3 border-b border-[#f1f5f9] last:border-none">
                  <span className="text-[#717480]">{item.label}</span>
                  <span className="text-[#202127] font-medium text-right max-w-[160px] break-all">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
            <h3 className="font-bold text-[16px] text-[#202127] mb-6">Revenue Summary</h3>
            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between items-center p-3 bg-[#f8fafc] rounded-[8px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#181C7B]"></span>
                  <span className="text-[#717480]">Gross Revenue</span>
                </div>
                <span className="font-bold text-[#202127]">&#8358;{(tutor.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#f8fafc] rounded-[8px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                  <span className="text-[#717480]">Net (75%)</span>
                </div>
                <span className="font-bold text-[#202127]">&#8358;{Math.round((tutor.totalRevenue || 0) * 0.75).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#f8fafc] rounded-[8px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                  <span className="text-[#717480]">Platform Fee (25%)</span>
                </div>
                <span className="font-bold text-[#202127]">&#8358;{Math.round((tutor.totalRevenue || 0) * 0.25).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 shadow-sm">
            <h3 className="font-bold text-[16px] text-[#202127] mb-4">Documents</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px] py-2 border-b border-[#f1f5f9]">
                <span className="text-[#717480]">Certifications</span>
                <span className="font-bold text-[#202127]">{(tutor.certifications || []).length} uploaded</span>
              </div>
              <div className="flex justify-between text-[13px] py-2">
                <span className="text-[#717480]">Experience Proofs</span>
                <span className="font-bold text-[#202127]">{(tutor.experienceProofs || []).length} uploaded</span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/admin/tutors/verify/${id}`)}
              className="w-full mt-4 bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#181C7B] font-bold text-[13px] py-2.5 rounded-[8px] transition-colors"
            >
              Review Full Application →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfilePage;
