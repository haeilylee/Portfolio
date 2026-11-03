import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

/**
 * 리액션(박수·이모지·댓글) 저장소.
 *
 * 지금은 개발용 로컬 파일(src/data/reactions.dev.json)에 쓴다.
 * Vercel 운영에서는 서버리스 파일시스템이 요청마다 초기화되므로 이 방식이 동작하지 않는다 —
 * 운영 적용 시 아래 `ReactionStore` 인터페이스를 Upstash Redis(Vercel Marketplace) 등으로 구현해 교체한다.
 */

export interface Comment {
  id: string;
  name: string;
  text: string;
  at: string; // ISO
}

/** 박수 로그 한 줄 — 누가(익명 방문자 ID 앞 6자리) 언제 몇 번 */
export interface ClapLogEntry {
  at: string;
  visitor: string;
  n: number;
  /** 로그가 어디로 나갔는지 (analytics / ledger / webhook) — 시안 비교용 */
  via?: string;
}

export interface ProjectReactions {
  claps: number;
  emoji: Record<string, number>;
  comments: Comment[];
  /** 날짜(YYYY-MM-DD) → 방문자 ID → 오늘 보낸 박수 수 */
  daily?: Record<string, Record<string, number>>;
  /** 최근 박수 로그 (최대 200줄) */
  log?: ClapLogEntry[];
}

export interface ClapResult extends ProjectReactions {
  /** 이번 요청에서 실제로 반영된 수 (한도에 걸리면 요청보다 작을 수 있다) */
  accepted: number;
  todayUsed: number;
  remaining: number;
}

export const DAILY_CLAP_LIMIT = 5;

export interface ReactionStore {
  get(slug: string): Promise<ProjectReactions>;
  clap(slug: string, n: number): Promise<ProjectReactions>;
  /** 방문자별 하루 한도를 적용한 박수 */
  clapLimited(slug: string, visitor: string, n: number, via?: string): Promise<ClapResult>;
  emoji(slug: string, key: string, delta: 1 | -1): Promise<ProjectReactions>;
  comment(slug: string, name: string, text: string): Promise<ProjectReactions>;
}

const EMPTY: ProjectReactions = { claps: 0, emoji: {}, comments: [] };
const FILE = join(process.cwd(), "src/data/reactions.dev.json");
const LOG_MAX = 200;

type DB = Record<string, ProjectReactions>;

/** 한국 시간 기준 오늘 날짜 — 하루 한도는 KST 자정에 초기화 */
export function todayKey(d = new Date()) {
  return new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

async function load(): Promise<DB> {
  try {
    return JSON.parse(await readFile(FILE, "utf-8"));
  } catch {
    return {};
  }
}
async function persist(db: DB) {
  await mkdir(dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(db, null, 2) + "\n", "utf-8");
}
function entry(db: DB, slug: string): ProjectReactions {
  if (!db[slug]) db[slug] = { ...EMPTY, emoji: {}, comments: [] };
  return db[slug];
}
function usedToday(e: ProjectReactions, visitor: string) {
  return e.daily?.[todayKey()]?.[visitor] ?? 0;
}

export const fileStore: ReactionStore = {
  async get(slug) {
    const db = await load();
    return db[slug] ?? EMPTY;
  },
  async clap(slug, n) {
    const db = await load();
    const e = entry(db, slug);
    e.claps += Math.max(1, Math.min(50, n)); // 한 번의 요청에 최대 50
    await persist(db);
    return e;
  },
  async clapLimited(slug, visitor, n, via) {
    const db = await load();
    const e = entry(db, slug);
    const day = todayKey();
    const used = usedToday(e, visitor);
    const accepted = Math.max(0, Math.min(n, DAILY_CLAP_LIMIT - used));
    if (accepted > 0) {
      e.claps += accepted;
      e.daily ??= {};
      e.daily[day] ??= {};
      e.daily[day][visitor] = used + accepted;
      // 오래된 날짜는 정리 (최근 7일만)
      for (const k of Object.keys(e.daily)) if (k < todayKey(new Date(Date.now() - 7 * 86400 * 1000))) delete e.daily[k];
      e.log ??= [];
      e.log.unshift({ at: new Date().toISOString(), visitor: visitor.slice(0, 6), n: accepted, via });
      e.log = e.log.slice(0, LOG_MAX);
      await persist(db);
    }
    const todayUsed = used + accepted;
    return { ...e, accepted, todayUsed, remaining: Math.max(0, DAILY_CLAP_LIMIT - todayUsed) };
  },
  async emoji(slug, key, delta) {
    const db = await load();
    const e = entry(db, slug);
    e.emoji[key] = Math.max(0, (e.emoji[key] ?? 0) + delta);
    if (e.emoji[key] === 0) delete e.emoji[key];
    await persist(db);
    return e;
  },
  async comment(slug, name, text) {
    const db = await load();
    const e = entry(db, slug);
    e.comments.unshift({
      id: Math.random().toString(36).slice(2, 10),
      name: name.trim().slice(0, 20) || "익명",
      text: text.trim().slice(0, 300),
      at: new Date().toISOString(),
    });
    await persist(db);
    return e;
  },
};

export const store: ReactionStore = fileStore;
