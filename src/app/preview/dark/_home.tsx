"use client";

import { useCallback, useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { Card, Coverflow, DARK, DarkBadge, DarkStyles, ListView, ModeToggle, SeasonLabel, Tabs, TopBar, toCards } from "./_parts";

/**
 * 홈 — Simplicity처럼 전부 다크. 펼쳐보기(포스터) ↔ 모아보기(탭+목록).
 * 시리즈 구분: 한 줄 캐러셀(시리즈 순서) + 상단 시즌명이 지금 카드의 시리즈로 바뀐다.
 */
export default function DarkHome({ projects, variant }: { projects: Project[]; variant: "a" }) {
  const [mode, setMode] = useState<"spread" | "list">("spread");
  const [tab, setTab] = useState("전체");
  const [curSeries, setCurSeries] = useState("");
  const base = `${DARK}/${variant}`;
  const cards = useMemo(() => toCards(projects), [projects]);
  const onCurrent = useCallback((c: Card) => setCurSeries(c.series), []);

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      <DarkStyles />
      <TopBar center={mode === "list" ? <Tabs tab={tab} setTab={setTab} /> : <SeasonLabel text={`Product Designer · ${curSeries || "Hakyeong Lee"}`} />} />
      {mode === "spread" ? <Coverflow cards={cards} base={base} onCurrent={onCurrent} /> : <ListView cards={cards} base={base} tab={tab} />}
      <ModeToggle mode={mode} onChange={setMode} />
      <DarkBadge title="a · 한 줄 캐러셀 — 상단 시즌명이 카드 따라 바뀜" />
    </div>
  );
}
