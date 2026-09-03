import { formatHanjaText } from "@/lib/hanja-labels";

interface ReadingTextProps {
  children: string;
  className?: string;
  as?: "p" | "span";
}

/** 결과·상담 본문에 한자(한글) 표기를 적용 */
export function ReadingText({ children, className, as: Tag = "p" }: ReadingTextProps) {
  return <Tag className={className}>{formatHanjaText(children)}</Tag>;
}
