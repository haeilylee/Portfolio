import { NextResponse } from "next/server";
import { commitAndPushContent, currentTarget } from "@/lib/site-target";

/**
 * 배포 = 현재 브랜치로 push. main → haeilylee-portfolio, design → haeilydesign-portfolio 가
 * Vercel Git 연동으로 자동 배포한다. (예전의 `vercel --prod` + 수동 alias는 로그인 보호 문제로 제거)
 */
export async function GET() {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "로컬에서만 사용 가능해요." }, { status: 403 });
  return NextResponse.json(await currentTarget());
}

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬에서만 사용 가능해요." }, { status: 403 });
  }
  try {
    const { branch, site } = await commitAndPushContent();
    return NextResponse.json({ ok: true, message: `✓ ${branch} 푸시 완료 — ${site.domain} 에 1~2분 후 반영돼요.` });
  } catch (e) {
    console.error("Deploy failed:", e);
    return NextResponse.json({ ok: false, message: `배포 중 오류: ${(e as Error).message}` }, { status: 500 });
  }
}
