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

/** A card-shaped block for stat tiles, panels and anything boxed. */
export const BlockSkeleton: React.FC<{ className?: string }> = ({ className = "h-[140px]" }) => (
  <div role="status" aria-label="Loading" className={`rounded-2xl border border-[#e8eaf3] bg-white p-5 ${className}`}>
    <Skeleton className="mb-4 h-4 w-1/3" />
    <Skeleton className="mb-2 h-3 w-full" />
    <Skeleton className="mb-2 h-3 w-5/6" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

/** A grid of card placeholders. */
export const CardGridSkeleton: React.FC<{ count?: number; className?: string }> = ({ count = 6, className = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" }) => (
  <div role="status" aria-label="Loading" className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-2xl border border-[#e8eaf3] bg-white p-4">
        <Skeleton className="mb-4 h-[140px] w-full rounded-xl" />
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="mb-4 h-3 w-1/2" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    ))}
  </div>
);

/** Rows with a round avatar and two lines of text: lists of people, messages, notifications. */
export const ListSkeleton: React.FC<{ rows?: number; className?: string }> = ({ rows = 5, className = "" }) => (
  <div role="status" aria-label="Loading" className={`flex flex-col gap-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-xl border border-[#eef0f6] bg-white p-4">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="hidden h-7 w-20 rounded-full sm:block" />
      </div>
    ))}
  </div>
);

/** A whole page of content: heading, a few paragraphs and a side panel. */
export const DetailSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div role="status" aria-label="Loading" className={`mx-auto w-full max-w-[1100px] p-6 sm:p-10 ${className}`}>
    <Skeleton className="mb-3 h-8 w-1/2" />
    <Skeleton className="mb-8 h-4 w-1/3" />
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Skeleton className="h-[220px] w-full rounded-2xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[120px] w-full rounded-2xl" />
        <Skeleton className="h-[120px] w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

/** Table body rows for use inside an existing <tbody>. */
export const TableRowsSkeleton: React.FC<{ rows?: number; columns: number }> = ({ rows = 5, columns }) => (
  <>
    {Array.from({ length: rows }).map((_, r) => (
      <tr key={r} className="border-b border-[#f3f4f9]">
        {Array.from({ length: columns }).map((__, c) => (
          <td key={c} className="px-4 py-4">
            <Skeleton className={`h-4 ${c === 0 ? "w-3/4" : "w-1/2"}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default Skeleton;
