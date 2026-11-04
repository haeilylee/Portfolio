"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { getVisitorId } from "@/lib/visitor";
import { avatarColor, timeAgo } from "@/lib/comment-format";

type Comment = { id: string; name: string; text: string; at: string };

const NAME_KEY = "comment-name";
const TEXT_MAX = 300;

/**
 * 상세 페이지 본문 끝 댓글 — 닉네임(선택) + 한 줄.
 * 저장소가 설정되지 않았으면(503) 영역 전체를 그리지 않는다.
 */
export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [hidden, setHidden] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try { setName(localStorage.getItem(NAME_KEY) ?? ""); } catch {}
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setComments(d.comments))
      .catch(() => setHidden(true));
  }, [slug]);

  async function submit() {
    const visitor = getVisitorId();
    if (!text.trim() || !visitor) return;
    setSending(true); setErr("");
    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, visitor, name, text }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error ?? "등록하지 못했어요."); return; }
      setComments((prev) => [d.comment, ...(prev ?? [])]);
      setText("");
      try { if (name.trim()) localStorage.setItem(NAME_KEY, name.trim()); } catch {}
      track("comment", { slug });
    } catch {
      setErr("등록하지 못했어요.");
    } finally {
      setSending(false);
    }
  }

  if (hidden) return null;

  return (
    <section className="comments" aria-label="댓글">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.045em", color: "#111", margin: 0 }}>
          댓글 <span style={{ color: "#bbb", fontWeight: 500, fontSize: "14px" }}>{comments?.length ?? 0}</span>
        </h2>
        <span style={{ fontSize: "11px", color: "#bbb" }}>로그인 없이 남길 수 있어요</span>
      </div>

      <div style={{ background: "#f9fafb", borderRadius: "14px", padding: "14px" }}>
        <input
          className="comment-input"
          placeholder="닉네임 (비워 두면 익명)"
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          style={{ maxWidth: "220px", marginBottom: "8px" }}
        />
        <textarea
          className="comment-input"
          rows={3}
          placeholder="읽고 떠오른 생각이나 질문을 남겨 주세요"
          value={text}
          maxLength={TEXT_MAX}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit(); }}
          style={{ resize: "vertical", lineHeight: 1.7 }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
          <span style={{ fontSize: "11px", color: err ? "#e53e3e" : "#bbb" }}>{err || `${text.length}/${TEXT_MAX}`}</span>
          <button className="comment-submit" onClick={submit} disabled={sending || !text.trim()}>
            {sending ? "등록 중…" : "댓글 남기기"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: "8px" }}>
        {comments === null && <div style={{ fontSize: "12px", color: "#bbb", padding: "16px 0" }}>불러오는 중…</div>}
        {comments?.length === 0 && (
          <div style={{ fontSize: "13px", color: "#bbb", padding: "24px 0", textAlign: "center" }}>첫 번째 댓글을 남겨 보세요.</div>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="comment-item">
            <span className="comment-avatar" style={{ background: avatarColor(c.name) }}>{c.name.slice(0, 1).toUpperCase()}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "baseline", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", letterSpacing: "-0.03em" }}>{c.name}</span>
                <span style={{ fontSize: "11px", color: "#bbb" }}>{timeAgo(c.at)}</span>
              </div>
              <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.7, letterSpacing: "-0.025em", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
