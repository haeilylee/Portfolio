import { NextResponse } from "next/server";
import { getClapStore } from "@/lib/clap-store";
import { getCommentStore } from "@/lib/comment-store";
import { projects } from "@/lib/projects";

export const dynamic = "force-dynamic";

/** 홈 사이드 구좌용 — 프로젝트별 박수 합계 + 최근 댓글. 저장소가 없으면 각각 null */
export async function GET() {
  const clap = getClapStore();
  const comment = getCommentStore();
  const [claps, recent] = await Promise.all([
    clap ? clap.totals(projects.map((p) => p.slug)).catch(() => null) : null,
    comment ? comment.recent(5).catch(() => null) : null,
  ]);
  return NextResponse.json({ claps, recent }, { headers: { "Cache-Control": "no-store" } });
}
