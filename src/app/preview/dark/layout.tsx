import { notFound } from "next/navigation";
import { StoryStyles } from "../_shared/ui";

/** Product Designer 포트폴리오 다크 개편 시안 (toss.im/simplicity) — 개발 환경 전용 */
export default function PreviewDarkLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      <StoryStyles />
      {/* 사이트 공통 흰색 내비는 숨기고 자체 상단 바를 쓴다 */}
      <style>{`
        .site-nav { display: none !important; }
        main { padding-top: 0 !important; }
        :root { --nav-h: 0px; }
        html, body { background: #000 !important; }
        @media (max-width: 768px) { .st-hide-m { display: none !important; } }
      `}</style>
      {children}
    </>
  );
}
