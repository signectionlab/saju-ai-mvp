"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LoopingVideoProps {
  src: string;
  className?: string;
}

/** 음소거 영상 — 끝까지 재생 후 처음으로 되감아 반복 */
export function LoopingVideo({ src, className }: LoopingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const restart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => {});
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    void video.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      src={src}
      muted
      playsInline
      autoPlay
      preload="auto"
      onEnded={restart}
      aria-hidden
    />
  );
}
