import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json({ ok: true, message: "세션 삭제 요청이 처리되었습니다." });
}
