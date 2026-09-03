"use client";

import type { ReactNode } from "react";
import { LoopingVideo } from "@/components/ui/LoopingVideo";
import { cn } from "@/lib/utils";

interface FullBleedVideoSectionProps {
  src: string;
  overlayClassName?: string;
  className?: string;
  contentClassName?: string;
  /** true면 헤더 아래 뷰포트 전체 높이 */
  fullHeight?: boolean;
  children: ReactNode;
}

/** main 컨테이너 밖으로 빠져나 viewport 전체 너비·영상 배경 */
export function FullBleedVideoSection({
  src,
  overlayClassName,
  className,
  contentClassName,
  fullHeight,
  children,
}: FullBleedVideoSectionProps) {
  return (
    <section
      className={cn(
        "relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden",
        fullHeight && "min-h-[calc(100dvh-4rem)]",
        className,
      )}
    >
      <LoopingVideo src={src} />
      <div className={cn("absolute inset-0", overlayClassName)} aria-hidden />
      <div
        className={cn(
          "relative mx-auto w-full max-w-[1180px] px-5 md:px-8",
          fullHeight && "flex min-h-[calc(100dvh-4rem)] flex-col justify-center",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
