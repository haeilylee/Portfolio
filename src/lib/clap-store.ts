import { Redis } from "@upstash/redis";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

/**
 * 운영 박수(Clap) 저장소 — 1인 1회.
 *
 * - 운영: Upstash Redis (Vercel Marketplace). 환경변수 UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *   (Vercel KV 호환 이름 KV_REST_API_URL / KV_REST_API_TOKEN 도 받는다)
 * - 로컬: 환경변수가 없으면 src/data/claps.dev.json 파일에 쓴다 (gitignore)
 * - 어느 쪽도 못 쓰면 configured=false → 화면에서 버튼을 숨긴다
 *
 * 로그는 Vercel Analytics custom event(track("clap"))로 남긴다 — 서버는 숫자만 센다.
 */

export const CLAP_LIMIT = 1;

export interface ClapState {
  claps: number;
  /** 이 방문자가 이미 보낸 횟수 */
  mine: number;
  limit: number;
}

export interface ClapStore {
  get(slug: string, visitor: string): Promise<ClapState>;
  clap(slug: string, visitor: string): Promise<ClapState & { accepted: number }>;
}

const safe = (s: string) => s.replace(/[^a-zA-Z0-9_#-]/g, "").slice(0, 64);
const keyTotal = (slug: string) => `clap:${safe(slug)}`;
const keyMine = (slug: string, visitor: string) => `clap:${safe(slug)}:v:${safe(visitor)}`;

/* ── Upstash Redis ── */
function redisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function redisStore(redis: Redis): ClapStore {
  return {
    async get(slug, visitor) {
      const [claps, mine] = await Promise.all([
        redis.get<number>(keyTotal(slug)),
        redis.get<number>(keyMine(slug, visitor)),
      ]);
      return { claps: Number(claps ?? 0), mine: Number(mine ?? 0), limit: CLAP_LIMIT };
    },
    async clap(slug, visitor) {
      const mine = Number((await redis.get<number>(keyMine(slug, visitor))) ?? 0);
      if (mine >= CLAP_LIMIT) {
        const claps = Number((await redis.get<number>(keyTotal(slug))) ?? 0);
        return { claps, mine, limit: CLAP_LIMIT, accepted: 0 };
      }
      const [claps, nextMine] = await Promise.all([
        redis.incr(keyTotal(slug)),
        redis.incr(keyMine(slug, visitor)),
      ]);
      return { claps: Number(claps), mine: Number(nextMine), limit: CLAP_LIMIT, accepted: 1 };
    },
  };
}

/* ── 로컬 파일 (개발용) ── */
const FILE = join(process.cwd(), "src/data/claps.dev.json");
type DB = { totals: Record<string, number>; mine: Record<string, number> };

async function load(): Promise<DB> {
  try { return JSON.parse(await readFile(FILE, "utf-8")); } catch { return { totals: {}, mine: {} }; }
}
async function persist(db: DB) {
  await mkdir(dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(db, null, 2) + "\n", "utf-8");
}

const fileStore: ClapStore = {
  async get(slug, visitor) {
    const db = await load();
    return { claps: db.totals[keyTotal(slug)] ?? 0, mine: db.mine[keyMine(slug, visitor)] ?? 0, limit: CLAP_LIMIT };
  },
  async clap(slug, visitor) {
    const db = await load();
    const mine = db.mine[keyMine(slug, visitor)] ?? 0;
    if (mine >= CLAP_LIMIT) return { claps: db.totals[keyTotal(slug)] ?? 0, mine, limit: CLAP_LIMIT, accepted: 0 };
    db.totals[keyTotal(slug)] = (db.totals[keyTotal(slug)] ?? 0) + 1;
    db.mine[keyMine(slug, visitor)] = mine + 1;
    await persist(db);
    return { claps: db.totals[keyTotal(slug)], mine: mine + 1, limit: CLAP_LIMIT, accepted: 1 };
  },
};

/** 환경에 맞는 저장소. null이면 미설정(운영에서 Redis 없음). */
export function getClapStore(): ClapStore | null {
  const redis = redisClient();
  if (redis) return redisStore(redis);
  if (process.env.NODE_ENV === "development") return fileStore;
  return null;
}
