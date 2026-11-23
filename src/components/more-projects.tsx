import Link from "next/link";
import contentData from "@/data/content.json";
import type { Project } from "@/lib/projects";
import { projects } from "@/lib/projects";
import { gradientMap } from "@/lib/category-styles";
import { getCollection } from "@/lib/collections";
import { stripTitleBreaks } from "@/lib/format-title";

export type MoreVariant = "next" | "grid" | "list";

/** 상세 본문 끝 '다른 프로젝트 보러가기'. 현재 글을 뺀 공개 프로젝트를 노출 순서대로. 초안은 '준비 중'으로(링크 없음). */
export default function MoreProjects({ current, variant, showDrafts = true }: { current: string; variant: MoreVariant; showDrafts?: boolean }) {
  const all = contentData.projects as Project[];
  const others = all.filter((p) => p.slug !== current && (showDrafts || !p.draft));
  // 노출 순서상 바로 다음 공개 프로젝트 (마지막이면 처음으로)
  const order = projects.map((p) => p.slug);
  const at = order.indexOf(current);
  const next = projects[(at + 1) % projects.length];
  const prev = projects[(at - 1 + projects.length) % projects.length];

  if (variant === "next") return <NextPager prev={prev?.slug !== current ? prev : undefined} next={next?.slug !== current ? next : undefined} />;
  if (variant === "grid") return <Grid items={others} />;
  return <List items={others} />;
}

function Thumb({ p, ratio = "16/10" }: { p: Project; ratio?: string }) {
  return (
    <div className="mp-thumb" style={{ aspectRatio: ratio, background: p.thumbnail ? "#f2f2f2" : gradientMap[p.catClass] ?? "#e8e8e8" }} data-draft={p.draft}>
      {p.thumbnail && <img src={p.thumbnail} alt={stripTitleBreaks(p.title)} />}
    </div>
  );
}

function Eyebrow({ p }: { p: Project }) {
  const c = getCollection(p.collection);
  return (
    <div className="mp-eyebrow">
      {c && <span style={{ color: p.draft ? "#bbb" : c.color }}>{c.title}</span>}
      {c && <span className="mp-dot">·</span>}
      <span>{p.category}</span>
      {p.draft && <span className="mp-soon">준비 중</span>}
    </div>
  );
}

/** A — 이전/다음 페이저. 다음 프로젝트를 크게, 이전은 작게 */
function NextPager({ prev, next }: { prev?: Project; next?: Project }) {
  if (!next) return null;
  return (
    <section className="mp" data-v="next">
      <div className="mp-head">다른 프로젝트 보러가기</div>
      <Link href={`/projects/${next.slug}`} className="mp-next">
        <div className="mp-next-body">
          <div className="mp-next-label">다음 프로젝트 →</div>
          <Eyebrow p={next} />
          <div className="mp-next-title">{stripTitleBreaks(next.title)}</div>
        </div>
        <div className="mp-next-thumb"><Thumb p={next} ratio="4/3" /></div>
      </Link>
      <div className="mp-pager">
        {prev && prev.slug !== next.slug ? (
          <Link href={`/projects/${prev.slug}`} className="mp-pager-link">← {stripTitleBreaks(prev.title)}</Link>
        ) : <span />}
        <Link href="/" className="mp-pager-link" data-strong>모든 프로젝트</Link>
      </div>
    </section>
  );
}

/** B — 썸네일 카드 그리드 */
function Grid({ items }: { items: Project[] }) {
  return (
    <section className="mp" data-v="grid">
      <div className="mp-head-row">
        <div className="mp-head">다른 프로젝트 보러가기</div>
        <Link href="/" className="mp-all">전체 보기 →</Link>
      </div>
      <div className="mp-grid">
        {items.slice(0, 3).map((p) => {
          const inner = (
            <>
              <Thumb p={p} />
              <Eyebrow p={p} />
              <div className="mp-card-title">{stripTitleBreaks(p.title)}</div>
            </>
          );
          return p.draft
            ? <div key={p.slug} className="mp-card" data-draft>{inner}</div>
            : <Link key={p.slug} href={`/projects/${p.slug}`} className="mp-card">{inner}</Link>;
        })}
      </div>
    </section>
  );
}

/** C — 번호 붙은 컴팩트 리스트 */
function List({ items }: { items: Project[] }) {
  return (
    <section className="mp" data-v="list">
      <div className="mp-head-row">
        <div className="mp-head">다른 프로젝트 보러가기</div>
        <Link href="/" className="mp-all">모든 프로젝트 →</Link>
      </div>
      <ol className="mp-list">
        {items.map((p, i) => {
          const inner = (
            <>
              <span className="mp-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="mp-list-thumb"><Thumb p={p} ratio="4/3" /></span>
              <span className="mp-list-body">
                <Eyebrow p={p} />
                <span className="mp-list-title">{stripTitleBreaks(p.title)}</span>
              </span>
              <span className="mp-arrow">{p.draft ? "" : "→"}</span>
            </>
          );
          return (
            <li key={p.slug}>
              {p.draft ? <div className="mp-row" data-draft>{inner}</div> : <Link href={`/projects/${p.slug}`} className="mp-row">{inner}</Link>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
