import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const PROJECT_ID = "prj_Gf9gI26NRARQfRDAuEy6AUG2Qt5E";
const TEAM_ID = "team_DUr4OblprLC5Vj13jfHIjOz6";
const PROD_DOMAIN = "haeilylee-portfolio.vercel.app";

// Vercel CLI는 버전에 따라 배포 URL만 한 줄로 출력하거나 JSON 객체를 출력한다.
// 둘 다 받아서 호스트명만 돌려준다.
function parseDeploymentUrl(out: string): string | null {
  const strip = (u: string) => u.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

  try {
    const json = JSON.parse(out);
    const url = json?.deployment?.url ?? json?.url;
    if (typeof url === "string" && url) return strip(url);
  } catch {
    // JSON이 아니면 아래 평문 처리로 넘어간다.
  }

  const match = out.match(/https?:\/\/[^\s"']+\.vercel\.app/g);
  if (match?.length) return strip(match[match.length - 1]);

  return null;
}

async function aliasDeployment(token: string, deploymentUrl: string) {
  const res = await fetch(
    `https://api.vercel.com/v2/deployments/${deploymentUrl}/aliases?teamId=${TEAM_ID}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ alias: PROD_DOMAIN }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Alias failed (${res.status}): ${body}`);
  }
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
      `vercel --prod --yes --token=${token}`,
      { cwd },
      async (err, out, stderr) => {
        if (err) { console.error("Vercel deploy error:", stderr); return; }
        const deploymentUrl = parseDeploymentUrl(out);
        if (!deploymentUrl) { console.error("Vercel deploy: could not parse deployment URL from output:", out); return; }
        console.log("Vercel deploy done:", deploymentUrl);
        try {
          await aliasDeployment(token, deploymentUrl);
          console.log(`Aliased ${PROD_DOMAIN} -> ${deploymentUrl}`);
        } catch (e) {
          console.error("Alias failed:", e);
        }
      }
    );

    return NextResponse.json({ ok: true, message: "✓ 배포를 시작했어요. 1~2분 후 반영돼요." });
  } catch (e) {
    console.error("Deploy failed:", e);
    return NextResponse.json({ ok: false, message: "배포 중 오류가 발생했어요." }, { status: 500 });
  }
}
