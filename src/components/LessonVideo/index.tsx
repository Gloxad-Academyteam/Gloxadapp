"use client";

import React from "react";
import { getYouTubeStart } from "@utils/youtube";

const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

export const getYouTubeId = (url?: string | null) => (url ? url.match(YOUTUBE_ID)?.[1] ?? null : null);

type TProps = {
  url: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  // Play only part of a YouTube video (a chapter). The start also comes from a ...&t=123s link.
  startSeconds?: number;
  endSeconds?: number;
};

// Plays YouTube lessons (e.g. freeCodeCamp videos) in an embed and uploaded files in a <video> element
const LessonVideo = ({ url, title, className = "", autoPlay = false, onEnded, startSeconds, endSeconds }: TProps) => {
  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    const start = startSeconds ?? getYouTubeStart(url);
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      ...(autoPlay ? { autoplay: "1" } : {}),
      ...(start > 0 ? { start: String(Math.floor(start)) } : {}),
      ...(endSeconds && endSeconds > start ? { end: String(Math.floor(endSeconds)) } : {}),
    });
    return (
      <iframe
        key={`${youtubeId}-${start}-${endSeconds ?? 0}`}
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
