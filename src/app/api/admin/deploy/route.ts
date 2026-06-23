import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const PROJECT_ID = "prj_Gf9gI26NRARQfRDAuEy6AUG2Qt5E";
const TEAM_ID = "team_DUr4OblprLC5Vj13jfHIjOz6";
const PROD_DOMAIN = "haeilylee-portfolio.vercel.app";

async function aliasLatestDeployment(token: string) {
  const res = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&target=production&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  const url = data.deployments?.[0]?.url;
  if (!url) return;
  await fetch(`https://api.vercel.com/v2/now/aliases`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ alias: PROD_DOMAIN, deployment: url }),
  });
}

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "로컬에서만 사용 가능해요." }, { status: 403 });
  }

  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, message: ".env.local에 VERCEL_TOKEN이 없어요." }, { status: 500 });
  }

  try {
    const cwd = process.cwd();
    await execAsync("git add -A", { cwd });
    const { stdout } = await execAsync("git status --porcelain", { cwd });
    if (stdout.trim()) {
      await execAsync('git commit -m "Update content via admin panel"', { cwd });
    }
    await execAsync("git push origin web-publish", { cwd });

    exec(
      "/Users/plusx/.npm-global/bin/vercel --prod --yes",
      { cwd },
      async (err, out, stderr) => {
        if (err) { console.error("Vercel deploy error:", stderr); return; }
        console.log("Vercel deploy done:", out);
        await aliasLatestDeployment(token);
        console.log(`Aliased ${PROD_DOMAIN} to latest production deployment`);
      }
    );

    return NextResponse.json({ ok: true, message: "✓ 배포를 시작했어요. 1~2분 후 반영돼요." });
  } catch (e) {
    console.error("Deploy failed:", e);
    return NextResponse.json({ ok: false, message: "배포 중 오류가 발생했어요." }, { status: 500 });
  }
}
