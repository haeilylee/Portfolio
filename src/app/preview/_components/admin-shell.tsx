"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project, Hero } from "@/lib/projects";
import type { CollectionId } from "@/lib/collections";
import { isCollectionId } from "@/lib/collections";
import { stripTitleBreaks } from "@/lib/format-title";

type Content = { hero: Hero; projects: Project[] };

export interface CollectionSelectorProps {
  value?: CollectionId;
  onChange: (next?: CollectionId) => void;
}

interface AdminShellProps {
  variantName: string;
  /** 카테고리 선택 UI. 시안별로 다른 컴포넌트를 꽂는다. */
  selector: (props: CollectionSelectorProps) => React.ReactNode;
  /** 선택 UI를 어디에 둘지 — 시안별 배치 차이 */
  placement?: "between-title-and-meta" | "top" | "after-meta";
}

/* 운영 Admin(src/app/admin/page.tsx)의 스타일 토큰을 그대로 가져왔다 */
const s = {
  topbar: { background: "#111", height: "52px", display: "flex", alignItems: "center", padding: "0 28px", gap: "16px", position: "sticky" as const, top: "var(--nav-h)", zIndex: 30 },
  logo: { color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: "-0.04em", marginRight: "auto" } as React.CSSProperties,
  saveBtn: { background: "#fff", color: "#111", border: "none", borderRadius: "7px", padding: "7px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" } as React.CSSProperties,
  sideItem: (active: boolean) => ({ display: "block", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "#111" : "#666", background: active ? "#fff" : "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left" as const, letterSpacing: "-0.03em", marginBottom: "2px", fontFamily: "inherit", whiteSpace: "nowrap" as const }),
  card: { background: "#fff", borderRadius: "12px", padding: "28px 32px", flex: 1, boxShadow: "0 1px 6px rgba(0,0,0,.06)", minWidth: 0 } as React.CSSProperties,
  label: { fontSize: "11px", fontWeight: 600, color: "#999", letterSpacing: ".04em", textTransform: "uppercase" as const, marginBottom: "6px", display: "block" },
  input: { width: "100%", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "#111", letterSpacing: "-0.02em", outline: "none", fontFamily: "inherit", marginBottom: "16px" } as React.CSSProperties,
  textarea: { width: "100%", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "#111", letterSpacing: "-0.02em", outline: "none", fontFamily: "inherit", resize: "vertical" as const, marginBottom: "16px", lineHeight: 1.7 } as React.CSSProperties,
  sectionTitle: { fontSize: "15px", fontWeight: 700, color: "#111", letterSpacing: "-0.04em", marginBottom: "20px" },
  divider: { border: "none", borderTop: "1px solid #f0f0f0", margin: "24px 0" } as React.CSSProperties,
};

