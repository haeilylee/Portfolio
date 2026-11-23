import Link from "next/link";
import { VARIANTS } from "./_components/variants";

export default function PreviewIndex() {
  return (
    <div className="pv-container" style={{ padding: "48px 56px 0" }}>
      <div className="st-eyebrow">Preview · Dev only</div>
      <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", margin: "0 0 8px" }}>시안</h1>
      <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, letterSpacing: "-0.025em", maxWidth: "560px", margin: "0 0 32px" }}>
        More: 상세 하단 '다른 프로젝트 보러가기' 3안. Story(홈 자소서형)는 보류 중.
      </p>
      <div className="pv-index-grid">
        {VARIANTS.map((v) => (
          <Link key={v.id} href={v.href} className="pv-index-card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span className="pv-ref-tag">{v.group} {v.letter}</span>
              <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.04em", color: "#111" }}>{v.name}</span>
            </div>
            <div style={{ fontSize: "11px", color: "#aaa" }}>ref · {v.ref}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
