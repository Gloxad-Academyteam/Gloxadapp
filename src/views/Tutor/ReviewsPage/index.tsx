"use client";

import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaFlag, FaReply, FaThumbsUp, FaDownload, FaFilter } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

const fetchReviews = async () => {
  const { data } = await axiosInstance.get("/tutor/reviews");
  return data;
};

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("All Ratings");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  const { data: coursesData } = useQuery({
    queryKey: ["tutor.courses"],
    queryFn: async () => {
      const res = await axiosInstance.get("/tutor/courses");
      return res.data;
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ["tutor.reviews"],
    queryFn: fetchReviews
  });

  const replyMutation = useMutation({
    mutationFn: async ({ reviewId, content }: { reviewId: string, content: string }) => {
      const res = await axiosInstance.post(`/tutor/reviews/${reviewId}/reply`, { content });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reply posted successfully!");
      setReplyingTo(null);
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["tutor.reviews"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to post reply.");
    }
  });

  const handleReplySubmit = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyMutation.mutate({ reviewId, content: replyText });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center text-[#07004d] text-[14px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? <FaStar /> : <FaRegStar className="text-[#cbd5e1]" />}
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-10 text-[#202127]">Loading reviews...</div>;
  }

  const reviews = data?.reviews || [];
  const metrics = data?.metrics || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: []
  };

  const hasReviews = reviews.length > 0;

  if (!hasReviews) {
    return (
      <div className="flex flex-col h-full bg-[#fcfcfd] p-6 lg:p-10 text-[#202127]">
        <div className="mb-10">
          <h1 className="text-[28px] font-bold">Reviews & Ratings</h1>
          <p className="text-[14px] text-[#717480]">Monitor student feedback, analyze your performance across courses, and engage with your learning community to maintain academic excellence.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[20px] border border-[#e2e8f0] shadow-sm">
          <div className="mb-6">
            <div className="w-[160px] h-[120px] flex items-center justify-center relative text-[#3e92cc] text-[40px]">
               <div className="absolute top-0 left-0 text-[30px] opacity-60"><FaStar /></div>
               <div className="absolute top-[-10px] left-1/2 text-[40px] opacity-80"><FaStar /></div>
               <div className="absolute top-2 right-4 text-[24px] opacity-50"><FaRegStar /></div>
               <div className="mt-8 text-[60px] text-[#202127] opacity-80"><FaRegStar /></div>
            </div>
          </div>
          <h2 className="text-[24px] font-bold text-[#202127] mb-2">No Review Yet!</h2>
          <p className="text-[15px] text-[#717480] mb-8 text-center max-w-[350px]">
            You don't have any review yet. Check this inbox later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#fcfcfd] p-4 sm:p-6 lg:p-10 text-[#202127] overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight mb-2">Reviews & Ratings</h1>
          <p className="text-[14px] text-[#717480] max-w-[600px] leading-[1.6]">
            Monitor student feedback, analyze your performance across courses, and engage with your learning community to maintain academic excellence.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e8f0] rounded-[6px] text-[13px] font-bold text-[#4e515c] hover:bg-[#f8fafc] transition-colors shrink-0 shadow-sm">
          <FaDownload className="text-[#a0aab8]" /> Export Report
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Average Rating */}
        <div className="bg-white p-6 rounded-[16px] border border-[#e2e8f0] shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-bold text-[#717480] uppercase tracking-wider mb-4">AVERAGE RATING</p>
          <div className="flex items-end gap-2 mb-3">
            <h3 className="text-[48px] font-bold text-[#07004d] leading-none">{metrics.averageRating}</h3>
            <span className="text-[20px] text-[#717480] font-medium leading-loose">/ 5.0</span>
          </div>
          <div className="flex items-center text-[18px] text-[#07004d] mb-2 gap-1">
            {renderStars(Math.round(metrics.averageRating))}
          </div>
          <p className="text-[12px] text-[#717480]">+0.2 from last month</p>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-[16px] border border-[#e2e8f0] shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-bold text-[#717480] uppercase tracking-wider mb-4">RATING DISTRIBUTION</p>
          <div className="flex flex-col gap-2 w-full">
            {metrics.ratingDistribution.map((row: any) => (
              <div key={row.stars} className="flex items-center text-[11px] font-medium text-[#4e515c]">
                <span className="w-4 flex items-center justify-between">{row.stars} <FaStar className="text-[8px] text-[#202127]" /></span>
                <div className="flex-1 mx-3 h-[6px] bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#07004d] rounded-full" style={{ width: `${row.pct}%` }}></div>
                </div>
                <span className="w-8 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-[#07004d] p-6 rounded-[16px] shadow-sm flex flex-col justify-center text-white relative overflow-hidden">
          {/* subtle pattern graphic */}
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <div className="w-[150px] h-[150px] rounded-full border-[20px] border-white"></div>
          </div>
          <p className="text-[12px] font-bold text-[#cbd5e1] uppercase tracking-wider mb-4">TOTAL REVIEWS</p>
          <h3 className="text-[48px] font-bold leading-none mb-4">{metrics.totalReviews}</h3>
          <div className="inline-flex items-center gap-2 bg-[#111456] px-3 py-2 rounded-[8px] text-[12px] text-white w-max">
            <span className="text-[#3b82f6] text-[14px]">↗</span> Realtime metric
          </div>
        </div>

      </div>

      {/* Filters Bar */}
      <div className="bg-[#f8fafc] p-3 rounded-[12px] flex flex-col sm:flex-row justify-between items-center mb-6 border border-[#e2e8f0]">
        <div className="flex items-center gap-2 mb-4 sm:mb-0 w-full overflow-x-auto no-scrollbar">
          {["All Ratings", "5 Stars", "4 Stars", "Critical"].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${
                activeFilter === filter ? "bg-[#07004d] text-white" : "bg-[#e2e8f0] text-[#4e515c] hover:bg-[#cbd5e1]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="appearance-none bg-white border border-[#cbd5e1] rounded-[6px] px-4 py-2 pr-8 text-[13px] font-medium text-[#202127] outline-none cursor-pointer w-[180px]"
          >
            <option value="All Courses">All Courses</option>
            {coursesData?.courses?.map((c: any) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <button className="w-9 h-9 flex items-center justify-center border border-[#cbd5e1] rounded-[6px] bg-white text-[#4e515c] hover:bg-[#f8fafc]">
            <FaFilter />
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-4 mb-8">
        {reviews
          .filter((r: any) => selectedCourse === "All Courses" || r.course?._id === selectedCourse)
          .map((review: any) => (
          <div key={review._id} className="bg-white border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm relative">
            <div className="absolute top-6 right-6 flex items-center gap-4">
              <button className="text-[#a0aab8] hover:text-[#202127] transition-colors"><FaFlag /></button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img src={review.student?.avatarUrl || "https://i.pravatar.cc/150?img=32"} alt={review.student?.firstName} className="w-[48px] h-[48px] rounded-full object-cover" />
              <div>
                <h4 className="text-[16px] font-bold text-[#202127] leading-none mb-1">{review.student?.firstName} {review.student?.lastName}</h4>
                <p className="text-[12px] text-[#717480]">
                  Enrolled in: <span className="font-bold text-[#07004d]">{review.course?.title}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {renderStars(review.rating)}
              <span className="text-[12px] text-[#717480]">- {new Date(review.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-[14px] text-[#4e515c] leading-[1.6] mb-6 italic">
              "{review.comment}"
            </p>

            {/* Tutor Response */}
            {review.tutorReply ? (
              <div className="bg-[#f8fafc] rounded-[12px] p-5 mb-6 border border-[#e2e8f0]">
                <div className="flex justify-between items-center mb-3 text-[12px]">
                  <span className="font-bold text-[#07004d] flex items-center gap-2"><FaReply className="rotate-180 scale-x-[-1]" /> Your Response</span>
                  <span className="text-[#a0aab8]">{new Date(review.tutorReply.date).toLocaleDateString()}</span>
                </div>
                <p className="text-[13px] text-[#4e515c] leading-[1.6] mb-4">
                  "{review.tutorReply.content}"
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                {replyingTo === review._id ? (
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your response..."
                      className="w-full border border-[#cbd5e1] rounded-[8px] p-3 text-[13px] outline-none focus:border-[#07004d]"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleReplySubmit(review._id)} 
                        disabled={replyMutation.isPending}
                        className="px-4 py-2 bg-[#07004d] text-white text-[12px] font-bold rounded-[6px] hover:bg-[#0a006e]"
                      >
                        {replyMutation.isPending ? "Posting..." : "Post Reply"}
                      </button>
                      <button 
                        onClick={() => { setReplyingTo(null); setReplyText(""); }} 
                        className="px-4 py-2 bg-[#f1f5f9] text-[#4e515c] text-[12px] font-bold rounded-[6px] hover:bg-[#e2e8f0]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReplyingTo(review._id)} className="flex items-center gap-2 text-[13px] font-bold text-[#07004d] hover:text-[#3e92cc] transition-colors">
                    <FaReply className="rotate-180 scale-x-[-1]" /> Reply to {review.student?.firstName}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-[#717480]">Showing {reviews.length} of {metrics.totalReviews} reviews</p>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-[4px] border border-[#e2e8f0] flex items-center justify-center text-[#cbd5e1] bg-white cursor-not-allowed">{"<"}</button>
          <button className="w-8 h-8 rounded-[4px] bg-[#07004d] flex items-center justify-center text-white text-[13px] font-bold">1</button>
          <button className="w-8 h-8 rounded-[4px] border border-[#e2e8f0] flex items-center justify-center text-[#4e515c] hover:bg-[#f8fafc] bg-white text-[13px] font-bold">2</button>
          <button className="w-8 h-8 rounded-[4px] border border-[#e2e8f0] flex items-center justify-center text-[#4e515c] hover:bg-[#f8fafc] bg-white text-[13px] font-bold">3</button>
          <span className="text-[#a0aab8]">...</span>
          <button className="w-9 h-8 rounded-[4px] border border-[#e2e8f0] flex items-center justify-center text-[#4e515c] hover:bg-[#f8fafc] bg-white text-[13px] font-bold">129</button>
          <button className="w-8 h-8 rounded-[4px] border border-[#e2e8f0] flex items-center justify-center text-[#4e515c] hover:bg-[#f8fafc] bg-white">{">"}</button>
        </div>
      </div>

    </div>
  );
}
