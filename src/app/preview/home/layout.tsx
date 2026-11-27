import { notFound } from "next/navigation";

/** 홈 개편 시안 (사용자 스케치 1·2·3 기준) — 개발 환경 전용 */
export default function PreviewHomeLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      <style>{`
        .site-nav { display: none !important; }
        main { padding-top: 0 !important; }
        html { background: #f6f7f9 !important; } body { background: transparent !important; }
      `}</style>
      {children}
    </>
  );
}
