"use client";

import { useEffect, useState } from "react";

const PASS = "hakyeong2026";

type Tool = { name: string; desc: string };
type Block = {
  type: "text" | "image" | "code" | "callout" | "list" | "table";
  content?: string;
  src?: string; alt?: string; caption?: string;
  code?: string; lang?: string; filename?: string;
  label?: string;
  items?: { title?: string; content: string }[];
  rows?: { term: string; desc: string }[];
};
type Section = { id: string; title: string; blocks: Block[] };
type Project = {
  slug: string; title: string; category: string; catClass: string;
  date: string; tags: string[]; preview: string; desc: string;
  outcomes: string[]; tools: Tool[]; insight: string;
  insightHighlights: string[];
  codeSnippet?: { filename?: string; lang?: string; code?: string };
  sections?: Section[];
  github_url: string; download_url: string;
};
type Hero = { name: string; role: string; bio: string; github: string; linkedin: string };
type Content = { hero: Hero; projects: Project[] };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [tab, setTab] = useState<string>("hero");
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/admin/load")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {
        import("@/data/content.json").then((m) => setContent(JSON.parse(JSON.stringify(m.default))));
      });
  }, [authed]);

  function login() {
    if (pw === PASS) { sessionStorage.setItem("admin_auth", "1"); setAuthed(true); }
    else setMsg("비밀번호가 틀렸어요.");
  }

  async function save() {
    if (!content) return;
    setSaving(true); setMsg("");
    const res = await fetch("/api/admin/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    setSaving(false);
    setMsg(res.ok ? "✓ 저장됐어요. 페이지를 새로고침하면 반영돼요." : "저장 실패 — 개발 서버에서만 동작해요.");
  }

  async function deploy() {
    setDeploying(true); setMsg("");
    const res = await fetch("/api/admin/deploy", { method: "POST" });
    const data = await res.json();
    setDeploying(false);
    setMsg(data.message ?? data.error);
  }

  function setHero(field: keyof Hero, val: string) {
    setContent((c) => c ? { ...c, hero: { ...c.hero, [field]: val } } : c);
  }

  function setProject(slug: string, field: keyof Project, val: unknown) {
    setContent((c) => c ? { ...c, projects: c.projects.map((p) => p.slug === slug ? { ...p, [field]: val } : p) } : c);
  }

  function setOutcome(slug: string, i: number, val: string) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    const next = [...proj.outcomes]; next[i] = val;
    setProject(slug, "outcomes", next);
  }
  function addOutcome(slug: string) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    setProject(slug, "outcomes", [...proj.outcomes, ""]);
  }
  function removeOutcome(slug: string, i: number) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    setProject(slug, "outcomes", proj.outcomes.filter((_, idx) => idx !== i));
  }

  function setTool(slug: string, i: number, field: keyof Tool, val: string) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    const next = proj.tools.map((t, idx) => idx === i ? { ...t, [field]: val } : t);
    setProject(slug, "tools", next);
  }
  function addTool(slug: string) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    setProject(slug, "tools", [...proj.tools, { name: "", desc: "" }]);
  }
  function removeTool(slug: string, i: number) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    setProject(slug, "tools", proj.tools.filter((_, idx) => idx !== i));
  }
  function moveTool(slug: string, i: number, dir: -1 | 1) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    const next = [...proj.tools];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setProject(slug, "tools", next);
  }

  // ── Sections ──
  function getSections(slug: string): Section[] {
    return content?.projects.find((p) => p.slug === slug)?.sections ?? [];
  }
  function setSections(slug: string, sections: Section[]) {
    setProject(slug, "sections", sections);
  }
  function addSection(slug: string) {
    const next = [...getSections(slug), { id: crypto.randomUUID().slice(0, 8), title: "새 섹션", blocks: [{ type: "text" as const, content: "" }] }];
    setSections(slug, next);
  }
  function removeSection(slug: string, si: number) {
    setSections(slug, getSections(slug).filter((_, i) => i !== si));
  }
  function moveSection(slug: string, si: number, dir: -1 | 1) {
    const next = [...getSections(slug)];
    const j = si + dir;
    if (j < 0 || j >= next.length) return;
    [next[si], next[j]] = [next[j], next[si]];
    setSections(slug, next);
  }
  function renameSectionTitle(slug: string, si: number, title: string) {
    const id = title.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-가-힣]/g, "") || `section-${si}`;
    const next = getSections(slug).map((s, i) => i === si ? { ...s, title, id } : s);
    setSections(slug, next);
  }
  function addBlock(slug: string, si: number, type: Block["type"]) {
    const sections = getSections(slug);
    const newBlock: Block =
      type === "text" ? { type: "text", content: "" } :
      type === "image" ? { type: "image", src: "", alt: "", caption: "" } :
      type === "callout" ? { type: "callout", label: "", content: "" } :
      type === "list" ? { type: "list", items: [{ title: "", content: "" }] } :
      type === "table" ? { type: "table", rows: [{ term: "", desc: "" }] } :
      { type: "code", code: "", lang: "", filename: "" };
    const next = sections.map((s, i) => i === si ? { ...s, blocks: [...s.blocks, newBlock] } : s);
    setSections(slug, next);
  }
  function removeBlock(slug: string, si: number, bi: number) {
    const next = getSections(slug).map((s, i) => i === si ? { ...s, blocks: s.blocks.filter((_, j) => j !== bi) } : s);
    setSections(slug, next);
  }
  function moveBlock(slug: string, si: number, bi: number, dir: -1 | 1) {
    const sections = getSections(slug);
    const blocks = [...sections[si].blocks];
    const j = bi + dir;
    if (j < 0 || j >= blocks.length) return;
    [blocks[bi], blocks[j]] = [blocks[j], blocks[bi]];
    const next = sections.map((s, i) => i === si ? { ...s, blocks } : s);
    setSections(slug, next);
  }
  function setBlock(slug: string, si: number, bi: number, patch: Partial<Block>) {
    const next = getSections(slug).map((s, i) =>
      i === si ? { ...s, blocks: s.blocks.map((b, j) => j === bi ? { ...b, ...patch } : b) } : s
    );
    setSections(slug, next);
  }

  function setHighlight(slug: string, i: number, val: string) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    const next = [...(proj.insightHighlights ?? [])]; next[i] = val;
    setProject(slug, "insightHighlights", next);
  }
  function addHighlight(slug: string) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    setProject(slug, "insightHighlights", [...(proj.insightHighlights ?? []), ""]);
  }
  function removeHighlight(slug: string, i: number) {
    const proj = content?.projects.find((p) => p.slug === slug);
    if (!proj) return;
    setProject(slug, "insightHighlights", (proj.insightHighlights ?? []).filter((_, idx) => idx !== i));
  }

  // ── styles ──
  const s = {
    wrap: { minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Pretendard Variable', sans-serif" } as React.CSSProperties,
    topbar: { background: "#111", height: "52px", display: "flex", alignItems: "center", padding: "0 28px", gap: "16px", position: "sticky" as const, top: 0, zIndex: 99 },
    logo: { color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: "-0.04em", marginRight: "auto" },
    saveBtn: { background: "#fff", color: "#111", border: "none", borderRadius: "7px", padding: "7px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer" },
    deployBtn: { background: deploying ? "#333" : "#0070f3", color: "#fff", border: "none", borderRadius: "7px", padding: "7px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer" },
    body: { display: "flex", maxWidth: "1100px", margin: "0 auto", padding: "28px 24px", gap: "24px" } as React.CSSProperties,
    sidebar: { width: "180px", flexShrink: 0 } as React.CSSProperties,
    sideItem: (active: boolean) => ({ display: "block", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "#111" : "#666", background: active ? "#fff" : "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left" as const, letterSpacing: "-0.03em", marginBottom: "2px" }),
    card: { background: "#fff", borderRadius: "12px", padding: "28px 32px", flex: 1, boxShadow: "0 1px 6px rgba(0,0,0,.06)" } as React.CSSProperties,
    label: { fontSize: "11px", fontWeight: 600, color: "#999", letterSpacing: ".04em", textTransform: "uppercase" as const, marginBottom: "6px", display: "block" },
    input: { width: "100%", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "#111", letterSpacing: "-0.02em", outline: "none", fontFamily: "inherit", marginBottom: "16px" } as React.CSSProperties,
    textarea: { width: "100%", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "#111", letterSpacing: "-0.02em", outline: "none", fontFamily: "inherit", resize: "vertical" as const, marginBottom: "16px", lineHeight: 1.7 } as React.CSSProperties,
    row: { display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "8px" } as React.CSSProperties,
    addBtn: { fontSize: "12px", color: "#0070f3", background: "none", border: "1px dashed #c8dcff", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.02em" },
    rmBtn: { background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "16px", padding: "8px 4px", flexShrink: 0, lineHeight: 1 },
    divider: { border: "none", borderTop: "1px solid #f0f0f0", margin: "24px 0" } as React.CSSProperties,
    sectionTitle: { fontSize: "15px", fontWeight: 700, color: "#111", letterSpacing: "-0.04em", marginBottom: "20px" },
  };

  if (!authed) return (
    <div style={{ ...s.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "40px 48px", width: "340px", boxShadow: "0 4px 24px rgba(0,0,0,.1)" }}>
        <div style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", marginBottom: "6px" }}>Admin</div>
        <div style={{ fontSize: "13px", color: "#bbb", letterSpacing: "-0.02em", marginBottom: "24px" }}>포트폴리오 콘텐츠 편집</div>
        <label style={s.label}>비밀번호</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          style={{ ...s.input, marginBottom: "12px" }} placeholder="••••••••" />
        {msg && <div style={{ fontSize: "12px", color: "#e53e3e", marginBottom: "12px" }}>{msg}</div>}
        <button onClick={login} style={{ ...s.saveBtn, width: "100%", padding: "10px", background: "#111", color: "#fff", borderRadius: "9px" }}>
          로그인
        </button>
      </div>
    </div>
  );

  if (!content) return <div style={{ ...s.wrap, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>불러오는 중...</div>;

  const activeProject = content.projects.find((p) => p.slug === tab);

  return (
    <div style={s.wrap}>
      {/* 상단 바 */}
      <div style={s.topbar}>
        <span style={s.logo}>Admin · 포트폴리오 편집</span>
        {msg && <span style={{ fontSize: "12px", color: msg.startsWith("✓") ? "#4ade80" : "#f87171" }}>{msg}</span>}
        <button onClick={save} disabled={saving} style={s.saveBtn}>{saving ? "저장 중…" : "저장"}</button>
        <button onClick={deploy} disabled={deploying} style={s.deployBtn}>{deploying ? "배포 중…" : "Vercel 배포"}</button>
      </div>

      <div style={s.body}>
        {/* 사이드바 */}
        <div style={s.sidebar}>
          <div style={{ fontSize: "10px", color: "#ccc", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "8px", padding: "0 12px" }}>섹션</div>
          <button style={s.sideItem(tab === "hero")} onClick={() => setTab("hero")}>히어로</button>
          <div style={{ fontSize: "10px", color: "#ccc", letterSpacing: ".06em", textTransform: "uppercase", margin: "16px 0 8px", padding: "0 12px" }}>프로젝트</div>
          {content.projects.map((p) => (
            <button key={p.slug} style={s.sideItem(tab === p.slug)} onClick={() => setTab(p.slug)}>
              {p.title.slice(0, 14)}…
            </button>
          ))}
        </div>

        {/* 메인 편집 영역 */}
        <div style={s.card}>

          {/* ── 히어로 ── */}
          {tab === "hero" && (
            <>
              <div style={s.sectionTitle}>히어로 섹션</div>
              <label style={s.label}>이름</label>
              <input style={s.input} value={content.hero.name} onChange={(e) => setHero("name", e.target.value)} />
              <label style={s.label}>직함</label>
              <input style={s.input} value={content.hero.role} onChange={(e) => setHero("role", e.target.value)} />
              <label style={s.label}>바이오</label>
              <textarea style={s.textarea} rows={3} value={content.hero.bio} onChange={(e) => setHero("bio", e.target.value)} />
              <label style={s.label}>GitHub URL</label>
              <input style={s.input} value={content.hero.github} onChange={(e) => setHero("github", e.target.value)} />
              <label style={s.label}>LinkedIn URL</label>
              <input style={s.input} value={content.hero.linkedin} onChange={(e) => setHero("linkedin", e.target.value)} />
            </>
          )}

          {/* ── 프로젝트 ── */}
          {activeProject && (
            <>
              <div style={s.sectionTitle}>{activeProject.title}</div>

              <label style={s.label}>제목</label>
              <input style={s.input} value={activeProject.title} onChange={(e) => setProject(activeProject.slug, "title", e.target.value)} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={s.label}>기간</label>
                  <input style={s.input} value={activeProject.date} onChange={(e) => setProject(activeProject.slug, "date", e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>카테고리</label>
                  <input style={s.input} value={activeProject.category} onChange={(e) => setProject(activeProject.slug, "category", e.target.value)} />
                </div>
              </div>

              <label style={s.label}>프리뷰 / 설명</label>
              <textarea style={s.textarea} rows={3} value={activeProject.desc} onChange={(e) => { setProject(activeProject.slug, "desc", e.target.value); setProject(activeProject.slug, "preview", e.target.value); }} />

              <hr style={s.divider} />
              <div style={{ ...s.sectionTitle, fontSize: "13px" }}>성과 (불릿)</div>
              {activeProject.outcomes.map((o, i) => (
                <div key={i} style={s.row}>
                  <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={o} onChange={(e) => setOutcome(activeProject.slug, i, e.target.value)} />
                  <button style={s.rmBtn} onClick={() => removeOutcome(activeProject.slug, i)}>×</button>
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addOutcome(activeProject.slug)}>+ 추가</button>

              <hr style={s.divider} />
              <div style={{ ...s.sectionTitle, fontSize: "13px" }}>사용 툴</div>
              {activeProject.tools.map((t, i) => (
                <div key={i} style={s.row}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
                    <button style={{ ...s.rmBtn, fontSize: "11px", padding: "2px 6px", color: i === 0 ? "#e0e0e0" : "#888" }}
                      onClick={() => moveTool(activeProject.slug, i, -1)} disabled={i === 0}>↑</button>
                    <button style={{ ...s.rmBtn, fontSize: "11px", padding: "2px 6px", color: i === activeProject.tools.length - 1 ? "#e0e0e0" : "#888" }}
                      onClick={() => moveTool(activeProject.slug, i, 1)} disabled={i === activeProject.tools.length - 1}>↓</button>
                  </div>
                  <input style={{ ...s.input, marginBottom: 0, width: "140px", flexShrink: 0 }} value={t.name} onChange={(e) => setTool(activeProject.slug, i, "name", e.target.value)} placeholder="툴 이름" />
                  <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={t.desc} onChange={(e) => setTool(activeProject.slug, i, "desc", e.target.value)} placeholder="설명" />
                  <button style={s.rmBtn} onClick={() => removeTool(activeProject.slug, i)}>×</button>
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addTool(activeProject.slug)}>+ 추가</button>

              <hr style={s.divider} />
              <div style={{ ...s.sectionTitle, fontSize: "13px" }}>핵심 인사이트</div>
              <label style={s.label}>인사이트 텍스트</label>
              <textarea style={s.textarea} rows={4} value={activeProject.insight} onChange={(e) => setProject(activeProject.slug, "insight", e.target.value)} />
              <label style={s.label}>마커 하이라이트 구문</label>
              {(activeProject.insightHighlights ?? []).map((h, i) => (
                <div key={i} style={s.row}>
                  <input style={{ ...s.input, marginBottom: 0, flex: 1, background: "#fffef0" }} value={h} onChange={(e) => setHighlight(activeProject.slug, i, e.target.value)} />
                  <button style={s.rmBtn} onClick={() => removeHighlight(activeProject.slug, i)}>×</button>
                </div>
              ))}
              <button style={s.addBtn} onClick={() => addHighlight(activeProject.slug)}>+ 추가</button>

              <hr style={s.divider} />
              {/* ── 섹션 (배경/문제/해결과정/결과 등) ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ ...s.sectionTitle, fontSize: "13px", marginBottom: 0 }}>상세 섹션</div>
                <button style={s.addBtn} onClick={() => addSection(activeProject.slug)}>+ 섹션 추가</button>
              </div>
              {(activeProject.sections ?? []).map((sec, si) => (
                <div key={si} style={{ border: "1px solid #f0f0f0", borderRadius: "10px", padding: "16px", marginBottom: "12px", background: "#fafafa" }}>
                  {/* 섹션 헤더 */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginBottom: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "2px" }}>
                      <button style={{ ...s.rmBtn, fontSize: "11px", padding: "2px 6px", color: si === 0 ? "#e0e0e0" : "#888" }}
                        onClick={() => moveSection(activeProject.slug, si, -1)} disabled={si === 0}>↑</button>
                      <button style={{ ...s.rmBtn, fontSize: "11px", padding: "2px 6px", color: si === (activeProject.sections?.length ?? 0) - 1 ? "#e0e0e0" : "#888" }}
                        onClick={() => moveSection(activeProject.slug, si, 1)} disabled={si === (activeProject.sections?.length ?? 0) - 1}>↓</button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={s.label}>섹션 이름</label>
                      <input
                        style={{ ...s.input, marginBottom: 0, fontWeight: 600 }}
                        value={sec.title}
                        placeholder="배경 / 문제 / 해결 과정 / 결과"
                        onChange={(e) => renameSectionTitle(activeProject.slug, si, e.target.value)}
                      />
                    </div>
                    <button style={{ ...s.rmBtn, color: "#f87171", paddingBottom: "10px" }} onClick={() => removeSection(activeProject.slug, si)}>×</button>
                  </div>

                  {/* 블록 목록 */}
                  {sec.blocks.map((block, bi) => (
                    <div key={bi} style={{ border: "1px dashed #e8e8e8", borderRadius: "8px", padding: "12px", marginBottom: "8px", background: "#fff" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                          <button style={{ ...s.rmBtn, fontSize: "10px", padding: "1px 5px", color: bi === 0 ? "#e0e0e0" : "#888" }}
                            onClick={() => moveBlock(activeProject.slug, si, bi, -1)} disabled={bi === 0}>↑</button>
                          <button style={{ ...s.rmBtn, fontSize: "10px", padding: "1px 5px", color: bi === sec.blocks.length - 1 ? "#e0e0e0" : "#888" }}
                            onClick={() => moveBlock(activeProject.slug, si, bi, 1)} disabled={bi === sec.blocks.length - 1}>↓</button>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", flex: 1,
                          color: block.type === "callout" ? "#1a3fd0" : block.type === "list" ? "#0d7a4e" : block.type === "table" ? "#7c3aed" : "#aaa" }}>
                          {block.type === "text" ? "텍스트" : block.type === "image" ? "이미지" : block.type === "callout" ? "콜아웃" : block.type === "list" ? "넘버링 리스트" : block.type === "table" ? "정의 표" : "코드"}
                        </span>
                        <button style={{ ...s.rmBtn, color: "#f87171", fontSize: "14px" }} onClick={() => removeBlock(activeProject.slug, si, bi)}>×</button>
                      </div>

                      {block.type === "text" && (
                        <textarea
                          style={{ ...s.textarea, marginBottom: 0, minHeight: "80px" }}
                          rows={4}
                          value={block.content ?? ""}
                          placeholder="본문 텍스트 (줄바꿈 지원)"
                          onChange={(e) => setBlock(activeProject.slug, si, bi, { type: "text", content: e.target.value })}
                        />
                      )}
                      {block.type === "list" && (
                        <div>
                          {(block.items ?? []).map((item, ii) => (
                            <div key={ii} style={{ ...s.row, marginBottom: "6px" }}>
                              <span style={{ fontSize: "11px", fontWeight: 700, color: "#2c5cff", background: "#eef2ff", borderRadius: "6px", padding: "4px 8px", flexShrink: 0, alignSelf: "flex-start", marginTop: "8px" }}>{ii + 1}</span>
                              <input
                                style={{ ...s.input, marginBottom: 0, width: "120px", flexShrink: 0 }}
                                value={item.title ?? ""}
                                placeholder="제목 (선택)"
                                onChange={(e) => {
                                  const items = [...(block.items ?? [])];
                                  items[ii] = { ...items[ii], title: e.target.value };
                                  setBlock(activeProject.slug, si, bi, { ...block, items });
                                }}
                              />
                              <input
                                style={{ ...s.input, marginBottom: 0, flex: 1 }}
                                value={item.content}
                                placeholder="내용"
                                onChange={(e) => {
                                  const items = [...(block.items ?? [])];
                                  items[ii] = { ...items[ii], content: e.target.value };
                                  setBlock(activeProject.slug, si, bi, { ...block, items });
                                }}
                              />
                              <button style={s.rmBtn} onClick={() => {
                                const items = (block.items ?? []).filter((_, j) => j !== ii);
                                setBlock(activeProject.slug, si, bi, { ...block, items });
                              }}>×</button>
                            </div>
                          ))}
                          <button style={{ ...s.addBtn, fontSize: "11px", marginTop: "4px" }} onClick={() => {
                            const items = [...(block.items ?? []), { title: "", content: "" }];
                            setBlock(activeProject.slug, si, bi, { ...block, items });
                          }}>+ 항목 추가</button>
                        </div>
                      )}
                      {block.type === "table" && (
                        <div>
                          {(block.rows ?? []).map((row, ri) => (
                            <div key={ri} style={{ ...s.row, marginBottom: "6px" }}>
                              <input
                                style={{ ...s.input, marginBottom: 0, width: "130px", flexShrink: 0, fontFamily: "monospace", fontSize: "12px", color: "#1a3fd0" }}
                                value={row.term}
                                placeholder="Props / States"
                                onChange={(e) => {
                                  const rows = [...(block.rows ?? [])];
                                  rows[ri] = { ...rows[ri], term: e.target.value };
                                  setBlock(activeProject.slug, si, bi, { ...block, rows });
                                }}
                              />
                              <input
                                style={{ ...s.input, marginBottom: 0, flex: 1 }}
                                value={row.desc}
                                placeholder="설명"
                                onChange={(e) => {
                                  const rows = [...(block.rows ?? [])];
                                  rows[ri] = { ...rows[ri], desc: e.target.value };
                                  setBlock(activeProject.slug, si, bi, { ...block, rows });
                                }}
                              />
                              <button style={s.rmBtn} onClick={() => {
                                const rows = (block.rows ?? []).filter((_, j) => j !== ri);
                                setBlock(activeProject.slug, si, bi, { ...block, rows });
                              }}>×</button>
                            </div>
                          ))}
                          <button style={{ ...s.addBtn, fontSize: "11px", marginTop: "4px" }} onClick={() => {
                            const rows = [...(block.rows ?? []), { term: "", desc: "" }];
                            setBlock(activeProject.slug, si, bi, { ...block, rows });
                          }}>+ 행 추가</button>
                        </div>
                      )}
                      {block.type === "callout" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <input
                            style={{ ...s.input, marginBottom: 0, background: "#f0f4ff", borderColor: "#c7d4ff", fontWeight: 600, fontSize: "12px" }}
                            value={block.label ?? ""}
                            placeholder="소제목 (예: 잠깐, 목업이 뭐예요?)"
                            onChange={(e) => setBlock(activeProject.slug, si, bi, { ...block, label: e.target.value })}
                          />
                          <textarea
                            style={{ ...s.textarea, marginBottom: 0, background: "#f0f4ff", borderColor: "#c7d4ff", minHeight: "70px" }}
                            rows={3}
                            value={block.content ?? ""}
                            placeholder="콜아웃 본문..."
                            onChange={(e) => setBlock(activeProject.slug, si, bi, { ...block, content: e.target.value })}
                          />
                        </div>
                      )}
                      {block.type === "image" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={block.src ?? ""} placeholder="/images/프로젝트/파일명.png" onChange={(e) => setBlock(activeProject.slug, si, bi, { ...block, src: e.target.value })} />
                            <label style={{ ...s.addBtn, cursor: "pointer", display: "inline-block", whiteSpace: "nowrap" }}>
                              파일 선택
                              <input type="file" accept="image/*" style={{ display: "none" }}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const fd = new FormData();
                                  fd.append("file", file);
                                  fd.append("slug", activeProject.slug);
                                  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                                  const data = await res.json();
                                  if (data.src) setBlock(activeProject.slug, si, bi, { ...block, src: data.src });
                                }}
                              />
                            </label>
                          </div>
                          {block.src && (
                            <img src={block.src} alt="" style={{ maxHeight: "120px", borderRadius: "6px", objectFit: "cover", border: "1px solid #f0f0f0" }} />
                          )}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <input style={{ ...s.input, marginBottom: 0 }} value={block.alt ?? ""} placeholder="alt 텍스트" onChange={(e) => setBlock(activeProject.slug, si, bi, { ...block, alt: e.target.value })} />
                            <input style={{ ...s.input, marginBottom: 0 }} value={block.caption ?? ""} placeholder="캡션 (선택)" onChange={(e) => setBlock(activeProject.slug, si, bi, { ...block, caption: e.target.value })} />
                          </div>
                        </div>
                      )}
                      {block.type === "code" && (
                        <div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                            <input style={{ ...s.input, marginBottom: 0 }} value={block.filename ?? ""} placeholder="파일명 (예: example.py)" onChange={(e) => setBlock(activeProject.slug, si, bi, { ...block, filename: e.target.value })} />
                            <input style={{ ...s.input, marginBottom: 0 }} value={block.lang ?? ""} placeholder="python / tsx / bash" onChange={(e) => setBlock(activeProject.slug, si, bi, { ...block, lang: e.target.value })} />
                          </div>
                          <textarea
                            style={{ ...s.textarea, marginBottom: 0, fontFamily: "'SF Mono', monospace", fontSize: "12px", background: "#f9f9f9" }}
                            rows={6}
                            value={block.code}
                            onChange={(e) => setBlock(activeProject.slug, si, bi, { ...block, code: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 블록 추가 */}
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                    <button style={{ ...s.addBtn, fontSize: "11px" }} onClick={() => addBlock(activeProject.slug, si, "text")}>+ 텍스트</button>
                    <button style={{ ...s.addBtn, fontSize: "11px" }} onClick={() => addBlock(activeProject.slug, si, "callout")}>+ 콜아웃</button>
                    <button style={{ ...s.addBtn, fontSize: "11px" }} onClick={() => addBlock(activeProject.slug, si, "list")}>+ 넘버링</button>
                    <button style={{ ...s.addBtn, fontSize: "11px" }} onClick={() => addBlock(activeProject.slug, si, "table")}>+ 정의 표</button>
                    <button style={{ ...s.addBtn, fontSize: "11px" }} onClick={() => addBlock(activeProject.slug, si, "image")}>+ 이미지</button>
                    <button style={{ ...s.addBtn, fontSize: "11px" }} onClick={() => addBlock(activeProject.slug, si, "code")}>+ 코드</button>
                  </div>
                </div>
              ))}

              <hr style={s.divider} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={s.label}>GitHub URL</label>
                  <input style={s.input} value={activeProject.github_url} onChange={(e) => setProject(activeProject.slug, "github_url", e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>다운로드 URL</label>
                  <input style={s.input} value={activeProject.download_url} onChange={(e) => setProject(activeProject.slug, "download_url", e.target.value)} />
                </div>
              </div>

              <hr style={s.divider} />
              <div style={{ ...s.sectionTitle, fontSize: "13px" }}>코드 스니펫 (선택)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={s.label}>파일명</label>
                  <input style={s.input}
                    value={activeProject.codeSnippet?.filename ?? ""}
                    placeholder="generate-requirements.py"
                    onChange={(e) => setProject(activeProject.slug, "codeSnippet", {
                      ...(activeProject.codeSnippet ?? {}), filename: e.target.value
                    })} />
                </div>
                <div>
                  <label style={s.label}>언어</label>
                  <input style={s.input}
                    value={activeProject.codeSnippet?.lang ?? ""}
                    placeholder="python / tsx / bash"
                    onChange={(e) => setProject(activeProject.slug, "codeSnippet", {
                      ...(activeProject.codeSnippet ?? {}), lang: e.target.value
                    })} />
                </div>
              </div>
              <label style={s.label}>코드</label>
              <textarea
                style={{ ...s.textarea, fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "12px", background: "#f9f9f9" }}
                rows={10}
                value={activeProject.codeSnippet?.code ?? ""}
                placeholder="코드를 입력하세요..."
                onChange={(e) => setProject(activeProject.slug, "codeSnippet", {
                  ...(activeProject.codeSnippet ?? {}), code: e.target.value
                })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
