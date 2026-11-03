"use client";

import { useState } from "react";
import { useReactions, useLocalFlag } from "./use-reactions";

/**
 * Reaction C — Velog 형 방명록 댓글.
 * 닉네임 + 한 줄 댓글. 로그인 없이 남길 수 있고, 닉네임은 브라우저가 기억한다.
 * 운영에서는 스팸 방지(길이 제한·속도 제한·간단한 검증)가 필요하다.
 */
const COLORS = ["#7031d4", "#2d5cd8", "#168f52", "#c76a12", "#d63a5a"];
function avatarColor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[h % COLORS.length];
}
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export default function Guestbook({ slug }: { slug: string }) {
  const { data, post, loading } = useReactions(slug);
  const [savedName, setSavedName] = useLocalFlag("pv-guest-name");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const displayName = name || savedName || "";

  async function submit() {
    if (!text.trim()) { setErr("댓글 내용을 입력해 주세요."); return; }
    setSending(true); setErr("");
    const res = await post({ action: "comment", name: displayName, text });
    setSending(false);
    if (res.error) { setErr(res.error); return; }
    if (displayName) setSavedName(displayName);
    setText("");
  }

  return (
    <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "28px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#111", letterSpacing: "-0.04em" }}>
          방명록 <span style={{ color: "#bbb", fontWeight: 500, fontSize: "13px" }}>{data.comments.length}</span>
        </span>
        <span style={{ fontSize: "11px", color: "#bbb" }}>로그인 없이 남길 수 있어요</span>
      </div>

      {/* 입력 */}
      <div style={{ background: "#fafafa", borderRadius: "12px", padding: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "8px", marginBottom: "8px" }}>
          <input
            className="pv-input"
            placeholder="닉네임 (선택)"
            value={displayName}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
          <div style={{ fontSize: "11px", color: "#bbb", alignSelf: "center", letterSpacing: "-0.01em" }}>
            {savedName ? "지난번 닉네임을 기억했어요" : "비워 두면 '익명'으로 남아요"}
          </div>
        </div>
        <textarea
          className="pv-input"
          rows={3}
          placeholder="읽고 떠오른 생각이나 질문을 남겨 주세요"
          value={text}
          maxLength={300}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit(); }}
          style={{ resize: "vertical", lineHeight: 1.7 }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
          <span style={{ fontSize: "11px", color: err ? "#e53e3e" : "#bbb" }}>{err || `${text.length}/300 · ⌘+Enter로 등록`}</span>
          <button
            onClick={submit}
            disabled={sending || !text.trim()}
            style={{ marginLeft: "auto", background: "#111", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: sending || !text.trim() ? 0.4 : 1 }}
          >
            {sending ? "등록 중…" : "댓글 남기기"}
          </button>
        </div>
      </div>

      {/* 목록 */}
      <div style={{ marginTop: "12px" }}>
        {loading && <div style={{ fontSize: "12px", color: "#bbb", padding: "16px 0" }}>불러오는 중…</div>}
        {!loading && data.comments.length === 0 && (
          <div style={{ fontSize: "13px", color: "#bbb", padding: "24px 0", textAlign: "center" }}>첫 번째 댓글을 남겨 보세요.</div>
        )}
        {data.comments.map((c) => (
          <div key={c.id} className="pv-comment">
            <div className="pv-avatar" style={{ background: avatarColor(c.name) }}>{c.name.slice(0, 1).toUpperCase()}</div>
            <div>
              <div style={{ display: "flex", gap: "8px", alignItems: "baseline", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", letterSpacing: "-0.03em" }}>{c.name}</span>
                <span style={{ fontSize: "11px", color: "#bbb" }}>{timeAgo(c.at)}</span>
              </div>
              <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.7, letterSpacing: "-0.025em", margin: 0, whiteSpace: "pre-wrap" }}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
