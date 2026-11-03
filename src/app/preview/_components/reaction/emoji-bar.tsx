"use client";

import { useReactions, useLocalFlag } from "./use-reactions";

/**
 * Reaction B — GitHub/Notion 형 이모지 반응 바.
 * 본문 끝에 종류별 카운트가 보이고, 하나를 고르면 토글된다(1인 1종류 1회).
 */
const EMOJIS: { key: string; glyph: string; label: string }[] = [
  { key: "like", glyph: "👍", label: "좋아요" },
  { key: "insight", glyph: "💡", label: "인사이트" },
  { key: "fire", glyph: "🔥", label: "멋져요" },
  { key: "clap", glyph: "👏", label: "박수" },
  { key: "eyes", glyph: "👀", label: "더 보고 싶어요" },
];

export default function EmojiBar({ slug }: { slug: string }) {
  const { data, post, setData } = useReactions(slug);
  const [mine, setMine] = useLocalFlag(`pv-emoji-${slug}`);

  async function toggle(key: string) {
    const prev = mine;
    // 낙관적 업데이트
    setData((d) => {
      const emoji = { ...d.emoji };
      if (prev) emoji[prev] = Math.max(0, (emoji[prev] ?? 0) - 1);
      if (prev !== key) emoji[key] = (emoji[key] ?? 0) + 1;
      return { ...d, emoji };
    });
    setMine(prev === key ? null : key);
    if (prev) await post({ action: "emoji", key: prev, delta: -1 });
    if (prev !== key) await post({ action: "emoji", key, delta: 1 });
  }

  const total = Object.values(data.emoji).reduce((a, b) => a + b, 0);

  return (
    <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "28px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", letterSpacing: "-0.03em" }}>이 글, 어땠나요?</span>
        <span style={{ fontSize: "11px", color: "#bbb" }}>{total}개의 반응</span>
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {EMOJIS.map((e) => {
          const n = data.emoji[e.key] ?? 0;
          const active = mine === e.key;
          return (
            <button
              key={e.key}
              className="pv-react-btn"
              data-active={active}
              onClick={() => toggle(e.key)}
              aria-pressed={active}
              title={e.label}
            >
              <span style={{ fontSize: "15px" }}>{e.glyph}</span>
              {n > 0 && <span style={{ fontSize: "12px", fontWeight: 600 }}>{n}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: "11px", color: "#bbb", marginTop: "10px", letterSpacing: "-0.01em" }}>
        {mine ? `${EMOJIS.find((e) => e.key === mine)?.label}로 반응했어요 · 다시 누르면 취소` : "한 가지 반응을 고를 수 있어요"}
      </div>
    </div>
  );
}
