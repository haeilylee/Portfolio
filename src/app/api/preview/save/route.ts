import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * 시안(Preview) 전용 저장.
 * /api/admin/save 와 같은 파일(src/data/content.json)에 같은 형식으로 쓰지만,
 * git commit/push는 하지 않는다 — 시안 검토 중 실수로 원격에 올라가지 않도록.
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬 개발 환경에서만 사용 가능해요." }, { status: 403 });
  }

  const body = await req.json();
  if (!body || !Array.isArray(body.projects) || !body.hero) {
    return NextResponse.json({ error: "콘텐츠 형식이 올바르지 않아요." }, { status: 400 });
  }

  const filePath = join(process.cwd(), "src/data/content.json");
  await writeFile(filePath, JSON.stringify(body, null, 2) + "\n", "utf-8");
  return NextResponse.json({ ok: true });
}
