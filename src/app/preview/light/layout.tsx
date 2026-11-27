import { notFound } from "next/navigation";

/** 상세 인터랙션 시안 (라이트, 토스 Simplicity 세션 기준) — 개발 환경 전용 */
export default function PreviewLightLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      <style>{`.site-nav { display: none !important; } main { padding-top: 0 !important; } :root { --nav-h: 0px; }`}</style>
      {children}
    </>
  );
}
