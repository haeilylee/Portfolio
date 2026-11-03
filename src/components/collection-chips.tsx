"use client";

import { COLLECTIONS, type CollectionId } from "@/lib/collections";

export interface CollectionChipsProps {
  value?: CollectionId;
  onChange: (next?: CollectionId) => void;
}

/**
 * Admin 카테고리(상위 분류) 선택 칩. Velog 태그 입력처럼 필드 사이에서 칩을 눌러 고른다.
 * 선택된 칩을 다시 누르면 해제(미지정).
 */
export default function CollectionChips({ value, onChange }: CollectionChipsProps) {
  const current = COLLECTIONS.find((c) => c.id === value);
  return (
    <div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        {COLLECTIONS.map((c) => {
          const active = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              className="chip"
              data-active={active}
              aria-pressed={active}
              style={{ "--chip-color": c.color } as React.CSSProperties}
              onClick={() => onChange(active ? undefined : c.id)}
            >
              {active && <span aria-hidden>✓</span>}
              {c.title}
            </button>
          );
        })}
        <span style={{ fontSize: "11px", color: "#bbb", letterSpacing: "-0.01em", marginLeft: "4px" }}>
          {current ? "다시 누르면 해제" : "콘텐츠당 하나만 선택"}
        </span>
      </div>
      <div style={{ fontSize: "12px", color: current ? "#666" : "#ccc", marginTop: "8px", letterSpacing: "-0.02em", lineHeight: 1.5, minHeight: "18px" }}>
        {current ? current.subtitle : "미지정 — 목록에는 그대로 노출되고, 시리즈 묶음에서는 Others로 표시돼요"}
      </div>
    </div>
  );
}
