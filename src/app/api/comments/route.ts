import { NextRequest, NextResponse } from "next/server";
import { getCommentStore, NAME_MAX, TEXT_MAX } from "@/lib/comment-store";
import { getProjectBySlug } from "@/lib/projects";

export const dynamic = "force-dynamic";

const VISITOR_RE = /^[a-zA-Z0-9_-]{8,64}$/;
const noStore = { headers: { "Cache-Control": "no-store" } };

/** GET /api/comments?slug= → { comments } · 503이면 저장소 미설정 */
export async function GET(req: NextRequest) {
  const store = getCommentStore();
  if (!store) return NextResponse.json({ error: "comment store not configured" }, { status: 503 });
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!getProjectBySlug(slug)) return NextResponse.json({ error: "bad request" }, { status: 400 });
  return NextResponse.json({ comments: await store.list(slug) }, noStore);
}

/** POST /api/comments { slug, visitor, name, text } → { comment } */
export async function POST(req: NextRequest) {
  const store = getCommentStore();
  if (!store) return NextResponse.json({ error: "comment store not configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const visitor = typeof body.visitor === "string" ? body.visitor : "";
  const name = (typeof body.name === "string" ? body.name : "").trim().slice(0, NAME_MAX) || "익명";
  const text = (typeof body.text === "string" ? body.text : "").trim();

  if (!getProjectBySlug(slug) || !VISITOR_RE.test(visitor)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!text) return NextResponse.json({ error: "댓글 내용을 입력해 주세요." }, { status: 400 });
  if (text.length > TEXT_MAX) return NextResponse.json({ error: `${TEXT_MAX}자까지 쓸 수 있어요.` }, { status: 400 });

  const comment = await store.add({ slug, name, text }, visitor);
  if (!comment) return NextResponse.json({ error: "잠시 후 다시 남겨 주세요." }, { status: 429 });
  return NextResponse.json({ comment }, noStore);
}
