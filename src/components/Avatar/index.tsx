"use client";

import React, { useEffect, useState } from "react";

// A neutral person silhouette. Used wherever someone has no photo, instead of initials.
export const DefaultAvatarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" aria-hidden className={className} fill="currentColor">
    <circle cx="20" cy="15" r="7.5" />
    <path d="M5 40c0-8.3 6.7-14 15-14s15 5.7 15 14z" />
  </svg>
);

type TProps = {
  src?: string | null;
  alt?: string;
  // Size and shape classes for the circle, e.g. "h-9 w-9"
  className?: string;
  // Colours of the placeholder, e.g. on dark backgrounds
  placeholderClassName?: string;
};

/** Profile picture that falls back to the default person icon when there is no photo or it fails to load. */
const Avatar = ({ src, alt = "", className = "h-9 w-9", placeholderClassName = "bg-[#e6e9f5] text-[#98a0c0]" }: TProps) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showPhoto = Boolean(src) && !failed;

  return (
    <span className={`relative inline-flex shrink-0 items-end justify-center overflow-hidden rounded-full ${showPhoto ? "bg-[#e6e9f5]" : placeholderClassName} ${className}`}>
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src as string} alt={alt} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <DefaultAvatarIcon className="h-[88%] w-[88%]" />
      )}
    </span>
  );
};

export default Avatar;
