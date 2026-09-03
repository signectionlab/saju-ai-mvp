"use client";

import { useEffect, useState } from "react";

interface BirthDateFieldsProps {
  value: string;
  onChange: (date: string) => void;
  calendarType: "solar" | "lunar";
}

function parseDate(value: string) {
  if (!value) return { year: 2000, month: 1, day: 1 };
  const [y, m, d] = value.split("-").map(Number);
  return { year: y || 2000, month: m || 1, day: d || 1 };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function composeDate(year: number, month: number, day: number) {
  const maxDay = daysInMonth(year, month);
  const safeDay = Math.min(day, maxDay);
  return `${year}-${String(month).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
}

function clampYear(raw: string): number {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return 2000;
  return Math.min(2100, Math.max(1900, n));
}

export function BirthDateFields({ value, onChange, calendarType }: BirthDateFieldsProps) {
  const { year, month, day } = parseDate(value);
  const [yearInput, setYearInput] = useState(String(year));
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);

  useEffect(() => {
    setYearInput(String(year));
  }, [year]);

  const update = (y: number, m: number, d: number) => {
    onChange(composeDate(y, m, d));
  };

  const commitYear = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) {
      setYearInput(String(year));
      return;
    }
    const clamped = clampYear(digits.slice(0, 4));
    setYearInput(String(clamped));
    update(clamped, month, day);
  };

  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold text-text-primary">
        생년월일 {calendarType === "lunar" ? "(음력)" : "(양력)"}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="birth-year" className="mb-1 block text-xs text-text-secondary">
            년
          </label>
          <input
            id="birth-year"
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="1995"
            className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-[15px] text-text-primary placeholder:text-text-secondary/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            value={yearInput}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
              setYearInput(digits);
              if (digits.length === 4) {
                update(clampYear(digits), month, day);
              }
            }}
            onBlur={() => commitYear(yearInput)}
          />
          <p className="mt-1 text-xs text-text-secondary">1900~2100</p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">월</label>
          <select
            className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-[15px] text-text-primary"
            value={month}
            onChange={(e) => update(year, Number(e.target.value), day)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">일</label>
          <select
            className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-[15px] text-text-primary"
            value={day}
            onChange={(e) => update(year, month, Number(e.target.value))}
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

interface BirthTimeFieldsProps {
  birthTime: string | "unknown";
  onChange: (time: string | "unknown") => void;
}

export function BirthTimeFields({ birthTime, onChange }: BirthTimeFieldsProps) {
  const timeUnknown = birthTime === "unknown";
  const [hour, minute] = timeUnknown ? [12, 0] : birthTime.split(":").map(Number);

  const updateTime = (h: number, m: number) => {
    onChange(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-text-primary">출생시각</p>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={timeUnknown}
            onChange={(e) => onChange(e.target.checked ? "unknown" : "12:00")}
          />
          시간 모름
        </label>
      </div>

      {!timeUnknown ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-text-secondary">시</label>
            <select
              className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-[15px]"
              value={hour}
              onChange={(e) => updateTime(Number(e.target.value), minute)}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, "0")}시
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">분</label>
            <select
              className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-[15px]"
              value={minute}
              onChange={(e) => updateTime(hour, Number(e.target.value))}
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}분
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-border/60 bg-subtle/50 p-4 text-sm text-text-secondary">
          시주를 제외한 범위에서 분석하고, 시간에 따라 달라질 수 있는 내용은 따로 표시할게요.
        </p>
      )}
    </div>
  );
}
