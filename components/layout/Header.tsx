"use client";

import Link from "next/link";
import { useState } from "react";
import { InfoModal } from "@/components/ui/Modal";

export function Header() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className="font-serif text-lg font-semibold tracking-tight text-brand"
          >
            명리온
          </Link>
          <nav className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-subtle hover:text-text-primary"
            >
              이용 안내
            </button>
            <Link
              href="/"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-subtle hover:text-text-primary sm:inline"
            >
              새로 보기
            </Link>
          </nav>
        </div>
      </header>
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}
