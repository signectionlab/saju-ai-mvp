"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BirthDateFields, BirthTimeFields } from "@/components/birth-form/BirthFields";
import {
  ServiceTypeSelector,
  getServiceEmoji,
  getServiceLabel,
} from "@/components/birth-form/ServiceTypeSelector";
import { useSession } from "@/lib/session/context";
import { POPULAR_CITIES, type BirthInput, type ServiceType } from "@/lib/types";
import { cn, formatDateKorean, formatTimeKorean } from "@/lib/utils";

const STEPS = ["상담 · 출생 정보", "출생 장소", "확인"];

function validateStep1(input: BirthInput) {
  if (!input.birthDate) return "생년월일을 선택해 주세요.";
  const date = new Date(input.birthDate);
  if (Number.isNaN(date.getTime())) return "올바른 날짜를 선택해 주세요.";
  if (date > new Date()) return "출생일은 오늘보다 이전이어야 해요.";
  const year = date.getFullYear();
  if (year < 1900 || year > 2100) return "현재는 1900년부터 2100년까지 계산할 수 있어요.";
  return null;
}

function validateStep2(input: BirthInput) {
  if (!input.location.city) return "시간대 계산을 위해 출생 도시를 선택해 주세요.";
  return null;
}

export default function InputStepPage() {
  const params = useParams<{ step: string }>();
  const step = Number(params.step);
  const router = useRouter();
  const { session, setSession, hydrated } = useSession();
  const [error, setError] = useState<string | null>(null);
  const input = session.birthInput;

  useEffect(() => {
    if (!hydrated) return;
    if (step < 1 || step > 3) router.replace("/input/step/1");
  }, [step, router, hydrated]);

  if (!hydrated) return null;

  const update = (patch: Partial<BirthInput>) => {
    setSession((prev) => ({ ...prev, birthInput: { ...prev.birthInput, ...patch } }));
  };

  const setServiceType = (serviceType: ServiceType) => {
    setSession((prev) => ({
      ...prev,
      serviceType,
      ...(serviceType === "love" && !prev.loveMode ? { loveMode: "self_pattern" as const } : {}),
      ...(serviceType !== "love" ? { loveMode: undefined, currentSituation: undefined } : {}),
    }));
  };

  const goNext = () => {
    if (step === 1) {
      const err = validateStep1(input);
      if (err) return setError(err);
    }
    if (step === 2) {
      const err = validateStep2(input);
      if (err) return setError(err);
    }
    setError(null);
    if (step === 3) {
      router.push("/advisor");
      return;
    }
    router.push(`/input/step/${step + 1}`);
  };

  const timeUnknown = input.birthTime === "unknown";

  return (
    <div className="mx-auto max-w-[680px] space-y-6">
      <div>
        <p className="font-sans text-sm text-text-secondary">
          {STEPS[step - 1]} · {step}/3
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold">
          {step === 1 ? "상담 주제와 출생정보" : "출생정보 입력"}
        </h1>
        <p className="mt-2 font-sans text-sm text-text-secondary">
          {step === 1
            ? "상담받고 싶은 주제와 출생 정보를 입력해 주세요."
            : "이 정보는 명식 계산에만 사용돼요."}
        </p>
      </div>

      {step === 1 && (
        <Card className="space-y-6">
          <ServiceTypeSelector value={session.serviceType} onChange={setServiceType} />

          <div className="border-t border-border pt-6">
            <p className="mb-4 font-sans text-[13px] font-semibold text-text-primary">출생 정보</p>
          <div>
            <p className="mb-2 font-sans text-[13px] font-semibold">달력 구분</p>
            <div className="flex rounded-xl border border-border p-1">
              {(["solar", "lunar"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={cn(
                    "flex-1 rounded-lg py-2 font-sans text-sm font-medium",
                    input.calendarType === type
                      ? "bg-brand text-canvas"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                  onClick={() => update({ calendarType: type })}
                >
                  {type === "solar" ? "양력" : "음력"}
                </button>
              ))}
            </div>
          </div>

          <BirthDateFields
            value={input.birthDate || "2000-01-01"}
            onChange={(birthDate) => update({ birthDate })}
            calendarType={input.calendarType}
          />

          {input.calendarType === "lunar" && (
            <label className="flex items-center gap-2 font-sans text-sm">
              <input
                type="checkbox"
                checked={input.isLeapMonth}
                onChange={(e) => update({ isLeapMonth: e.target.checked })}
              />
              윤달입니다
            </label>
          )}

          <div className="border-t border-border pt-6">
            <BirthTimeFields
              birthTime={input.birthTime}
              onChange={(birthTime) => update({ birthTime })}
            />
          </div>

          <div className="border-t border-border pt-6">
            <p className="mb-2 font-sans text-[13px] font-semibold">성별 (대운 계산용)</p>
            <div className="flex gap-2">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={cn(
                    "rounded-lg border px-4 py-2 font-sans text-sm",
                    input.gender === g ? "border-brand bg-brand/10 text-text-primary" : "border-border",
                  )}
                  onClick={() => update({ gender: g })}
                >
                  {g === "female" ? "여성" : "남성"}
                </button>
              ))}
            </div>
            <p className="mt-2 font-sans text-xs text-text-secondary">
              성별 정보는 성격 판단이 아니라 대운 방향 계산에만 사용합니다.
            </p>
          </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-5">
          <div>
            <p className="mb-2 font-sans text-[13px] font-semibold">출생 도시</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.city}
                  type="button"
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left font-sans text-sm transition-colors",
                    input.location.city === city.city
                      ? "border-brand bg-brand/10 text-text-primary"
                      : "border-border hover:border-accent",
                  )}
                  onClick={() => update({ location: city })}
                >
                  {city.city}, {city.country}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="space-y-4 font-sans text-[15px] leading-relaxed">
          <p>
            {formatDateKorean(input.birthDate)}
            {timeUnknown ? "" : ` ${formatTimeKorean(input.birthTime === "unknown" ? "12:00" : input.birthTime)}`}
            , {input.location.city} 출생 · {input.calendarType === "solar" ? "양력" : "음력"}
          </p>
          <p className="text-sm text-text-secondary">
            상담 주제: {getServiceEmoji(session.serviceType)} {getServiceLabel(session.serviceType)}
          </p>
          <p className="text-sm text-text-secondary">
            입력한 출생정보와 대화는 현재 상담 세션에만 사용되며, 세션 종료 또는 삭제 요청 시 제거됩니다.
          </p>
          {session.serviceType === "love" && (
            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-sm font-semibold">연애 상담 모드</p>
              {(["self_pattern", "compatibility", "current_issue"] as const).map((mode) => (
                <label key={mode} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="loveMode"
                    checked={session.loveMode === mode}
                    onChange={() => setSession((prev) => ({ ...prev, loveMode: mode }))}
                  />
                  {mode === "self_pattern"
                    ? "나의 연애 패턴"
                    : mode === "compatibility"
                      ? "두 사람 궁합"
                      : "현재 고민 상담"}
                </label>
              ))}
              {session.loveMode === "current_issue" && (
                <textarea
                  className="min-h-24 w-full rounded-xl border border-border bg-surface p-3 text-sm text-text-primary"
                  placeholder="현재 상황을 간단히 적어 주세요"
                  value={session.currentSituation ?? ""}
                  onChange={(e) => setSession((prev) => ({ ...prev, currentSituation: e.target.value }))}
                />
              )}
            </div>
          )}
        </Card>
      )}

      {error && (
        <p className="font-sans text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <Button variant="secondary" onClick={() => router.push(`/input/step/${step - 1}`)}>
            이전
          </Button>
        )}
        <Button size="lg" className="flex-1" onClick={goNext}>
          {step === 3 ? "상담가 고르기" : "다음"}
        </Button>
      </div>
    </div>
  );
}
