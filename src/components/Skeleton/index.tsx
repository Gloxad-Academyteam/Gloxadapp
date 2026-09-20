import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-[8px] bg-[#e2e8f0]/80 ${className}`}
    />
  );
};

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-[20px] border border-[#e2e8f0] bg-white p-4 shadow-sm overflow-hidden">
      {/* Thumbnail */}
      <Skeleton className="w-full h-[180px] rounded-[16px] mb-4" />

      {/* Category Tag & Rating */}
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-md" />
      </div>

      {/* Title */}
      <Skeleton className="h-6 w-full rounded-md mb-2" />
      <Skeleton className="h-6 w-3/4 rounded-md mb-4" />

      {/* Instructor info */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      {/* Footer / Price */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-[8px]" />
      </div>
    </div>
  );
};

export const DashboardMetricCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-3 w-24 rounded-md mb-2" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0]">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/5" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-4 bg-white rounded-[10px] border border-[#f1f5f9] shadow-sm"
        >
          <div className="flex items-center gap-3 w-1/4">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-4 w-1/5" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
