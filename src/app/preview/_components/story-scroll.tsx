"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "./lang";
import { STORIES, type Story } from "./story-data";

export type StackMode = "expand" | "deck" | "rail" | "toc";

type Active = { story: string; beat: number };

/**
 * 좌: 짧은 단락 / 우: 프로젝트 카드 스택(sticky).
 * 처음엔 카드가 모두 나열돼 있고, 읽는 단락에 맞는 카드가 앵커링된다. 단락마다 카드 안 이미지가 바뀐다.
 *  - expand: 활성 카드가 펼쳐지고 나머지는 얇은 줄로 접힘
 *  - deck:   카드가 겹쳐 쌓인 덱. 활성 카드가 맨 앞으로 나오고 나머지는 뒤로 밀림
 *  - rail:   세로 레일 위에 카드가 줄지어 있고, 활성 카드만 또렷해지며 레일이 채워짐
 */
export default function StoryScroll({ mode, stories = STORIES }: { mode: StackMode; stories?: Story[] }) {
  const t = useT();
  const [active, setActive] = useState<Active>({ story: stories[0].id, beat: 0 });
  const anchors = useRef<HTMLElement[]>([]);
  const cardStories = stories.filter((s) => !s.noCard);

  useEffect(() => {
    let raf = 0;
    const pick = () => {
      raf = 0;
      const line = window.innerHeight * 0.45;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const el of anchors.current) {
        const r = el.getBoundingClientRect();
        const dist = r.top <= line ? line - r.top : r.top - line + 100000;
        if (dist < bestDist) { bestDist = dist; best = el; }
      }
      if (best) setActive({ story: best.dataset.story!, beat: Number(best.dataset.beat) });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [stories]);

  return (
    <div className="ss-layout" data-mode={mode}>
      {/* 왼쪽: 글 */}
      <div className="ss-prose">
        {stories.map((s) => (
          <section key={s.id} className="ss-chapter" id={`story-${s.id}`} data-active={active.story === s.id}>
            <div className="ss-chapter-head">
              <span className="ss-no">{s.no}</span>
              <h2 className="ss-heading">{t(s.heading)}</h2>
              {s.sample && <span className="ss-sample">{t({ ko: "예시", en: "sample" })}</span>}
            </div>
            {s.beats.map((b, i) => (
              <div key={i} className="ss-beat" data-active={active.story === s.id && active.beat === i}>
                {/* 모바일: 단락 위에 해당 이미지 */}
                {(b.image || i === 0) && (
                  <figure className="ss-inline">
                    <img src={b.image ?? s.cover} alt="" data-draft={s.draft} />
                    {b.caption && <figcaption>{t(b.caption)}</figcaption>}
                  </figure>
                )}
                <p
                  className="ss-p"
                  data-story={s.id}
                  data-beat={i}
                  ref={(el) => { if (el && !anchors.current.includes(el)) anchors.current.push(el); }}
                >
                  {t(b.text)}
                </p>
              </div>
            ))}
            {s.href && (
              <Link href={s.href} className="ss-more">{t({ ko: "프로젝트 자세히 읽기", en: "Read the full project" })} →</Link>
            )}
          </section>
        ))}
      </div>

      {/* 오른쪽: 목차 (toc 모드) — 처음부터 전체 목차가 보이고, 읽는 줄만 한 줄 하이라이트 */}
      {mode === "toc" && (
        <aside className="ss-stack-wrap">
          <nav className="ss-toc" aria-label="story contents">
            <div className="ss-toc-head">{t({ ko: "목차", en: "Contents" })}</div>
            {stories.map((s) => (
              <div key={s.id} className="ss-toc-group" data-active={active.story === s.id}>
                <a href={`#story-${s.id}`} className="ss-toc-item" data-active={active.story === s.id && (active.beat === 0 || s.beats.length === 1)}>
                  <span className="ss-toc-no">{s.no}</span>
                  <span className="ss-toc-title">{t(s.heading)}</span>
                </a>
                {s.beats.length > 1 && s.beats.map((b, i) => (
                  b.caption && (
                    <a key={i} href={`#story-${s.id}`} className="ss-toc-sub" data-active={active.story === s.id && active.beat === i}>
                      {t(b.caption)}
                    </a>
                  )
                ))}
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* 오른쪽: 카드 스택 */}
      {mode !== "toc" && (
      <aside className="ss-stack-wrap">
        <div className="ss-stack" data-mode={mode} data-idle={!cardStories.some((x) => x.id === active.story)}>
          {cardStories.map((s, idx) => {
            const isActive = active.story === s.id;
            const activeIdx = cardStories.findIndex((x) => x.id === active.story);
            const beat = isActive ? s.beats[active.beat] : undefined;
            const img = beat?.image ?? s.cover;
            return (
              <Card
                key={s.id}
                s={s}
                img={img}
                caption={beat?.caption ? t(beat.caption) : undefined}
                active={isActive}
                order={idx - activeIdx}
                mode={mode}
                index={idx}
              />
            );
          })}
          {mode === "rail" && (
            <div className="ss-rail" aria-hidden>
              <span className="ss-rail-fill" style={{ height: `${(Math.max(0, cardStories.findIndex((x) => x.id === active.story) + 1) / cardStories.length) * 100}%` }} />
            </div>
          )}
        </div>
      </aside>
      )}
    </div>
  );
}

function Card({ s, img, caption, active, order, mode, index }: { s: Story; img: string; caption?: string; active: boolean; order: number; mode: StackMode; index: number }) {
  const t = useT();
  const inner = (
    <>
      <div className="ss-card-img" data-draft={s.draft}>
        <img key={img} src={img} alt="" className="ss-card-photo" />
      </div>
      <div className="ss-card-body">
        <div className="ss-card-label">{t(s.label)}</div>
        <div className="ss-card-title">{t(s.title)}</div>
        {caption && <div className="ss-card-cap">{caption}</div>}
        {s.stat && (
          <div className="ss-card-stat">
            <Counter value={s.stat.value} run={active} /> <span>{t(s.stat.label)}</span>
          </div>
        )}
        {s.href && <div className="ss-card-link">{t({ ko: "자세히 보기", en: "Open project" })} ↗</div>}
      </div>
      {/* 접힌 상태(expand 모드)용 한 줄 */}
      <div className="ss-card-mini">
        <span className="ss-card-mini-no">{s.no}</span>
        <span className="ss-card-mini-title">{t(s.title)}</span>
      </div>
    </>
  );
  const style = { "--order": Math.abs(order), "--index": index } as React.CSSProperties;
  const rel = order < 0 ? "past" : order > 0 ? "next" : "active";
  const cls = "ss-card";
  return s.href ? (
    <Link href={s.href} className={cls} data-active={active} data-rel={rel} data-mode={mode} data-draft={s.draft} style={style}>{inner}</Link>
  ) : (
    <div className={cls} data-active={active} data-rel={rel} data-mode={mode} data-draft={s.draft} style={style}>{inner}</div>
  );
}

/** "30 → 3", "50 / 5,000" 같은 수치의 숫자만 카운트업 */
function Counter({ value, run }: { value: string; run: boolean }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!run) return;
    const nums = value.match(/\d[\d,]*/g);
    if (!nums) return;
    const targets = nums.map((n) => Number(n.replace(/,/g, "")));
    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      let i = 0;
      setShown(value.replace(/\d[\d,]*/g, () => Math.round(targets[i++] * ease).toLocaleString()));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return <b>{shown}</b>;
}
