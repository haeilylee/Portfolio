import type { Block, Project } from "@/lib/projects";

/* ── haeilydesign-portfolio.vercel.app (Product Designer 버전) 기준 값 ──
 * 로컬 저장소에는 PD 버전 소스가 없어, 라이브 사이트 문구를 그대로 옮겨 왔다. */
export const PD_HERO = {
  name: "Hakyeong Lee",
  role: "Product Designer · PD",
  bio: "나의 1시간을 아끼기 위해 다른 사람의 이해 시간을 늘리고 싶지는 않습니다.\n매일이 도전인 에이전시에서 AI를 디자인 속에 녹여보며, 디자인과 기술의 경계를 확장하고 있습니다.",
  github: "https://github.com/haeilylee",
  linkedin: "https://www.linkedin.com/in/%ED%95%98%EA%B2%BD-%EC%9D%B4-59655a237/",
};

export const PD_SERIES = [
  { id: "product-design", title: "Product Design", subtitle: "고객의 문제를 발견하고, 복잡한 요구사항을 실제 제품 경험으로 구체화합니다.", color: "#3182f6" },
  { id: "ai-workflow", title: "AI Workflow", subtitle: "AI를 활용해 반복되는 비효율을 개선하고, 재사용 가능한 업무 구조를 설계합니다.", color: "#7031d4" },
] as const;

/** 라이브 사이트의 소분류 표기 */
export const PD_META: Record<string, { series: string; label: string; tint: string }> = {
  astra: { series: "Product Design", label: "AI Agent UX", tint: "#e9edf8" },
  "shinhan-investment": { series: "Product Design", label: "신한투자증권 UX 인턴십", tint: "#eef3fb" },
  sdui: { series: "AI Workflow", label: "Component Registry", tint: "#eaf0fd" },
  "ai-requirements": { series: "AI Workflow", label: "PRD Automation", tint: "#f3eefc" },
};

export const plainTitle = (t: string) => t.replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();

/* ── 장면(Scene) 모델 ──────────────────────────────
 * 토스 Simplicity 세션처럼 "비주얼 하나 + 한두 문장"을 한 장면으로 본다.
 * 문장만 바뀌는 동안 비주얼은 유지되고, 새 이미지·리스트가 나오면 비주얼이 바뀐다. */
export type Visual =
  | { kind: "image"; src: string }
  | { kind: "list"; title?: string; items: { title?: string; content: string }[] }
  | { kind: "card"; label: string; content: string }
  | { kind: "code"; code: string; filename?: string }
  | { kind: "table"; rows: { term: string; desc: string }[] }
  | { kind: "cover"; src?: string };

export interface Scene {
  chapter: number; // 섹션 인덱스
  group?: string; // Background / Problem ...
  chapterTitle: string;
  text: string; // **굵게** 허용
  isCover?: boolean; // 챕터 첫 장면(제목 카드)
  visual: Visual;
  visualKey: string; // 같으면 비주얼 유지
}

export interface Chapter {
  index: number;
  title: string;
  group?: string;
  first: number; // 첫 장면 인덱스
  count: number;
}

const clean = (s: string) => s.replace(/>\/?([^<]*)</g, "$1").trim();

/** 문단을 2줄 남짓(약 90자) 단위로 쪼갠다. **굵게** 가 잘리면 앞뒤를 이어 준다. */
function chunk(text: string, max = 90): string[] {
  const sentences = clean(text)
    .split(/\n+/)
    .flatMap((para) => para.split(/(?<=[.?!])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && (cur + " " + s).length > max) {
      out.push(cur);
      cur = s;
    } else cur = cur ? cur + " " + s : s;
  }
  if (cur) out.push(cur);
  let open = false;
  return out.map((c) => {
    let t = (open ? "**" : "") + c;
    const n = (t.match(/\*\*/g) || []).length;
    open = n % 2 === 1;
    if (open) t += "**";
    return t;
  });
}

export function buildStory(p: Project): { scenes: Scene[]; chapters: Chapter[] } {
  const scenes: Scene[] = [];
  const chapters: Chapter[] = [];
  const sections = (p.sections ?? []).filter((s) => s.kind !== "next");
  let lastVisual: Visual = { kind: "cover", src: p.heroThumbnail ?? p.thumbnail };
  let lastKey = "cover";

  // 0. 오프닝 — 핵심 인사이트
  chapters.push({ index: 0, title: p.overviewLabel || "Overview", first: 0, count: 0 });
  chunk(p.insight, 100).forEach((t) =>
    scenes.push({ chapter: 0, chapterTitle: p.overviewLabel || "Overview", text: t, visual: lastVisual, visualKey: lastKey })
  );
  chapters[0].count = scenes.length;

  sections.forEach((s, si) => {
    const ci = si + 1;
    const first = scenes.length;
    const firstImg = s.blocks.find((b) => b.type === "image") as Extract<Block, { type: "image" }> | undefined;
    const coverVisual: Visual = {
      kind: "cover",
      src: firstImg?.src ?? (lastVisual.kind === "image" ? lastVisual.src : p.thumbnail),
    };
    scenes.push({ chapter: ci, group: s.group, chapterTitle: s.title, text: s.title, isCover: true, visual: coverVisual, visualKey: `cover-${ci}` });

    const push = (text: string, v?: Visual, key?: string) => {
      if (v && key) {
        lastVisual = v;
        lastKey = key;
      }
      scenes.push({ chapter: ci, group: s.group, chapterTitle: s.title, text, visual: lastVisual, visualKey: lastKey });
    };

    let pending: { v: Visual; key: string } | null = null;
    s.blocks.forEach((b, bi) => {
      const key = `${ci}-${bi}`;
      switch (b.type) {
        case "image":
          pending = { v: { kind: "image", src: b.src }, key };
          if (b.caption) {
            push(b.caption, pending.v, pending.key);
            pending = null;
          }
          break;
        case "text":
          chunk(b.content).forEach((t) => {
            if (pending) {
              push(t, pending.v, pending.key);
              pending = null;
            } else push(t);
          });
          break;
        case "list":
          push(b.items.map((it) => it.title).filter(Boolean).join(" · ") || "세 가지로 정리했어요.", { kind: "list", items: b.items }, key);
          break;
        case "step":
          push(b.title, { kind: "card", label: b.step ?? b.tag ?? "Step", content: b.content }, key);
          break;
        case "callout":
          push(b.label, { kind: "card", label: b.label, content: b.content }, key);
          break;
        case "code":
          push(b.filename ?? "코드로 정의했어요.", { kind: "code", code: b.code, filename: b.filename }, key);
          break;
        case "table":
          push(b.rows.map((r) => r.term).slice(0, 4).join(" · "), { kind: "table", rows: b.rows }, key);
          break;
      }
    });
    if (pending) push("", (pending as { v: Visual }).v, (pending as { key: string }).key);
    chapters.push({ index: ci, title: s.title, group: s.group, first, count: scenes.length - first });
  });

  return { scenes, chapters };
}
