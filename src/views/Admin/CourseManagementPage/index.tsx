"use client";

import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CategoryCard from "./CategoryCard";
import CategoryFormModal from "./CategoryFormModal";
import SubCategoryModal from "./SubCategoryModal";
import CourseTable from "./CourseTable";
import { getAllAdminCourses } from "@services/admin/courses";
import {
  TCategory,
  TCategoryPayload,
  TSubCategory,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@services/categories";

const TABS = ["Categories", "All Courses", "Pending Approval", "Approved", "Rejected"];

const COURSE_STATUS: Record<string, string> = {
  pending: "PENDING",
  published: "APPROVED",
  rejected: "REJECTED",
};

const getErrorMessage = (error: any, fallback: string) => error?.response?.data?.error || fallback;

const CourseManagementPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("Pending Approval");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);
  const [viewingCategoryId, setViewingCategoryId] = useState<string | null>(null);

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await getCategories()).data,
  });

  // Look the category up on every render so the sub-category modal shows saved changes
  const viewingCategory = categories.find((c) => c._id === viewingCategoryId) ?? null;

  const { data: allCourses = [] } = useQuery({
    queryKey: ["admin.courses.all"],
    queryFn: async () => {
      const res = await getAllAdminCourses();
      if (!res.data?.courses) return [];
      
      return res.data.courses
        // Drafts haven't been submitted for review yet
        .filter((c: any) => COURSE_STATUS[c.status])
        .map((c: any) => ({
          id: c._id,
          title: c.title,
          tutorName: c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : "Unknown",
          tutorAvatar: c.instructor?.avatarUrl || "https://ui-avatars.com/api/?name=Instructor&background=181C7B&color=fff",
          category: (typeof c.category === "string" ? c.category : c.category?.name) || "Uncategorized",
          dateSubmitted: new Date(c.createdAt).toLocaleDateString(),
          dateRejected: c.status === "rejected" ? new Date(c.reviewedAt || c.updatedAt).toLocaleDateString() : undefined,
          status: COURSE_STATUS[c.status],
        }));
    }
  });

  const refreshCategories = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created!");
      refreshCategories();
      setIsCreateModalOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to create category")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TCategoryPayload }) => updateCategory(id, payload),
    onSuccess: () => {
      toast.success("Category updated!");
      refreshCategories();
      setEditingCategory(null);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to update category")),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted!");
      refreshCategories();
      setViewingCategoryId(null);
    },
    // 409 when courses still use the category
    onError: (error) => toast.error(getErrorMessage(error, "Failed to delete category")),
  });

  const handleDeleteCategory = (category: TCategory) => {
    if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
      deleteMutation.mutate(category._id);
    }
  };

  const handleSaveSubCategories = (subCategories: TSubCategory[]) => {
    if (!viewingCategory) return;
    updateMutation.mutate({ id: viewingCategory._id, payload: { subCategories } });
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
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
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
          {isLoadingCategories && <p className="text-[14px] text-[#A0AEC0]">Loading categories...</p>}
          {!isLoadingCategories && categories.length === 0 && (
            <p className="text-[14px] text-[#A0AEC0]">No categories yet. Add one to get started.</p>
          )}
          {categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((category) => (
            <CategoryCard 
              key={category._id} 
              category={category} 
              onViewSubCategories={(cat) => setViewingCategoryId(cat._id)}
              onEdit={setEditingCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      ) : (
        <CourseTable courses={filteredCourses} activeTab={activeTab} />
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CategoryFormModal
          isSaving={createMutation.isPending}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(payload) => createMutation.mutate(payload)}
        />
      )}
      {editingCategory && (
        <CategoryFormModal
          category={editingCategory}
          isSaving={updateMutation.isPending}
          onClose={() => setEditingCategory(null)}
          onSubmit={(payload) => updateMutation.mutate({ id: editingCategory._id, payload })}
        />
      )}
      {viewingCategory && !editingCategory && (
        <SubCategoryModal
          category={viewingCategory}
          isSaving={updateMutation.isPending}
          onClose={() => setViewingCategoryId(null)}
          onEditCategory={setEditingCategory}
          onDeleteCategory={handleDeleteCategory}
          onSaveSubCategories={handleSaveSubCategories}
        />
      )}

    </div>
  );
};

export default CourseManagementPage;
