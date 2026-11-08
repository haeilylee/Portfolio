"use client";

import Link from "next/link";
import { useT } from "./lang";
import { PRINCIPLES } from "./story-data";

/** 서술 끝 — 일하는 원칙 3가지 + 연락 + 전체 프로젝트 · 맨 위로 */
export default function StoryFooter({ tone = "light" }: { tone?: "light" | "dark" }) {
  const t = useT();
  return (
    <footer className="sf" data-tone={tone}>
      <div className="sf-principles">
        <div className="sf-eyebrow">{t({ ko: "일하는 원칙", en: "How I work" })}</div>
        <div className="sf-grid">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="sf-principle">
              <div className="sf-principle-no">0{i + 1}</div>
              <div className="sf-principle-title">{t(p.title)}</div>
              <div className="sf-principle-text">{t(p.text)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="sf-contact">
        <div>
          <div className="sf-eyebrow">{t({ ko: "연락", en: "Contact" })}</div>
          <div className="sf-contact-title">{t({ ko: "문서로 팀을 움직이는 일을 함께하고 싶다면", en: "If you want documents that move a team" })}</div>
        </div>
        <div className="sf-actions">
          <a className="sf-btn" href="mailto:hello@example.com">hello@example.com <span className="sf-sample">{t({ ko: "예시", en: "sample" })}</span></a>
          <Link className="sf-btn" data-ghost href="/">{t({ ko: "모든 프로젝트 보기", en: "All projects" })} →</Link>
          <a className="sf-btn" data-ghost href="#top">{t({ ko: "맨 위로", en: "Back to top" })} ↑</a>
        </div>
      </div>
      <div className="sf-foot">© 2026 Hakyeong Lee · {t({ ko: "좋은 AI는 좋은 문서에서 시작됩니다.", en: "Good AI starts with good documentation." })}</div>
    </footer>
  );
}
