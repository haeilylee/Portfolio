import { NextRequest, NextResponse } from "next/server";
import { getClapStore } from "@/lib/clap-store";

export const dynamic = "force-dynamic";

const VISITOR_RE = /^[a-zA-Z0-9_-]{8,64}$/;

/** GET /api/clap?slug=&visitor= → { claps, mine, limit } · 503이면 저장소 미설정 */
export async function GET(req: NextRequest) {
  const store = getClapStore();
  if (!store) return NextResponse.json({ error: "clap store not configured" }, { status: 503 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const visitor = req.nextUrl.searchParams.get("visitor") ?? "";
  if (!slug || !VISITOR_RE.test(visitor)) return NextResponse.json({ error: "bad request" }, { status: 400 });

  return NextResponse.json(await store.get(slug, visitor), { headers: { "Cache-Control": "no-store" } });
}

/** POST /api/clap { slug, visitor } → { claps, mine, limit, accepted } */
export async function POST(req: NextRequest) {
  const store = getClapStore();
  if (!store) return NextResponse.json({ error: "clap store not configured" }, { status: 503 });

  let body: { slug?: unknown; visitor?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const visitor = typeof body.visitor === "string" ? body.visitor : "";
  if (!slug || !VISITOR_RE.test(visitor)) return NextResponse.json({ error: "bad request" }, { status: 400 });

  return NextResponse.json(await store.clap(slug, visitor), { headers: { "Cache-Control": "no-store" } });
}
