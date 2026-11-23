import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { commitAndPushContent } from "@/lib/site-target";

/** content.json 저장 → 현재 브랜치에 커밋·푸시 → 그 브랜치에 연결된 사이트가 자동 배포 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬 개발 환경에서만 사용 가능해요." }, { status: 403 });
  }

  const body = await req.json();
  const cwd = process.cwd();
  await writeFile(join(cwd, "src/data/content.json"), JSON.stringify(body, null, 2), "utf-8");

  try {
    const { branch, site } = await commitAndPushContent(cwd);
    return NextResponse.json({ ok: true, pushed: true, branch, domain: site.domain });
  } catch (e) {
    console.error("Git auto-push failed:", e);
    return NextResponse.json({ ok: true, pushed: false, error: (e as Error).message });
  }
}
