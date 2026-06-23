import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬에서만 사용 가능해요." }, { status: 403 });
  }

  exec("vercel --prod", { cwd: process.cwd() }, (err, stdout, stderr) => {
    console.log(stdout, stderr);
  });

  return NextResponse.json({ ok: true, message: "배포를 시작했어요. 터미널에서 진행 상황을 확인하세요." });
}
