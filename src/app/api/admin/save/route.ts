import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬 개발 환경에서만 사용 가능해요." }, { status: 403 });
  }

  const body = await req.json();
  const filePath = join(process.cwd(), "src/data/content.json");
  await writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
