"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { gradientMap } from "@/lib/category-styles";
import { renderTitle, stripTitleBreaks } from "@/lib/format-title";
import { COLLECTIONS, getCollection, type CollectionId } from "@/lib/collections";
import { avatarColor, timeAgo } from "@/lib/comment-format";

/**
 * 홈 프로젝트 영역 (toss.tech 구조)
 *  - 상단: 대표 프로젝트 캐러셀 (썸네일 + 제목 + 성과 불릿)
 *  - 본문: 탭(전체 / 상위 분류) → 목록(분류·기간 · 제목 · 성과 불릿 · 썸네일) → 더보기
 *  - 오른쪽: 인기 있는 프로젝트(박수 순) · 최근 댓글 · 시리즈
 */
type TabKey = "all" | CollectionId;
type Stats = {
  claps: Record<string, number> | null;
  recent: { id: string; slug: string; name: string; text: string; at: string }[] | null;
};

const PAGE = 5;

function Bullets({ items, size = 13 }: { items: string[]; size?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {items.map((o, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", fontSize: size, color: "#666", lineHeight: 1.7, letterSpacing: "-0.025em" }}>
          <span style={{ color: "#bbb", flexShrink: 0, fontSize: "10px", marginTop: "3px" }}>•</span>
          <span>{o}</span>
        </div>
      ))}
    </div>
  );
}

