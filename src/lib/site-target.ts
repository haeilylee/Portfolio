import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * 브랜치 → 운영 사이트. 각 Vercel 프로젝트가 자기 브랜치를 production으로 자동 배포한다.
 * Admin은 지금 체크아웃된 브랜치에 커밋·푸시하므로, 편집할 사이트는 `git switch <branch>`로 고른다.
 */
export const SITES: Record<string, { domain: string; project: string; label: string }> = {
  main: { domain: "haeilylee-portfolio.vercel.app", project: "haeilylee-portfolio", label: "haeilylee (TW)" },
  design: { domain: "haeilydesign-portfolio.vercel.app", project: "haeilydesign-portfolio", label: "haeilydesign (Design)" },
};

export async function currentTarget(cwd = process.cwd()) {
  const { stdout } = await execAsync("git rev-parse --abbrev-ref HEAD", { cwd });
  const branch = stdout.trim();
  return { branch, site: SITES[branch] ?? null };
}

/** content.json·이미지만 커밋하고 현재 브랜치로 푸시. 코드 변경은 건드리지 않는다. */
export async function commitAndPushContent(cwd = process.cwd()) {
  const { branch, site } = await currentTarget(cwd);
  if (!site) throw new Error(`'${branch}' 브랜치는 연결된 사이트가 없어요. main 또는 design에서 편집해 주세요.`);
  await execAsync("git add src/data/content.json public/images", { cwd });
  const { stdout } = await execAsync("git diff --cached --name-only", { cwd });
  if (stdout.trim()) await execAsync('git commit -m "Update content via admin panel"', { cwd });
  await execAsync(`git push origin HEAD:${branch}`, { cwd });
  return { branch, site };
}
