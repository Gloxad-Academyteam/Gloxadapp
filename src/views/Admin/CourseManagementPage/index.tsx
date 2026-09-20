"use client";

import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import CategoryCard, { Category } from "./CategoryCard";
import CreateCategoryModal from "./CreateCategoryModal";
import SubCategoryModal from "./SubCategoryModal";
import CourseTable, { Course } from "./CourseTable";
import { getAllAdminCourses } from "@services/admin/courses";

import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

const TABS = ["Categories", "All Courses", "Pending Approval", "Approved", "Rejected"];

const CourseManagementPage = () => {
  const [activeTab, setActiveTab] = useState("Pending Approval");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<any | null>(null);

  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ["admin.categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories");
      return res.data.map((c: any) => ({
        id: c._id,
        name: c.name,
        subCategories: c.subCategories?.map((sub: string, i: number) => ({ id: i, name: sub })) || [],
        courseCount: c.courseCount || 0
      }));
    }
  });

  const { data: allCourses = [] } = useQuery({
    queryKey: ["admin.courses.all"],
    queryFn: async () => {
      const res = await getAllAdminCourses();
      if (!res.data?.courses) return [];
      
      return res.data.courses.map((c: any) => ({
        id: c._id,
        title: c.title,
        tutorName: c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : "Unknown",
        tutorAvatar: c.instructor?.avatarUrl || "https://ui-avatars.com/api/?name=Instructor&background=181C7B&color=fff",
        category: c.category?.name || "Uncategorized",
        dateSubmitted: new Date(c.createdAt).toLocaleDateString(),
        dateRejected: c.status === "rejected" ? new Date(c.updatedAt).toLocaleDateString() : undefined,
        status: c.status === "pending" ? "PENDING" : c.status === "published" ? "APPROVED" : "REJECTED"
      }));
    }
  });

  const handleCreateCategory = async (name: string, subCategory: string) => {
    try {
      await axiosInstance.post("/admin/categories", {
        name,
        subCategories: subCategory ? [subCategory] : []
      });
      toast.success("Category created!");
      refetchCategories();
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (category: any) => {
    if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
      try {
        await axiosInstance.delete(`/admin/categories/${category.id}`);
        toast.success("Category deleted!");
        refetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const pendingCount = allCourses.filter((c: any) => c.status === "PENDING").length;
  const rejectedCount = allCourses.filter((c: any) => c.status === "REJECTED").length;

  const filteredCourses = allCourses.filter((course: any) => {
    if (activeTab === "All Courses") return true;
    if (activeTab === "Pending Approval") return course.status === "PENDING";
    if (activeTab === "Approved") return course.status === "APPROVED";
    if (activeTab === "Rejected") return course.status === "REJECTED";
    return false;
  });

  return (
    <div className="w-full pb-10">
      
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#202127]">Course Management</h1>
          <p className="text-[14px] text-[#717480] mt-1">Review, approve, and manage the curriculum catalog.</p>
        </div>
        
        {activeTab === "Categories" ? (
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input 
                type="text" 
                placeholder="Search category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] pl-10 pr-4 py-2 text-[14px] outline-none focus:border-[#3b82f6] w-[250px]"
              />
            </div>
            <button className="bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#e2e8f0] text-[#202127] font-medium text-[14px] px-4 py-2 rounded-[8px] flex items-center gap-2">
              <FiFilter /> Filter
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-[14px] px-6 py-2 rounded-[8px] flex items-center gap-2 shadow-sm"
            >
              + ADD CATEGORY
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <select className="bg-white border border-[#e2e8f0] text-[#4e515c] font-medium text-[13px] px-4 py-2.5 rounded-[8px] outline-none">
              <option>Category: All</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <select className="bg-white border border-[#e2e8f0] text-[#4e515c] font-medium text-[13px] px-4 py-2.5 rounded-[8px] outline-none">
              <option>Date: Recent First</option>
              <option>Date: Oldest First</option>
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#e2e8f0] mb-6">
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-bold transition-colors relative flex items-center gap-2 ${
                isActive ? "text-[#181C7B]" : "text-[#A0AEC0] hover:text-[#4e515c]"
              }`}
            >
              {tab}
              {tab === "Pending Approval" && pendingCount > 0 && (
                <span className={`text-[11px] font-bold px-2 py-[2px] rounded-full ${isActive ? 'bg-[#3b82f6] text-white' : 'bg-[#e2e8f0] text-[#717480]'}`}>
                  {pendingCount}
                </span>
              )}
              {tab === "Rejected" && rejectedCount > 0 && (
                <span className={`text-[11px] font-bold px-2 py-[2px] rounded-full ${isActive ? 'bg-[#e02b2b] text-white' : 'bg-[#e2e8f0] text-[#717480]'}`}>
                  {rejectedCount}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#181C7B] rounded-t-[4px]"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "Categories" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((category: any) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onViewSubCategories={(cat) => setViewingCategory(cat)}
              onEdit={() => {}}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      ) : (
        <CourseTable courses={filteredCourses} activeTab={activeTab} />
      )}

      {/* Modals */}
      {isCreateModalOpen && <CreateCategoryModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateCategory} />}
      {viewingCategory && <SubCategoryModal category={viewingCategory} onClose={() => setViewingCategory(null)} />}

    </div>
  );
};

export default CourseManagementPage;
