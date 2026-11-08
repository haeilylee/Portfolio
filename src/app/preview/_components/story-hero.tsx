"use client";

import { useEffect, useState } from "react";
import { useT, useLang, LangToggle } from "./lang";
import { HERO, STORIES } from "./story-data";

/** 단어 단위로 차례로 나타나는 문장 (레퍼런스의 인트로 리빌) */
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(/(\s+)/);
  return (
    <span className="wr">
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={i}>{w}</span>
        ) : (
          <span key={i} className="wr-w" style={{ animationDelay: `${delay + i * 16}ms` }}>{w}</span>
        )
      )}
    </span>
  );
}

/**
 * 홈 첫 화면 — 프로필 카드 대신 바로 읽히는 헤드라인.
 *  terminal: 레퍼런스의 `> whoami` / `> projects` 블록 (A안)
 */
export default function StoryHero({ terminal, tone = "light" }: { terminal?: boolean; tone?: "light" | "dark" }) {
  const t = useT();
  const [key, setKey] = useState(0);
  const { lang } = useLang();
  // 언어가 바뀌면 리빌을 다시 재생
  useEffect(() => { setKey((k) => k + 1); }, [lang]);

  return (
    <header className="sh" data-tone={tone}>
      <div className="sh-lang"><LangToggle compact /></div>

      {terminal && (
        <div className="sh-term" aria-label="intro">
          <div className="sh-term-line"><span className="sh-term-prompt">&gt;</span> hakyeong whoami</div>
          <div className="sh-term-out">✓ {HERO.name} · {t(HERO.role)}</div>
          <div className="sh-term-line"><span className="sh-term-prompt">&gt;</span> hakyeong projects</div>
          {HERO.ledger.map((l) => (
            <div key={l.name} className="sh-term-out sh-term-row">
              <span className="sh-term-year">{l.year}</span>
              <span className="sh-term-name">{l.name}</span>
              <span className="sh-term-desc">{t(l.desc)}</span>
            </div>
          ))}
          <div className="sh-term-out sh-term-ok">✓ {t({ ko: "Documents that AI can execute.", en: "Documents that AI can execute." })}</div>
        </div>
      )}

      <div className="sh-eyebrow">
        {HERO.name.toUpperCase()} <span>/</span> {t(HERO.role).toUpperCase()}
      </div>
      <h1 className="sh-headline" key={`h${key}`}>
        {t(HERO.headline).split("\n").map((line, i) => (
          <span key={i} className="sh-headline-line"><WordReveal text={line} delay={i * 220} /></span>
        ))}
      </h1>
      <p className="sh-intro" key={`p${key}`}>
        <WordReveal text={t(HERO.intro)} delay={500} />
      </p>

      {/* 챕터 바로가기 — 오른쪽 카드와 같은 순서 */}
      <nav className="sh-chapters" aria-label="chapters">
        {STORIES.map((s) => (
          <a key={s.id} href={`#story-${s.id}`}><span>{s.no}</span>{t(s.heading)}</a>
        ))}
      </nav>
    </header>
  );
}
