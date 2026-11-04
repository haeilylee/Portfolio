import type { Redis } from "@upstash/redis";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { redisClient } from "./clap-store";

/**
 * 댓글 저장소 — 로그인 없이 닉네임 + 한 줄.
 *
 * - 운영: Upstash Redis (박수와 같은 인스턴스)
 *   · comments:{slug}   프로젝트별 최신순 리스트 (최대 200개)
 *   · comments:recent   전체 최신 댓글 (홈 '최근 댓글' 구좌, 최대 20개)
 *   · comment:rl:{visitor}  같은 방문자 연속 등록 제한 (30초)
 * - 로컬: 환경변수가 없으면 src/data/comments.dev.json (gitignore)
 * - 둘 다 없으면 null → 화면에서 댓글 영역을 숨긴다
 * - 삭제(모더레이션)는 Upstash 콘솔에서 해당 리스트 항목을 지운다.
 */

export interface Comment {
  id: string;
  slug: string;
  name: string;
  text: string;
  at: string; // ISO
}

export const NAME_MAX = 20;
export const TEXT_MAX = 300;
const PER_SLUG_MAX = 200;
const RECENT_MAX = 20;
const RATE_LIMIT_SEC = 30;

export interface CommentStore {
  list(slug: string): Promise<Comment[]>;
  recent(limit: number): Promise<Comment[]>;
  /** 등록. 같은 방문자가 30초 안에 다시 쓰면 null */
  add(c: Omit<Comment, "id" | "at">, visitor: string): Promise<Comment | null>;
}

const safe = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
const keySlug = (slug: string) => `comments:${safe(slug)}`;
const KEY_RECENT = "comments:recent";
const keyRate = (visitor: string) => `comment:rl:${safe(visitor)}`;

function make(c: Omit<Comment, "id" | "at">): Comment {
  return { ...c, id: crypto.randomUUID().slice(0, 12), at: new Date().toISOString() };
}

function redisStore(redis: Redis): CommentStore {
  const parse = (rows: unknown[]) =>
    rows.map((r) => (typeof r === "string" ? JSON.parse(r) : r) as Comment);
  return {
    async list(slug) {
      return parse(await redis.lrange(keySlug(slug), 0, PER_SLUG_MAX - 1));
    },
    async recent(limit) {
      return parse(await redis.lrange(KEY_RECENT, 0, Math.min(limit, RECENT_MAX) - 1));
    },
    async add(input, visitor) {
      const ok = await redis.set(keyRate(visitor), 1, { nx: true, ex: RATE_LIMIT_SEC });
      if (!ok) return null;
      const c = make(input);
      const json = JSON.stringify(c);
      await Promise.all([
        redis.lpush(keySlug(c.slug), json).then(() => redis.ltrim(keySlug(c.slug), 0, PER_SLUG_MAX - 1)),
        redis.lpush(KEY_RECENT, json).then(() => redis.ltrim(KEY_RECENT, 0, RECENT_MAX - 1)),
      ]);
      return c;
    },
  };
}

/* ── 로컬 파일 (개발용) ── */
const FILE = join(process.cwd(), "src/data/comments.dev.json");
type DB = { items: Comment[]; rate: Record<string, number> };

async function load(): Promise<DB> {
  try { return JSON.parse(await readFile(FILE, "utf-8")); } catch { return { items: [], rate: {} }; }
}
async function persist(db: DB) {
  await mkdir(dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(db, null, 2) + "\n", "utf-8");
}

const fileStore: CommentStore = {
  async list(slug) {
    return (await load()).items.filter((c) => c.slug === slug);
  },
  async recent(limit) {
    return (await load()).items.slice(0, limit);
  },
  async add(input, visitor) {
    const db = await load();
    const last = db.rate[visitor] ?? 0;
    if (Date.now() - last < RATE_LIMIT_SEC * 1000) return null;
    const c = make(input);
    db.items.unshift(c);
    db.rate[visitor] = Date.now();
    await persist(db);
    return c;
  },
};

export function getCommentStore(): CommentStore | null {
  const redis = redisClient();
  if (redis) return redisStore(redis);
  if (process.env.NODE_ENV === "development") return fileStore;
  return null;
}