export default function AdminShell({ variantName, selector, placement = "between-title-and-meta" }: AdminShellProps) {
  const [content, setContent] = useState<Content | null>(null);
  const [tab, setTab] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/load")
      .then((r) => r.json())
      .then((data: Content) => {
        setContent(data);
        setTab(data.projects[0]?.slug ?? "");
      });
  }, []);

  function setProject(slug: string, field: keyof Project, val: unknown) {
    setDirty(true);
    setMsg("");
    setContent((c) =>
      c ? { ...c, projects: c.projects.map((p) => (p.slug === slug ? { ...p, [field]: val } : p)) } : c
    );
  }

  function setCollection(slug: string, next?: CollectionId) {
    setContent((c) => {
      if (!c) return c;
      return {
        ...c,
        projects: c.projects.map((p) => {
          if (p.slug !== slug) return p;
          // 미지정이면 키 자체를 지워 content.json을 깔끔하게 유지
          const { collection: _omit, ...rest } = p;
          void _omit;
          return next ? { ...rest, collection: next } : rest;
        }),
      };
    });
    setDirty(true);
    setMsg("");
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/preview/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) {
      setDirty(false);
      setMsg("✓ 저장됨 — Public 시안을 새로고침하면 반영돼요");
    } else {
      setMsg(data.error ?? "저장 실패");
    }
  }

  if (!content) {
    return <div style={{ padding: "80px", textAlign: "center", color: "#999", fontSize: "13px" }}>불러오는 중...</div>;
  }

  const active = content.projects.find((p) => p.slug === tab);
  const assignedCount = content.projects.filter((p) => isCollectionId(p.collection)).length;

  const selectorBlock = active && (
    <div style={{ marginBottom: "16px" }}>
      <label style={s.label}>카테고리 (상위 분류)</label>
      {selector({
        value: isCollectionId(active.collection) ? active.collection : undefined,
        onChange: (next) => setCollection(active.slug, next),
      })}
    </div>
  );

  return (
    <div style={{ background: "#f7f7f7", minHeight: "calc(100vh - var(--nav-h))" }}>
      <div style={s.topbar}>
        <span style={s.logo}>
          Preview Admin · {variantName}
          <span style={{ color: "#666", fontWeight: 400, marginLeft: "10px" }}>
            {assignedCount}/{content.projects.length} 지정됨
          </span>
        </span>
        {msg && (
          <span style={{ fontSize: "12px", color: msg.startsWith("✓") ? "#4ade80" : "#f87171" }}>{msg}</span>
        )}
        {dirty && !msg && <span style={{ fontSize: "12px", color: "#fbbf24" }}>저장되지 않은 변경</span>}
        <Link href="/preview/public/a" style={{ fontSize: "12px", color: "#aaa", textDecoration: "none" }}>
          Public에서 보기 →
        </Link>
        <button onClick={save} disabled={saving || !dirty} style={{ ...s.saveBtn, opacity: saving || !dirty ? 0.5 : 1 }}>
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>

      <div className="pv-admin-body">
        <div className="pv-admin-side">
          <div style={{ fontSize: "10px", color: "#ccc", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "8px", padding: "0 12px" }}>프로젝트</div>
          {content.projects.map((p) => (
            <button key={p.slug} style={s.sideItem(tab === p.slug)} onClick={() => setTab(p.slug)}>
              {stripTitleBreaks(p.title).slice(0, 14)}…
              {!isCollectionId(p.collection) && (
                <span style={{ marginLeft: "6px", fontSize: "10px", color: "#f59e0b" }}>●</span>
              )}
            </button>
          ))}
        </div>

        {active && (
          <div style={s.card}>
            <div style={s.sectionTitle}>{stripTitleBreaks(active.title)}</div>

            {placement === "top" && selectorBlock}

            <label style={s.label}>제목</label>
            <input style={s.input} value={active.title} onChange={(e) => setProject(active.slug, "title", e.target.value)} />

            {placement === "between-title-and-meta" && selectorBlock}

            <div className="pv-admin-2col">
              <div>
                <label style={s.label}>기간</label>
                <input style={s.input} value={active.date} onChange={(e) => setProject(active.slug, "date", e.target.value)} />
              </div>
              <div>
                <label style={s.label}>카테고리 레이블 (표시용 텍스트)</label>
                <input style={s.input} value={active.category} onChange={(e) => setProject(active.slug, "category", e.target.value)} />
              </div>
            </div>

            {placement === "after-meta" && selectorBlock}

            <label style={s.label}>Skills used (쉼표로 구분)</label>
            <input
              style={s.input}
              value={active.tags.join(", ")}
              onChange={(e) =>
                setProject(active.slug, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))
              }
            />

            <label style={s.label}>프리뷰 / 설명</label>
            <textarea
              style={s.textarea}
              rows={3}
              value={active.desc}
              onChange={(e) => {
                setProject(active.slug, "desc", e.target.value);
                setProject(active.slug, "preview", e.target.value);
              }}
            />

            <div className="pv-admin-2col">
              <div>
                <label style={s.label}>썸네일 (목록형)</label>
                {active.thumbnail ? (
                  <img src={active.thumbnail} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: "8px", border: "1px solid #f0f0f0" }} />
                ) : (
                  <div style={{ aspectRatio: "4/3", borderRadius: "8px", background: "#f2f2f2" }} />
                )}
              </div>
              <div>
                <label style={s.label}>썸네일 (상세 히어로)</label>
                {active.heroThumbnail ? (
                  <img src={active.heroThumbnail} alt="" style={{ width: "100%", aspectRatio: "16/7", objectFit: "cover", borderRadius: "8px", border: "1px solid #f0f0f0" }} />
                ) : (
                  <div style={{ aspectRatio: "16/7", borderRadius: "8px", background: "#f2f2f2" }} />
                )}
              </div>
            </div>

            <hr style={s.divider} />
            <div style={{ fontSize: "12px", color: "#bbb", lineHeight: 1.7, letterSpacing: "-0.02em" }}>
              성과·툴·인사이트·상세 섹션 편집은 운영 Admin과 동일해요. 이 시안은 카테고리 선택 UI 배치만 비교하는 용도라 생략했어요.
              <br />
              저장은 <code style={{ fontSize: "11px", background: "#f2f2f2", padding: "1px 5px", borderRadius: "4px" }}>src/data/content.json</code>에만 쓰고, git push·배포는 하지 않아요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
