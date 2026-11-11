import { COURSE_GRID } from ".";

// Same shape as CourseCard (picture, tag, two title lines, provider, facts, price), so nothing jumps when the real cards arrive
export const CourseCardSkeleton = () => (
  <div className="cc flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#e3e5ee] bg-white" aria-hidden="true">
    <div className="skeleton aspect-video w-full" />
    <div className="cc-body flex flex-1 flex-col">
      <div className="skeleton h-[10px] w-1/3 rounded-full" />
      <div className="skeleton mt-3 h-[14px] w-[92%] rounded-full" />
      <div className="skeleton mt-2 h-[14px] w-[64%] rounded-full" />
      <div className="skeleton mt-3 h-[11px] w-2/5 rounded-full" />
      <div className="skeleton mt-3 h-[11px] w-4/5 rounded-full" />
      <div className="skeleton mt-auto h-[14px] w-[22%] rounded-full" />
    </div>
  </div>
);

// A grid of them, in the same fluid grid the real cards use
export const CourseGridSkeleton = ({ count = 6, className = "" }: { count?: number; className?: string }) => (
  <div role="status" aria-label="Loading courses" className={`${COURSE_GRID} ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <CourseCardSkeleton key={index} />
    ))}
  </div>
);

// The wide card used on "My courses": picture on the left, details and a progress bar on the right
export const CourseRowSkeleton = () => (
  <div className="flex flex-col gap-6 rounded-[16px] border border-[#e2e8f0] bg-white p-6 sm:flex-row" aria-hidden="true">
    <div className="skeleton aspect-[4/3] w-full shrink-0 rounded-xl sm:w-[220px]" />
    <div className="flex flex-1 flex-col">
      <div className="skeleton h-[12px] w-24 rounded-full" />
      <div className="skeleton mt-4 h-[18px] w-3/4 rounded-full" />
      <div className="skeleton mt-3 h-[12px] w-1/3 rounded-full" />
      <div className="skeleton mb-2 mt-auto h-[10px] w-2/5 rounded-full" />
      <div className="skeleton h-[6px] w-full max-w-[300px] rounded-full" />
    </div>
  </div>
);
