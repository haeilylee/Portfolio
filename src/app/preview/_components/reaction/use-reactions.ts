"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectReactions } from "@/lib/reactions-store";

const EMPTY: ProjectReactions = { claps: 0, emoji: {}, comments: [] };

/** 시안 리액션 API와 통신하는 공통 훅. 세 시안이 같은 저장소를 공유한다. */
export function useReactions(slug: string) {
  const [data, setData] = useState<ProjectReactions>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/preview/reactions?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, [slug]);

  const post = useCallback(
    async (payload: Record<string, unknown>) => {
      const res = await fetch("/api/preview/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...payload }),
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
