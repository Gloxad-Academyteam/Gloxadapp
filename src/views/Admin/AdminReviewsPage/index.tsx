"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaStar, FaTrash } from "react-icons/fa";

const AdminReviewsPage = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin.reviews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/reviews");
      return res.data.reviews;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/admin/reviews/${id}`);
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin.reviews"] });
    },
    onError: () => {
      toast.error("Failed to delete review");
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} className={i < rating ? "text-[#f59e0b]" : "text-[#e2e8f0]"} />
    ));
  };

  return (
    <div className="w-full pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#181C7B] mb-1">Reviews Moderation</h1>
        <p className="text-[#717480] text-[14px]">Oversee and moderate all student reviews left on courses.</p>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-[12px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e2e8f0] bg-[#fafafa]">
          <h2 className="text-[18px] font-bold text-[#202127]">All Reviews</h2>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-[#717480]">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-10 text-center text-[#717480]">No reviews found.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {reviews.map((review: any) => (
              <div key={review._id} className="p-6 hover:bg-[#f8fafc] transition-colors flex flex-col sm:flex-row gap-6">
                
                {/* Author Info */}
                <div className="w-[200px] shrink-0 flex items-center gap-3">
                  {review.student?.profileImage ? (
                    <img src={review.student.profileImage} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#e2e8f0] flex items-center justify-center font-bold text-[#202127]">
                      {(review.student?.firstName?.charAt(0) || "") + (review.student?.lastName?.charAt(0) || "")}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[#202127] text-[14px]">
                      {review.student?.firstName} {review.student?.lastName}
                    </p>
                    <p className="text-[12px] text-[#717480] mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-[14px]">{renderStars(review.rating)}</div>
                    <span className="text-[13px] font-bold text-[#202127] ml-2">{review.rating}.0</span>
                  </div>
                  <div className="bg-[#f0f4f8] text-[#4e515c] text-[13px] font-medium px-3 py-1 rounded-[4px] inline-block mb-3 border border-[#e2e8f0]">
                    Course: <span className="font-bold text-[#181C7B]">{review.course?.title || "Unknown Course"}</span>
                  </div>
                  <p className="text-[#4e515c] text-[14px] leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-center sm:justify-start gap-3">
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this review?")) {
                        deleteMutation.mutate(review._id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-[#fff1f0] text-[#e02b2b] hover:bg-[#ffccc7] rounded-[8px] font-bold text-[13px] transition-colors border border-[#ffccc7] disabled:opacity-50"
                  >
                    <FaTrash />
                    Delete Review
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
