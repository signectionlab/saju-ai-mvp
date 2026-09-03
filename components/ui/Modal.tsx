"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button
        type="button"
        className="absolute inset-0 bg-text-primary/40"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]",
          className,
        )}
      >
        <h2 id="modal-title" className="mb-4 text-lg font-semibold text-text-primary">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export function InfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="이용 안내">
      <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
        <p>
          명리온은 전통 사주명리학을 바탕으로 한 자기성찰용 콘텐츠입니다. 과학적으로
          검증된 예측이나 의료·법률·금융 조언이 아닙니다.
        </p>
        <p>
          만세력은 검증된 계산 엔진이 처리하고, AI는 승인된 명리 지식과 계산 결과만
          바탕으로 설명합니다.
        </p>
        <p>
          로그인 없이 이용할 수 있으며, 입력한 출생정보와 대화는 현재 세션에만
          사용됩니다. 세션 종료 또는 삭제 요청 시 제거됩니다.
        </p>
      </div>
    </Modal>
  );
}
