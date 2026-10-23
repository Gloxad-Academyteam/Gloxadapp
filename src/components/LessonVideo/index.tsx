"use client";

import React from "react";

const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

export const getYouTubeId = (url?: string | null) => (url ? url.match(YOUTUBE_ID)?.[1] ?? null : null);

type TProps = {
  url: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
};

// Plays YouTube lessons (e.g. freeCodeCamp videos) in an embed and uploaded files in a <video> element
const LessonVideo = ({ url, title, className = "", autoPlay = false, onEnded }: TProps) => {
  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    const params = new URLSearchParams({ rel: "0", modestbranding: "1", ...(autoPlay ? { autoplay: "1" } : {}) });
    return (
      <iframe
        key={youtubeId}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`}
        title={title}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return <video key={url} src={url} title={title} className={className} controls autoPlay={autoPlay} onEnded={onEnded} />;
};

export default LessonVideo;
