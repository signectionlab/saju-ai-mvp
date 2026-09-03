/** AI가 JSON으로 반환하거나 HTML 태그를 포함한 경우 사용자용 문장으로 변환 */
import { formatHanjaText } from "@/lib/hanja-labels";

export function formatChatReply(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as Record<string, unknown>;
      const parts: string[] = [];

      if (typeof parsed.headline === "string") parts.push(parsed.headline);
      if (typeof parsed.summary === "string") parts.push(parsed.summary);
      if (typeof parsed.content === "string") parts.push(parsed.content);
      if (typeof parsed.message === "string") parts.push(parsed.message);
      if (typeof parsed.reply === "string") parts.push(parsed.reply);

      if (Array.isArray(parsed.recommendations)) {
        for (const item of parsed.recommendations) {
          if (typeof item === "string") parts.push(`· ${item}`);
        }
      }

      if (Array.isArray(parsed.sections)) {
        for (const section of parsed.sections) {
          if (section && typeof section === "object" && "content" in section) {
            const content = (section as { content?: string }).content;
            if (content) parts.push(content);
          }
        }
      }

      if (parts.length > 0) return formatHanjaText(parts.join("\n\n"));
    } catch {
      // not valid JSON — fall through
    }
  }

  return formatHanjaText(
    trimmed
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim(),
  );
}
