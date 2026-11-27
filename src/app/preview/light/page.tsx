import Link from "next/link";
import { projects } from "@/lib/projects";
import { plainTitle } from "../_shared/story";

const VARIANTS = [{ k: "a", t: "A · 토스 세션 방식", d: "가운데 고정 레이아웃 · 디졸브 · 이미지 스프링 모션(토스 실측값) · 진행바 · 챕터 메뉴" }];

/** 상세 시안 목록 */
export default function PreviewLightIndex() {
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(120% 65% at 50% 120%, #d6e4ff 0%, #ecf2ff 38%, #ffffff 72%)", padding: "72px 24px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ fontSize: 13, color: "#8b95a1", marginBottom: 6 }}>상세 인터랙션 시안 · 라이트</div>
        <h1 style={{ margin: "0 0 32px", fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: "#191f28" }}>상세 페이지</h1>
        {VARIANTS.map((v) => (
          <div key={v.k} style={{ padding: "20px 0", borderTop: "1px solid #eef0f3" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#191f28" }}>
              {v.t}
            </div>
            <div style={{ fontSize: 14, color: "#6b7684", margin: "4px 0 12px" }}>{v.d}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {projects.map((p) => (
                <Link key={p.slug} href={`/preview/light/${v.k}/${p.slug}`} style={{ fontSize: 13, color: "#3182f6", background: "#fff", padding: "7px 14px", borderRadius: 99, textDecoration: "none", boxShadow: "0 2px 8px rgba(30,40,80,.06)" }}>
                  {plainTitle(p.title)} →
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