function Thumb({ p, radius = 10, ratio = "4/3" }: { p: Project; radius?: number; ratio?: string }) {
  return (
    <div style={{ borderRadius: radius, aspectRatio: ratio, overflow: "hidden", background: p.thumbnail ? "#eee" : gradientMap[p.catClass] ?? "#ccc" }}>
      {p.thumbnail && <img src={p.thumbnail} alt={stripTitleBreaks(p.title)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
    </div>
  );
}

function Row({ p, first, showCollection }: { p: Project; first: boolean; showCollection: boolean }) {
  const c = getCollection(p.collection);
  return (
    <Link href={`/projects/${p.slug}`} className="home-row" style={{ borderTop: first ? "none" : "1px solid #f0f0f0" }}>
      <div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", fontSize: "11px" }}>
          {showCollection && c && (
            <>
              <span style={{ fontWeight: 600, color: c.color }}>{c.title}</span>
              <span style={{ color: "#e0e0e0" }}>·</span>
            </>
          )}
          <span style={{ fontWeight: 600, color: "#999" }}>{p.category}</span>
          <span style={{ color: "#e0e0e0" }}>·</span>
          <span style={{ color: "#ccc" }}>{p.date}</span>
        </div>
        <div className="home-row-title" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.04em", color: "#111", lineHeight: 1.35, marginBottom: "10px" }}>
          {renderTitle(p.title)}
        </div>
        <Bullets items={p.outcomes} />
      </div>
      <Thumb p={p} />
    </Link>
  );
}

function Box({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="home-widget">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#111", letterSpacing: "-0.04em" }}>{title}</span>
        {note && <span style={{ fontSize: "10px", color: "#bbb" }}>{note}</span>}
      </div>
      {children}
    </div>
  );
}

export default function HomeFeed({ projects }: { projects: Project[] }) {
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<TabKey>("all");
  const [shown, setShown] = useState(PAGE);
  const [stats, setStats] = useState<Stats>({ claps: null, recent: null });

  useEffect(() => {
    fetch("/api/home-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  const count = (k: TabKey) => (k === "all" ? projects : projects.filter((p) => p.collection === k)).length;
  const list = tab === "all" ? projects : projects.filter((p) => p.collection === tab);
  const pick = (k: TabKey) => { setTab(k); setShown(PAGE); };

  const f = projects[slide];
  const fc = getCollection(f?.collection);
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const popular = stats.claps
    ? [...projects].sort((a, b) => (stats.claps![b.slug] ?? 0) - (stats.claps![a.slug] ?? 0)).slice(0, 3)
    : null;

  return (
    <>
      {/* Featured */}
      {f && (
        <div style={{ padding: "32px 0 48px", borderBottom: "1px solid #f0f0f0" }}>
          <div className="home-featured">
            <Link href={`/projects/${f.slug}`} style={{ display: "block" }}>
              <Thumb p={f} radius={16} ratio="16/10" />
            </Link>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: fc?.color ?? "#bbb", marginBottom: "12px" }}>
                Featured{fc ? ` · ${fc.title}` : ""}
              </div>
              <Link href={`/projects/${f.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", lineHeight: 1.3, marginBottom: "16px" }}>
                  {renderTitle(f.title)}
                </div>
              </Link>
              <Bullets items={f.outcomes} />
              {projects.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px" }}>
                  <button className="home-page-btn" onClick={() => setSlide((slide - 1 + projects.length) % projects.length)} aria-label="이전">‹</button>
                  <span style={{ fontSize: "12px", color: "#bbb" }}>{slide + 1} / {projects.length}</span>
                  <button className="home-page-btn" onClick={() => setSlide((slide + 1) % projects.length)} aria-label="다음">›</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="home-two-col" style={{ paddingTop: "24px" }}>
        <div>
          <div className="home-tabs" role="tablist">
            {([{ key: "all", label: "전체" }, ...COLLECTIONS.map((c) => ({ key: c.id, label: c.title }))] as { key: TabKey; label: string }[]).map(({ key, label }) => (
              <button key={key} role="tab" className="home-tab" data-active={tab === key} onClick={() => pick(key)}>
                {label}<span className="home-tab-count">{count(key)}</span>
              </button>
            ))}
          </div>
          <div style={{ paddingTop: "8px" }}>
            {list.slice(0, shown).map((p, i) => <Row key={p.slug} p={p} first={i === 0} showCollection={tab === "all"} />)}
            {list.length === 0 && <div style={{ fontSize: "13px", color: "#bbb", padding: "40px 0", textAlign: "center" }}>아직 프로젝트가 없어요.</div>}
          </div>
          {shown < list.length && (
            <button className="home-more" onClick={() => setShown(shown + PAGE)}>
              더보기 <span style={{ color: "#bbb" }}>{list.length - shown}</span>
            </button>
          )}
        </div>

        <aside className="home-aside">
          {popular && (
            <Box title="인기 있는 프로젝트" note="박수 순">
              {popular.map((p, i) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="home-rank">
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#3182f6", width: "16px", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: "13px", color: "#333", lineHeight: 1.5, letterSpacing: "-0.03em" }}>{renderTitle(p.title)}</span>
                  <span style={{ fontSize: "12px", color: "#999", whiteSpace: "nowrap" }}>👏 {stats.claps![p.slug] ?? 0}</span>
                </Link>
              ))}
            </Box>
          )}

          {stats.recent && (
            <Box title="최근 댓글">
              {stats.recent.length === 0 && <div style={{ fontSize: "12px", color: "#bbb", padding: "4px 0" }}>아직 댓글이 없어요. 첫 댓글을 남겨 주세요.</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {stats.recent.map((c) => {
                  const p = bySlug[c.slug];
                  return (
                    <Link key={c.id} href={`/projects/${c.slug}#comments`} style={{ display: "flex", gap: "10px", textDecoration: "none" }}>
                      <span className="comment-avatar" style={{ background: avatarColor(c.name), width: 28, height: 28, fontSize: 12 }}>{c.name.slice(0, 1).toUpperCase()}</span>
                      <span style={{ minWidth: 0, display: "block" }}>
                        <span style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#111" }}>
                          {c.name} <span style={{ fontWeight: 400, color: "#bbb" }}>· {timeAgo(c.at)}</span>
                        </span>
                        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "13px", color: "#444", lineHeight: 1.55, letterSpacing: "-0.02em", margin: "2px 0 4px" }}>{c.text}</span>
                        {p && <span style={{ display: "block", fontSize: "11px", color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>↳ {stripTitleBreaks(p.title)}</span>}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Box>
          )}

          <div style={{ fontSize: "13px", fontWeight: 700, color: "#111", letterSpacing: "-0.03em", margin: "28px 0 6px" }}>시리즈</div>
          {COLLECTIONS.map((c) => (
            <button key={c.id} className="home-aside-series" onClick={() => pick(c.id)}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0, marginTop: "6px" }} />
              <span style={{ textAlign: "left" }}>
                <span style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#111" }}>{c.title}</span>
                <span style={{ display: "block", fontSize: "12px", color: "#999", lineHeight: 1.5 }}>{c.subtitle}</span>
              </span>
              <span style={{ fontSize: "12px", color: "#bbb", marginLeft: "auto" }}>{count(c.id)}</span>
            </button>
          ))}
        </aside>
      </div>
    </>
  );
}
