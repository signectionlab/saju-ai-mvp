export function iconForSection(title: string): string {
  const t = title.replace(/\s/g, "");
  if (/명식/.test(t)) return "📜";
  if (/오행/.test(t)) return "🌊";
  if (/강점|성공조건|성공/.test(t)) return "💪";
  if (/주의|약점|방해|리스크/.test(t)) return "⚠️";
  if (/운.*흐름|기회|대운|시기/.test(t)) return "🌟";
  if (/실행|행동|제안/.test(t)) return "🎯";
  if (/관계|연애|애정/.test(t)) return "💞";
  if (/성향|패턴|성격/.test(t)) return "🪞";
  if (/현재|상황/.test(t)) return "📍";
  return "📌";
}

export const TIMEFRAME_LABELS: Record<string, string> = {
  today: "오늘",
  "7_days": "7일 이내",
  "30_days": "30일 이내",
  "90_days": "90일 이내",
};
