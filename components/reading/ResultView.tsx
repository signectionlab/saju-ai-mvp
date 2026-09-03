"use client";

import { useState } from "react";
import type { Reading } from "@/lib/ai/schema";
import type { ChartJSON } from "@/packages/saju-engine/schema";
import { Card } from "@/components/ui/Card";
import { EvidenceBadge } from "@/components/ui/EvidenceBadge";
import { Button } from "@/components/ui/Button";
import { PillarTable } from "@/components/chart/PillarTable";
import { ElementBarChart } from "@/components/chart/ElementBarChart";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Modal } from "@/components/ui/Modal";
import { AdvisorStyleSwitch } from "@/components/reading/AdvisorStyleSwitch";
import { ReadingText } from "@/components/reading/ReadingText";
import { iconForSection, TIMEFRAME_LABELS } from "@/lib/reading-section-icons";
import { formatHanjaText, formatStemBranchLabel } from "@/lib/hanja-labels";
import { useSession } from "@/lib/session/context";
import { useRouter } from "next/navigation";

interface ResultViewProps {
  serviceLabel: string;
  modeLabel?: string;
}

export function ResultView({ serviceLabel, modeLabel }: ResultViewProps) {
  const router = useRouter();
  const { session, setSession, clearSession } = useSession();
  const chart = session.chartJson as ChartJSON | undefined;
  const reading = session.reading as Reading | undefined;
  const [detailed, setDetailed] = useState(false);
  const [styleToast, setStyleToast] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!chart || !reading) {
    return (
      <Card>
        <p>결과가 없습니다. 분석을 다시 시작해 주세요.</p>
        <Button className="mt-4" onClick={() => router.push("/input/step/1")}>
          다시 시작
        </Button>
      </Card>
    );
  }

  const switchStyle = async (target: "objective" | "empathetic") => {
    if (target === session.advisorStyle || switching) return;
    setSwitching(true);
    try {
      const res = await fetch("/api/style/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart, reading, targetStyle: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSession((prev) => ({ ...prev, advisorStyle: target, reading: data.reading }));
      setStyleToast(true);
      setTimeout(() => setStyleToast(false), 3000);
    } finally {
      setSwitching(false);
    }
  };

  const handleDelete = async () => {
    await fetch("/api/session", { method: "DELETE" });
    clearSession();
    setDeleteOpen(false);
    router.push("/");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-sm text-text-secondary">
              {serviceLabel}
              {modeLabel ? ` · ${modeLabel}` : ""}
            </p>
            <h1 className="font-serif text-2xl font-semibold md:text-3xl">당신의 사주에서 먼저 보이는 흐름</h1>
            <p className="text-xs text-text-secondary">
              엔진 {chart.engine_version} · {chart.input.location.city} ·{" "}
              {chart.input.birth_time_known ? "시간 포함" : "시간 미상"}
              {chart.input.birth_time_known && chart.pillars.hour && (
                <>
                  {" "}
                  · 시주 {chart.pillars.hour.stemKorean}
                  {chart.pillars.hour.branchKorean}시 (
                  {formatStemBranchLabel(
                    chart.pillars.hour.stem,
                    chart.pillars.hour.branch,
                    chart.pillars.hour.stemKorean,
                    chart.pillars.hour.branchKorean,
                  )}
                  )
                </>
              )}
              {chart.corrections.solar_time_applied && (
                <> · 경도 보정 {chart.corrections.longitude_correction_minutes}분</>
              )}
            </p>
          </div>
          <div className="shrink-0 lg:w-[240px]">
            <AdvisorStyleSwitch
              variant="header"
              value={session.advisorStyle}
              disabled={switching}
              onChange={switchStyle}
            />
            {switching && (
              <p className="mt-2 text-xs text-text-secondary" role="status">
                상담가 유형을 변경하고 있어요…
              </p>
            )}
            {styleToast && (
              <p className="mt-2 text-xs text-text-secondary" role="status">
                전달 방식만 바꿨어요. 계산 결과와 핵심 판단은 그대로예요.
              </p>
            )}
          </div>
        </div>

        {chart.uncertainties.length > 0 && (
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
            {chart.uncertainties.map((u) => (
              <ReadingText key={u.type}>{u.message}</ReadingText>
            ))}
          </div>
        )}

        <Card>
          <span className="inline-block rounded-full border border-border bg-subtle px-3 py-1 text-xs font-semibold tracking-wide text-text-secondary">
            종합평가 요약하기
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold">{formatHanjaText(reading.headline)}</h2>
          <div className="mt-4 flex gap-3 rounded-xl border border-border/80 bg-subtle/50 px-4 py-3">
            <span className="shrink-0 text-xl leading-none" aria-hidden>
              ✨
            </span>
            <ReadingText className="font-sans text-[17px] font-medium leading-relaxed text-text-primary">
              {reading.summary}
            </ReadingText>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold">
              <span aria-hidden>{iconForSection("명식")}</span>
              명식
            </h2>
            <Button variant="tertiary" onClick={() => setDetailed((v) => !v)}>
              {detailed ? "쉬운 보기" : "상세 보기"}
            </Button>
          </div>
          <PillarTable chart={chart} detailed={detailed} />
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold">
            <span aria-hidden>{iconForSection("오행 흐름")}</span>
            오행 흐름
          </h2>
          <ElementBarChart chart={chart} />
        </Card>

        {reading.sections.map((section) => (
          <Card key={section.title}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h3 className="flex items-center gap-2 font-serif text-lg font-semibold">
                <span aria-hidden>{iconForSection(section.title)}</span>
                {formatHanjaText(section.title)}
              </h3>
              <EvidenceBadge basis={section.basis} confidence={section.confidence} />
            </div>
            <ReadingText className="text-[15px] leading-relaxed text-text-primary">{section.content}</ReadingText>
          </Card>
        ))}

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <span aria-hidden>{iconForSection("실행 제안")}</span>
            실행 제안
          </h2>
          <ul className="space-y-4">
            {reading.actions.map((action) => (
              <li key={action.action} className="rounded-xl border border-border p-4">
                <ReadingText className="font-medium">{action.action}</ReadingText>
                <p className="mt-3 rounded-lg border border-border/80 bg-subtle/60 px-3 py-2.5 text-sm leading-relaxed text-text-primary">
                  <span className="mr-1" aria-hidden>
                    💡
                  </span>
                  {formatHanjaText(action.example)}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  기한: {TIMEFRAME_LABELS[action.timeframe] ?? action.timeframe} · 확인 신호:{" "}
                  {formatHanjaText(action.success_signal)}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-2 text-lg font-semibold">해석의 한계</h2>
          <ReadingText className="text-sm leading-relaxed text-text-secondary">{reading.safety_note}</ReadingText>
          {reading.uncertainties.map((u) => (
            <ReadingText key={u} className="mt-2 text-sm text-text-secondary">
              {u}
            </ReadingText>
          ))}
        </Card>

        <div className="border-t border-border pt-6">
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            내 정보 삭제
          </Button>
        </div>
      </div>

      <div className="lg:col-span-4">
        <ChatPanel chart={chart} reading={reading} followUpQuestions={reading.follow_up_questions} />
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="정보 삭제">
        <p className="text-sm leading-relaxed text-text-secondary">
          현재 상담 기록을 삭제할까요? 출생정보와 대화 내용이 이 브라우저 세션에서 삭제되며 되돌릴 수 없어요.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteOpen(false)}>
            취소
          </Button>
          <Button variant="destructive" className="flex-1" onClick={handleDelete}>
            삭제하기
          </Button>
        </div>
      </Modal>
    </div>
  );
}
