"use client";

import { COLLECTIONS } from "@/lib/collections";
import type { CollectionSelectorProps } from "../admin-shell";

/**
 * C. Dropdown + Preview — 셀렉트로 고르면 아래에 Brunchbook 연재 소개처럼
 * 제목·부제가 그대로 미리 보인다. 배포 화면에서 어떻게 묶일지 확인하는 용도.
 */
export default function DropdownPreview({ value, onChange }: CollectionSelectorProps) {
  const current = COLLECTIONS.find((c) => c.id === value);
  return (
    <div className="pv-admin-2col" style={{ alignItems: "start" }}>
      <div>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value ? (e.target.value as typeof value) : undefined)}
          style={{
            width: "100%", border: "1px solid #e8e8e8", borderRadius: "8px", padding: "9px 12px",
            fontSize: "13px", color: value ? "#111" : "#999", letterSpacing: "-0.02em", outline: "none",
            fontFamily: "inherit", background: "#fff", cursor: "pointer",
          }}
        >
          <option value="">선택 안 함 (미지정)</option>
          {COLLECTIONS.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <div style={{ fontSize: "11px", color: "#bbb", marginTop: "8px", letterSpacing: "-0.01em", lineHeight: 1.5 }}>
          배포 화면에서 이 프로젝트가 어떤 시리즈로 묶일지 오른쪽에서 미리 확인해요.
        </div>
      </div>

      {/* 미리보기 카드 */}
      <div
        style={{
          borderRadius: "10px",
          padding: "16px 18px",
          background: current ? current.soft : "#fafafa",
          border: current ? "1px solid transparent" : "1px dashed #e0e0e0",
          transition: "background 0.2s",
          minHeight: "92px",
        }}
      >
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: current ? current.color : "#bbb", marginBottom: "6px" }}>
          {current ? "Collection" : "Preview"}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.05em", color: current ? "#111" : "#ccc", lineHeight: 1.25, marginBottom: "4px" }}>
          {current ? current.title : "카테고리를 선택하면"}
        </div>
        <div style={{ fontSize: "12px", color: current ? "#555" : "#ccc", letterSpacing: "-0.02em", lineHeight: 1.6 }}>
          {current ? current.subtitle : "제목과 부제가 여기에 보여요"}
        </div>
      </div>
    </div>
  );
}
