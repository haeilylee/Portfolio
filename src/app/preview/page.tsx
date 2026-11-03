import Link from "next/link";
import { VARIANTS, GROUP_LABEL } from "./_components/variants";
import { COLLECTIONS } from "@/lib/collections";
import { readContentLive } from "@/lib/content-live";

export default async function PreviewIndex() {
  const { projects } = await readContentLive();
  const groups = (["admin", "public", "reaction"] as const).map((g) => ({
    group: g,
    items: VARIANTS.filter((v) => v.group === g),
  }));

  return (
    <div className="pv-container" style={{ padding: "48px 56px 0" }}>
      <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#bbb", marginBottom: "10px" }}>
        Preview · Dev only
      </div>
      <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.05em", color: "#111", margin: "0 0 8px" }}>
        Category &amp; Reaction 시안
      </h1>
      <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, letterSpacing: "-0.025em", maxWidth: "560px", margin: "0 0 40px" }}>
        Admin에서 카테고리를 지정·저장하면 Public 시안 3개에 모두 반영돼요. 리액션 시안은 개발용 로컬 저장소를 써요.
        각 시안 상단에서 참고한 레퍼런스를 확인할 수 있어요.
      </p>

      {/* 현재 분류 상태 */}
      <div style={{ border: "1px solid #ececec", borderRadius: "12px", padding: "16px 20px", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "#999", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "10px" }}>
          현재 카테고리 지정 상태 (content.json)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {projects.map((p) => {
            const c = COLLECTIONS.find((x) => x.id === p.collection);
            return (
              <div key={p.slug} style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "13px", letterSpacing: "-0.02em" }}>
                <span style={{ color: "#111", fontWeight: 600, minWidth: "140px" }}>{p.slug}</span>
                <span
                  className="pv-chip"
                  data-tone="soft"
                  data-muted={!c}
                  style={c ? ({ "--chip-color": c.color, "--chip-soft": c.soft } as React.CSSProperties) : undefined}
                >
                  {c ? c.title : "미지정"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {groups.map(({ group, items }) => (
        <section key={group} style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.04em", color: "#111", margin: 0 }}>
              {GROUP_LABEL[group]}
            </h2>
            <span style={{ fontSize: "12px", color: "#bbb" }}>
              {group === "admin" && "카테고리 지정 UI"}
              {group === "public" && "카테고리 탐색 UI"}
              {group === "reaction" && "좋아요 · 댓글 UI"}
            </span>
          </div>
          <div className="pv-index-grid">
            {items.map((v) => (
              <Link key={v.id} href={v.href} className="pv-index-card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span className="pv-ref-tag">{v.letter}</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.04em", color: "#111" }}>{v.name}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, letterSpacing: "-0.02em", marginBottom: "10px" }}>
                  {v.summary}
                </div>
                <div style={{ fontSize: "11px", color: "#aaa", letterSpacing: "-0.01em" }}>
                  ref · {v.reference.site} — {v.reference.pattern}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
