"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADVISOR_OPTIONS } from "@/lib/types";
import { AdvisorCard } from "@/components/ui/AdvisorCard";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/session/context";

export default function AdvisorPage() {
  const router = useRouter();
  const { session, setSession } = useSession();
  const [selected, setSelected] = useState(session.advisorStyle);

  return (
    <div className="mx-auto max-w-[680px] space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-semibold">어떤 방식으로 듣고 싶나요?</h1>
        <p className="mt-2 font-sans text-sm text-text-secondary">
          계산 결과와 핵심 판단은 같고, 설명의 온도만 달라져요.
        </p>
      </div>

      <div className="space-y-4">
        {ADVISOR_OPTIONS.map((advisor) => (
          <AdvisorCard
            key={advisor.id}
            {...advisor}
            selected={selected === advisor.id}
            onClick={() => setSelected(advisor.id)}
          />
        ))}
      </div>

      <Button
        size="lg"
        disabled={!selected}
        onClick={() => {
          setSession((prev) => ({ ...prev, advisorStyle: selected }));
          router.push("/analysis");
        }}
      >
        내 사주 분석하기
      </Button>
    </div>
  );
}
