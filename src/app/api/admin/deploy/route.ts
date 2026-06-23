import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const VERCEL_DEPLOY_HOOK =
  "https://api.vercel.com/v1/integrations/deploy/prj_Gf9gI26NRARQfRDAuEy6AUG2Qt5E/vNZmWqLxzz";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬에서만 사용 가능해요." }, { status: 403 });
  }

  try {
    const cwd = process.cwd();
    await execAsync("git add -A", { cwd });
    const { stdout } = await execAsync("git status --porcelain", { cwd });
    if (stdout.trim()) {
      await execAsync('git commit -m "Update content via admin panel"', { cwd });
    }
    await execAsync("git push origin web-publish", { cwd });
    await fetch(VERCEL_DEPLOY_HOOK, { method: "POST" });
    return NextResponse.json({ ok: true, message: "배포를 시작했어요. 잠시 후 반영돼요." });
  } catch (e) {
    console.error("Deploy failed:", e);
    return NextResponse.json({ ok: false, message: "배포 중 오류가 발생했어요." }, { status: 500 });
  }
}
