"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// A YouTube video in YouTube's own player (privacy-enhanced mode) that reports where the viewer is, so a
// course page can follow the video's timeline. It uses YouTube's official IFrame Player API and leaves the
// player's controls, ads and branding untouched.

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;

const loadYouTubeApi = (): Promise<any> => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    });
  }
  return apiPromise;
};

export type TPlayerState = "playing" | "paused" | "ended" | "buffering" | "other";

export type TYouTubePlayerHandle = {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
};

type TProps = {
  videoId: string;
  // Where the player starts when it loads a video
  startSeconds?: number;
  title: string;
  className?: string;
  // About once a second while the video plays, and once when it pauses
  onTime?: (seconds: number) => void;
  onStateChange?: (state: TPlayerState) => void;
};

const STATES: Record<number, TPlayerState> = { 0: "ended", 1: "playing", 2: "paused", 3: "buffering" };

const YouTubePlayer = forwardRef<TYouTubePlayerHandle, TProps>(
  ({ videoId, startSeconds = 0, title, className = "", onTime, onStateChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const timerRef = useRef<number | null>(null);
    // The newest props, read by callbacks that YouTube holds on to
    const latest = useRef({ videoId, startSeconds, title, onTime, onStateChange });
    latest.current = { videoId, startSeconds, title, onTime, onStateChange };
    const loadedVideo = useRef("");

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        playerRef.current?.seekTo?.(seconds, true);
        playerRef.current?.playVideo?.();
      },
      getCurrentTime: () => playerRef.current?.getCurrentTime?.() ?? 0,
    }));

    const stopTimer = () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };

    // Create the player once
    useEffect(() => {
      let cancelled = false;
      loadYouTubeApi().then((YT) => {
        if (cancelled || !containerRef.current) return;
        const mount = document.createElement("div");
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(mount);
        loadedVideo.current = latest.current.videoId;
        playerRef.current = new YT.Player(mount, {
          host: "https://www.youtube-nocookie.com",
          videoId: latest.current.videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            start: Math.floor(latest.current.startSeconds),
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              try {
                event.target.getIframe().title = latest.current.title;
              } catch {
                // title is only for screen readers
              }
              // The video may have changed while the player was loading
              if (loadedVideo.current !== latest.current.videoId) {
                loadedVideo.current = latest.current.videoId;
                event.target.loadVideoById({ videoId: latest.current.videoId, startSeconds: latest.current.startSeconds });
              }
            },
            onStateChange: (event: any) => {
              const state = STATES[event.data] ?? "other";
              stopTimer();
              if (state === "playing") {
                timerRef.current = window.setInterval(() => {
                  latest.current.onTime?.(event.target.getCurrentTime());
                }, 1000);
              } else if (state === "paused") {
                latest.current.onTime?.(event.target.getCurrentTime());
              }
              latest.current.onStateChange?.(state);
            },
          },
        });
      });
      return () => {
        cancelled = true;
        stopTimer();
        try {
          playerRef.current?.destroy?.();
        } catch {
          // already gone
        }
        playerRef.current = null;
      };
    }, []);

    // A different video: load it into the same player
    useEffect(() => {
      const player = playerRef.current;
      if (!player?.loadVideoById || loadedVideo.current === videoId) return;
      loadedVideo.current = videoId;
      player.loadVideoById({ videoId, startSeconds });
    }, [videoId, startSeconds]);

    return <div ref={containerRef} className={className} />;
  }
);

YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;
