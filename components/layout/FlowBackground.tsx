"use client";

import { usePathname } from "next/navigation";

const FLOW_PATH_PREFIXES = ["/input", "/analysis", "/result", "/advisor"];

export function FlowBackground() {
  const pathname = usePathname();
  const show = FLOW_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-[5]" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/main_bg.jpeg)" }}
      />
      <div className="absolute inset-0 bg-canvas/82" />
    </div>
  );
}
