"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/session/context";
import { cn } from "@/lib/utils";
import type { ChartJSON } from "@/packages/saju-engine/schema";
import type { Reading } from "@/lib/ai/schema";

const STEPS = [
  { label: "출생 시각과 절기를 확인하고 있어요", icon: "☉" },
  { label: "사주 명식을 계산하고 있어요", icon: "卦" },
  { label: "관련 명리 근거를 찾고 있어요", icon: "書" },
  { label: "선택한 상담 방식으로 정리하고 있어요", icon: "言" },
];

export default function AnalysisPage() {
  const router = useRouter();
  const { session, setSession, hydrated } = useSession();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!hydrated || cancelled) return;
    if (!session.birthInput.birthDate) {
      router.replace("/input/step/1");
      return;
    }

    let active = true;

    async function run() {
      try {
        setStepIndex(0);
        await wait(400);
        if (!active) return;

        setStepIndex(1);
        const chartRes = await fetch("/api/chart/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(session.birthInput),
        });
        const chartData = await chartRes.json();
        if (!chartRes.ok) throw new Error(chartData.message ?? "명식 계산 실패");
        const chart = chartData.chart as ChartJSON;

        if (!active) return;
        setStepIndex(2);
        await wait(300);

        setStepIndex(3);
        const readingRes = await fetch("/api/readings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chart,
            serviceType: session.serviceType,
            style: session.advisorStyle,
            currentSituation: session.currentSituation,
            loveMode: session.loveMode,
          }),
        });
        const readingData = await readingRes.json();
        if (!readingRes.ok) throw new Error(readingData.error ?? "해석 생성 실패");

        setSession((prev) => ({
          ...prev,
          chartJson: chart,
          reading: readingData.reading as Reading,
        }));

        const servicePath =
          session.serviceType === "basic"
            ? "/result/basic"
            : session.serviceType === "love"
              ? `/result/love?mode=${session.loveMode ?? "self_pattern"}`
              : "/result/success";
        router.replace(servicePath);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "분석에 실패했습니다.");
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [hydrated, cancelled, router, session, setSession]);

  if (!hydrated) return null;

  return (
    <div className="mx-auto max-w-[680px] space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">분석 중</h1>
        <p className="mt-2 font-sans text-sm text-text-secondary">AI가 명식을 직접 계산하지 않아요.</p>
      </div>

      <Card>
        <div className="relative space-y-0">
          {STEPS.map((step, index) => {
            const isDone = index < stepIndex;
            const isActive = index === stepIndex;
            const isLast = index === STEPS.length - 1;

            return (
              <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-5 top-10 h-[calc(100%-2rem)] w-px",
                      isDone ? "bg-brand" : "bg-border",
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-serif text-base transition-all duration-300",
                    isDone && "border-brand bg-brand text-canvas",
                    isActive && "border-brand bg-accent-soft text-text-primary shadow-[0_0_16px_rgba(154,136,104,0.2)]",
                    !isDone && !isActive && "border-border bg-surface text-text-secondary",
                  )}
                >
                  {isDone ? "✓" : step.icon}
                </div>
                <div className="pt-1.5">
                  <p
                    className={cn(
                      "font-sans text-[15px]",
                      isActive && "font-semibold text-text-primary",
                      isDone && "text-text-primary",
                      !isDone && !isActive && "text-text-secondary",
                    )}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="mt-1 font-sans text-xs text-text-secondary">잠시만 기다려 주세요...</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {error && (
        <Card>
          <p className="text-danger">{error}</p>
          <div className="mt-4 flex gap-3">
            <Button
              onClick={() => {
                setError(null);
                setCancelled(false);
                window.location.reload();
              }}
            >
              다시 분석하기
            </Button>
            <Button variant="secondary" onClick={() => router.push("/input/step/3")}>
              입력 확인하기
            </Button>
          </div>
        </Card>
      )}

      {!error && (
        <Button variant="tertiary" onClick={() => setCancelled(true)}>
          취소
        </Button>
      )}
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
