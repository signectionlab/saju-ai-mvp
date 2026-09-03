"use client";

import { useEffect, useRef, useState } from "react";
import type { ChartJSON } from "@/packages/saju-engine/schema";
import type { Reading } from "@/lib/ai/schema";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatChatReply } from "@/lib/ai/format-chat";
import { useSession } from "@/lib/session/context";

interface ChatPanelProps {
  chart: ChartJSON;
  reading: Reading;
  followUpQuestions: string[];
}

export function ChatPanel({ chart, reading, followUpQuestions }: ChatPanelProps) {
  const { session, setSession } = useSession();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const history = session.chatHistory ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [history.length, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    const userMsg = { role: "user" as const, content: text.trim(), timestamp: new Date().toISOString() };
    setSession((prev) => ({ ...prev, chatHistory: [...(prev.chatHistory ?? []), userMsg] }));
    setQuestion("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chart,
          reading,
          style: session.advisorStyle,
          question: text.trim(),
        }),
      });
      const data = await res.json();
      const assistantMsg = {
        role: "assistant" as const,
        content: formatChatReply(data.reply ?? data.error ?? "응답을 생성하지 못했습니다."),
        timestamp: new Date().toISOString(),
      };
      setSession((prev) => ({ ...prev, chatHistory: [...(prev.chatHistory ?? []), assistantMsg] }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">이 결과로 질문하기</h2>
        <p className="mt-1 text-xs text-text-secondary">현재 세션에서만 대화가 유지됩니다.</p>
      </div>

      <div ref={scrollRef} className="max-h-[360px] space-y-3 overflow-y-auto scroll-smooth">
        {history.length === 0 && (
          <p className="text-sm text-text-secondary">추천 질문을 선택하거나 직접 입력해 보세요.</p>
        )}
        {history.map((msg, i) => (
          <div
            key={`${msg.timestamp}-${i}`}
            className={`whitespace-pre-wrap rounded-xl px-3 py-2 font-sans text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-6 border border-brand/20 bg-brand/10 text-text-primary"
                : "mr-6 border border-border bg-subtle text-text-primary"
            }`}
          >
            {msg.role === "assistant" ? formatChatReply(msg.content) : msg.content}
          </div>
        ))}
        {loading && (
          <p className="mr-6 rounded-xl border border-border bg-subtle px-3 py-2 text-sm text-text-secondary">
            답변을 작성하고 있어요…
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {followUpQuestions.map((q) => (
          <button
            key={q}
            type="button"
            className="rounded-full border border-border px-3 py-1.5 text-left text-xs hover:border-brand"
            onClick={() => send(q)}
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(question);
        }}
        className="space-y-2"
      >
        <textarea
          className="min-h-20 w-full rounded-xl border border-border p-3 text-sm"
          placeholder="현재 상황을 알려주면 더 현실적으로 볼 수 있어요."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <p className="text-xs text-text-secondary">사주로 확정할 수 없는 질문(합격·투자 수익 등)은 답하지 않습니다.</p>
        <Button type="submit" className="w-full" loading={loading} disabled={!question.trim()}>
          질문 보내기
        </Button>
      </form>
    </Card>
  );
}
