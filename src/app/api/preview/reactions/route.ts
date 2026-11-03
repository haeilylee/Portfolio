import { NextRequest, NextResponse } from "next/server";
import { store, DAILY_CLAP_LIMIT, todayKey } from "@/lib/reactions-store";

function guard() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬 개발 환경에서만 사용 가능해요." }, { status: 403 });
  }
  return null;
}

/**
 * 웹훅 알림 (Clap C 시안). CLAP_WEBHOOK_URL이 있으면 실제로 보내고, 없으면 보냈을 메시지만 돌려준다.
 * Slack(incoming webhook)·Discord 둘 다 받는 형태로 text/content를 같이 담는다.
 */
async function notifyWebhook(message: string) {
  const url = process.env.CLAP_WEBHOOK_URL;
  if (!url) return { sent: false, message };
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, content: message }),
    });
    return { sent: true, message };
  } catch {
    return { sent: false, message, error: "webhook 전송 실패" };
  }
}

export async function GET(req: NextRequest) {
  const denied = guard();
  if (denied) return denied;
  const slug = req.nextUrl.searchParams.get("slug");
  const visitor = req.nextUrl.searchParams.get("visitor") ?? "";
  if (!slug) return NextResponse.json({ error: "slug가 필요해요." }, { status: 400 });
  const data = await store.get(slug);
  const todayUsed = data.daily?.[todayKey()]?.[visitor] ?? 0;
  return NextResponse.json({ ...data, todayUsed, remaining: Math.max(0, DAILY_CLAP_LIMIT - todayUsed), limit: DAILY_CLAP_LIMIT });
}

export async function POST(req: NextRequest) {
  const denied = guard();
  if (denied) return denied;
  const body = await req.json();
  const slug = typeof body.slug === "string" ? body.slug : "";
  if (!slug) return NextResponse.json({ error: "slug가 필요해요." }, { status: 400 });

  switch (body.action) {
    case "clap":
      return NextResponse.json(await store.clap(slug, Number(body.count ?? 1)));
    case "clap-limited": {
      const visitor = typeof body.visitor === "string" && body.visitor ? body.visitor : "anon";
      const via = typeof body.via === "string" ? body.via : undefined;
      const result = await store.clapLimited(slug, visitor, Number(body.count ?? 1), via);
      let webhook: Awaited<ReturnType<typeof notifyWebhook>> | undefined;
      if (via === "webhook" && result.accepted > 0) {
        webhook = await notifyWebhook(
          `👏 ${slug}에 박수 ${result.accepted}개 (방문자 ${visitor.slice(0, 6)} · 오늘 ${result.todayUsed}/${DAILY_CLAP_LIMIT} · 누적 ${result.claps})`
        );
      }
      return NextResponse.json({ ...result, limit: DAILY_CLAP_LIMIT, webhook });
    }
    case "emoji":
      if (typeof body.key !== "string") return NextResponse.json({ error: "key가 필요해요." }, { status: 400 });
      return NextResponse.json(await store.emoji(slug, body.key, body.delta === -1 ? -1 : 1));
    case "comment":
      if (typeof body.text !== "string" || !body.text.trim()) {
        return NextResponse.json({ error: "댓글 내용을 입력해 주세요." }, { status: 400 });
      }
      return NextResponse.json(await store.comment(slug, String(body.name ?? ""), body.text));
    default:
      return NextResponse.json({ error: "알 수 없는 action" }, { status: 400 });
  }
}
