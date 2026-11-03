"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectReactions } from "@/lib/reactions-store";

export type ReactionsState = ProjectReactions & { todayUsed?: number; remaining?: number; limit?: number };

const EMPTY: ReactionsState = { claps: 0, emoji: {}, comments: [] };

/**
 * 익명 방문자 ID. 로그인 없이 "사용자 개별" 한도를 걸기 위한 최소 장치 —
 * 브라우저에 한 번 만들어 두고 계속 쓴다. (시크릿 창·다른 기기는 다른 사람으로 센다)
 */
export function getVisitorId(): string {
  try {
    const k = "pv-visitor";
    let v = localStorage.getItem(k);
    if (!v) {
      v = crypto.randomUUID().replace(/-/g, "");
      localStorage.setItem(k, v);
    }
    return v;
  } catch {
    return "anon";
  }
}

/** 시안 리액션 API와 통신하는 공통 훅. 같은 slug를 쓰는 시안끼리 저장소를 공유한다. */
export function useReactions(slug: string) {
  const [data, setData] = useState<ReactionsState>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const visitor = getVisitorId();
    fetch(`/api/preview/reactions?slug=${encodeURIComponent(slug)}&visitor=${visitor}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, [slug]);

  const post = useCallback(
    async (payload: Record<string, unknown>) => {
      const res = await fetch("/api/preview/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, visitor: getVisitorId(), ...payload }),
      });
      const d = await res.json();
      if (!d.error) setData(d);
      return d;
    },
    [slug]
  );

  return { data, loading, post, setData };
}

/** 내 반응 상태(로컬)를 기억하는 작은 헬퍼 — 서버는 집계만 하고, "내가 눌렀는지"는 브라우저가 기억한다 */
export function useLocalFlag(key: string) {
  const [flag, setFlagState] = useState<string | null>(null);
  useEffect(() => {
    try { setFlagState(localStorage.getItem(key)); } catch { /* noop */ }
  }, [key]);
  const setFlag = (v: string | null) => {
    setFlagState(v);
    try { v === null ? localStorage.removeItem(key) : localStorage.setItem(key, v); } catch { /* noop */ }
  };
  return [flag, setFlag] as const;
}

/**
 * 하루 5회 제한 박수 공통 로직.
 * - 연타는 모았다가 600ms 뒤 한 번에 전송
 * - 남은 횟수는 서버 응답(remaining)을 기준으로 삼고, 전송 전에는 낙관적으로 깎는다
 */
export function useLimitedClap(slug: string, via: string) {
  const { data, post, loading } = useReactions(slug);
  const [pending, setPending] = useState(0);
  const [lastResponse, setLastResponse] = useState<Record<string, unknown> | null>(null);

  const limit = data.limit ?? 5;
  const used = (data.todayUsed ?? 0) + pending;
  const remaining = Math.max(0, limit - used);

  useEffect(() => {
    if (pending === 0) return;
    const t = setTimeout(async () => {
      const n = pending;
      setPending(0);
      const res = await post({ action: "clap-limited", count: n, via });
      setLastResponse(res);
    }, 600);
    return () => clearTimeout(t);
  }, [pending, post, via]);

  function clap() {
    if (remaining <= 0) return false;
    setPending((p) => p + 1);
    return true;
  }

  return { data, loading, clap, limit, used, remaining, total: data.claps + pending, lastResponse };
}
