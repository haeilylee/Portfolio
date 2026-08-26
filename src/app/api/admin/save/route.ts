import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬 개발 환경에서만 사용 가능해요." }, { status: 403 });
  }

  const body = await req.json();
  const cwd = process.cwd();
  const filePath = join(cwd, "src/data/content.json");
  await writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");

  try {
    await execAsync("git add src/data/content.json public/images", { cwd });
    const { stdout } = await execAsync("git status --porcelain", { cwd });
    if (stdout.trim()) {
      await execAsync('git commit -m "Update content via admin panel"', { cwd });
      await execAsync("git push origin web-publish", { cwd });
      // 실제 배포와 도메인 alias는 /api/admin/deploy가 담당한다.
      // 여기서 vercel을 또 실행하면 프로덕션 빌드가 두 개 뜨고,
      // 그중 하나는 alias되지 않아 어느 배포가 실서비스인지 알 수 없게 된다.
    }
  } catch (e) {
    console.error("Git auto-push failed:", e);
    return NextResponse.json({ ok: true, pushed: false });
  }

  return NextResponse.json({ ok: true, pushed: true });
}
