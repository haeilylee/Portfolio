"use client";

import { COLLECTIONS } from "@/lib/collections";
import type { CollectionSelectorProps } from "../admin-shell";

/**
 * B. Segmented Selector — 두 카테고리를 좌우로 나란히 두고 하나를 고른다.
 * 선택된 쪽은 흰 배경으로 들어올리고, 제목 밑에 부제까지 보여 차이를 바로 읽게 한다.
 */
export default function Segmented({ value, onChange }: CollectionSelectorProps) {
  return (
    <div>
      <div className="pv-seg" role="radiogroup" aria-label="카테고리">
        {COLLECTIONS.map((c) => {
          const active = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={active}
              className="pv-seg-item"
              data-active={active}
              onClick={() => onChange(c.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span
                  style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: active ? c.color : "#d0d0d0",
                    transition: "background 0.15s",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "13px", fontWeight: active ? 700 : 500, color: active ? "#111" : "#888", letterSpacing: "-0.03em" }}>
                  {c.title}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: active ? "#666" : "#bbb", letterSpacing: "-0.02em", lineHeight: 1.5, paddingLeft: "16px" }}>
                {c.subtitle}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
        <span style={{ fontSize: "11px", color: "#bbb", letterSpacing: "-0.01em" }}>
          {value ? "선택됨" : "미지정 — 목록에는 그대로 노출돼요"}
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            style={{ fontSize: "11px", color: "#999", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: "2px", padding: 0 }}
          >
            선택 해제
          </button>
        )}
      </div>
    </div>
  );
}
