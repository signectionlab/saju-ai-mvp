"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResultView } from "@/components/reading/ResultView";

const MODE_LABELS: Record<string, string> = {
  self_pattern: "나의 연애 패턴",
  compatibility: "두 사람 궁합",
  current_issue: "현재 고민 상담",
};

function LoveResultContent() {
  const params = useSearchParams();
  const mode = params.get("mode") ?? "self_pattern";
  return <ResultView serviceLabel="연애 상담" modeLabel={MODE_LABELS[mode] ?? MODE_LABELS.self_pattern} />;
}

export default function LoveResultPage() {
  return (
    <Suspense fallback={<p className="text-text-secondary">결과를 불러오는 중...</p>}>
      <LoveResultContent />
    </Suspense>
  );
}
