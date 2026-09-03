"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FullBleedVideoSection } from "@/components/ui/FullBleedVideoSection";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { AdvisorCard } from "@/components/ui/AdvisorCard";
import { ADVISOR_OPTIONS, SERVICE_OPTIONS } from "@/lib/types";
import { useSession } from "@/lib/session/context";

const STEPS = [
  { step: "01", title: "출생정보 입력", desc: "양·음력, 시간, 출생지를 입력해요." },
  { step: "02", title: "상담가 · 주제 선택", desc: "객관형·감정형 중 편한 온도를 고르세요." },
  { step: "03", title: "근거 있는 해석", desc: "명식 계산과 AI 해석을 함께 확인해요." },
];

export default function HomePage() {
  const router = useRouter();
  const { setSession } = useSession();

  return (
    <div className="-mt-6 space-y-24 md:space-y-32">
      {/* Hero — viewport 전체 */}
      <FullBleedVideoSection
        src="/videos/hero.mp4"
        fullHeight
        overlayClassName="bg-gradient-to-b from-canvas/70 via-canvas/45 to-canvas/80"
        contentClassName="py-16 md:py-24"
      >
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <p className="font-sans text-sm font-medium tracking-wide text-text-secondary">
            근거를 보여주는 AI 사주 상담
          </p>
          <h1 className="font-serif text-[34px] font-semibold leading-tight md:text-[52px] md:leading-[1.2]">
            같은 사주,
            <br />
            원하는 온도로 들으세요.
          </h1>
          <p className="mx-auto max-w-xl font-sans text-[17px] leading-relaxed text-text-secondary md:text-lg">
            만세력은 계산 엔진이 확인하고, AI는 검증된 명리 지식으로만 설명해요.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="sm:min-w-[200px]" onClick={() => router.push("/input/step/1")}>
              내 상담 시작하기
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="sm:min-w-[200px]"
              onClick={() => router.push("/input/step/1")}
            >
              출생정보 입력하기
            </Button>
          </div>
          <p className="font-sans text-sm text-text-secondary">
            로그인 없이 시작 · 입력 정보는 현재 세션에서만 사용
          </p>
        </div>
      </FullBleedVideoSection>

      {/* How it works */}
      <section className="mx-auto max-w-4xl space-y-10 text-center">
        <div className="space-y-3">
          <h2 className="font-serif text-2xl font-semibold md:text-3xl">이렇게 진행돼요</h2>
          <p className="font-sans text-sm text-text-secondary">복잡한 준비 없이 바로 시작할 수 있어요</p>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <li
              key={item.step}
              className="rounded-2xl border border-border/60 bg-surface/60 px-6 py-8 text-center"
            >
              <span className="font-serif text-sm font-semibold text-text-secondary">{item.step}</span>
              <h3 className="mt-3 font-serif text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Advisors + Services — foot_bg viewport 전체 너비 */}
      <FullBleedVideoSection
        src="/videos/foot_bg.mp4"
        overlayClassName="bg-gradient-to-b from-canvas/80 via-canvas/75 to-canvas/85"
        contentClassName="py-16 md:py-24"
      >
        <div className="space-y-24 md:space-y-28">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="space-y-3 text-center">
              <h2 className="font-serif text-2xl font-semibold md:text-3xl">어떤 상담가의 목소리가 편하세요?</h2>
              <p className="font-sans text-sm text-text-secondary">
                해석 근거와 결론은 같고, 말하는 방식만 달라요
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {ADVISOR_OPTIONS.map((advisor) => (
                <AdvisorCard key={advisor.id} {...advisor} />
              ))}
            </div>
            <p className="text-center font-sans text-xs text-text-secondary">
              상담 중에도 언제든 객관형 · 감정형으로 전환할 수 있어요
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-10 text-center">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-semibold md:text-3xl">어떤 상담을 원하세요?</h2>
              <p className="font-sans text-sm text-text-secondary">세 가지 상담 중 하나를 선택해 시작하세요</p>
            </div>
            <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
              {SERVICE_OPTIONS.map((service) => (
                <ServiceCard
                  key={service.id}
                  emoji={service.emoji}
                  title={service.title}
                  description={service.description}
                  question={service.question}
                  onClick={() => {
                    setSession((prev) => ({ ...prev, serviceType: service.id }));
                    router.push("/input/step/1");
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </FullBleedVideoSection>

      {/* Final CTA */}
      <section className="mx-auto max-w-2xl space-y-6 text-center">
        <h2 className="font-serif text-2xl font-semibold md:text-3xl">지금 바로 시작해 보세요</h2>
        <p className="font-sans text-sm leading-relaxed text-text-secondary">
          출생정보만 입력하면 명식 계산부터 AI 해석까지 이어집니다.
        </p>
        <Button size="lg" onClick={() => router.push("/input/step/1")}>
          내 상담 시작하기
        </Button>
      </section>

      <section className="rounded-2xl border border-border/60 bg-subtle/40 p-6 text-center font-sans text-sm leading-relaxed text-text-secondary">
        이 결과는 전통 사주명리학을 바탕으로 한 자기성찰용 콘텐츠이며, 과학적으로 검증된 예측이나
        의료·법률·금융 조언이 아닙니다. 중요한 결정은 현실 정보와 전문가 의견을 함께 확인해 주세요.
      </section>

      <div className="text-center">
        <Link
          href="/input/step/1"
          className="font-sans text-sm font-medium text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
        >
          바로 시작하기 →
        </Link>
      </div>
    </div>
  );
}
