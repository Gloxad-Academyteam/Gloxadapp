import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';

type TProps = {
  courseId: string;
  reviews: any[];
  averageRating: number;
  reviewCount: number;
};

const CourseReviews = ({ courseId, reviews = [], averageRating = 0, reviewCount = 0 }: TProps) => {
  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/courses/${courseId}/reviews`, { rating, comment });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["course.details", courseId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to submit review");
    }
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Review comment is required");
      return;
    }
    submitReviewMutation.mutate();
  };

  // Calculate rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, percentage: parseFloat(percentage.toFixed(2)) };
  });

  return (
    <div className="w-full mt-16 max-w-[1100px]">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left Column - Rating Summary */}
        <div className="w-full lg:w-[280px] shrink-0">
          <h2 className="text-[18px] font-bold text-[#202127] mb-6">Learner reviews</h2>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-1 text-[24px] font-bold text-[#202127]">
              <FaStar className="text-[#181C7B] text-[18px]" /> {averageRating.toFixed(1)}
            </span>
            <span className="text-[13px] text-[#717480]">{reviewCount} reviews</span>
          </div>
          
          <div className="flex flex-col gap-3">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-[13px] text-[#202127]">
                <span className="w-12 shrink-0 font-medium">{item.stars} {item.stars === 1 ? 'star' : 'stars'}</span>
                <div className="flex-1 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#181C7B] rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="w-12 shrink-0 text-right text-[#717480]">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Reviews List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-[#717480]">Showing {Math.min(reviews.length, 3)} of {reviewCount}</p>
            {authenticatedUser && !showReviewForm && (
              <button 
                onClick={() => setShowReviewForm(true)}
                className="text-[13px] font-bold text-[#181C7B] hover:underline"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-[#f0f4f8] p-5 rounded-[8px] mb-6 border border-[#e2e8f0]">
              <h4 className="text-[15px] font-bold text-[#202127] mb-3">Leave your review</h4>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    type="button" 
                    key={star} 
                    onClick={() => setRating(star)}
                    className="text-[20px] focus:outline-none"
                  >
                    {star <= rating ? <FaStar className="text-[#181C7B]" /> : <FaRegStar className="text-[#cbd5e1]" />}
                  </button>
                ))}
              </div>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this course..."
                className="w-full bg-white border border-[#cbd5e1] rounded-[6px] p-3 text-[14px] outline-none focus:border-[#181C7B] mb-4"
                rows={3}
              />
              <div className="flex gap-3">
                <button 
                  type="submit"
                  disabled={submitReviewMutation.isPending}
                  className="bg-[#181C7B] text-white px-5 py-2 rounded-[6px] text-[13px] font-bold hover:bg-[#0a006e]"
                >
                  {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-white text-[#4e515c] border border-[#cbd5e1] px-5 py-2 rounded-[6px] text-[13px] font-bold hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          
          <div className="flex flex-col gap-4">
            {reviews.length > 0 ? reviews.slice(0, 3).map((review, index) => (
              <div key={index} className="border border-[#e2e8f0] rounded-[8px] bg-white p-6 shadow-sm flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e2e8f0] overflow-hidden shrink-0">
                  <img src={review.student?.avatarUrl || `https://ui-avatars.com/api/?name=${review.student?.firstName}+${review.student?.lastName}&background=181C7B&color=fff`} alt={review.student?.firstName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[14px] text-[#202127]">{review.student?.firstName} {review.student?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 text-[12px] font-bold text-[#202127]">
                      <FaStar className="text-[#181C7B] text-[10px]" /> {review.rating}
                    </span>
                    <span className="text-[#e2e8f0]">•</span>
                    <span className="text-[12px] text-[#717480]">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[13px] text-[#4e515c] leading-relaxed">
                    "{review.comment}"
                  </p>
                  
                  {review.tutorReply && (
                    <div className="mt-4 bg-[#f8fafc] p-4 rounded-[6px] border border-[#e2e8f0]">
                      <p className="text-[12px] font-bold text-[#181C7B] mb-1">Instructor Reply • {new Date(review.tutorReply.date).toLocaleDateString()}</p>
                      <p className="text-[13px] text-[#4e515c] leading-relaxed">
                        {review.tutorReply.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-[14px] text-[#717480]">No reviews yet. Be the first to review this course!</p>
            )}
          </div>
          
          {reviews.length > 3 && (
            <button className="mt-6 text-[14px] font-bold text-[#4e515c] underline hover:text-[#181C7B]">
              View all {reviewCount} reviews
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CourseReviews;
