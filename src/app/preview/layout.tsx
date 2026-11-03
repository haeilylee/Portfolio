import { notFound } from "next/navigation";
import "./preview.css";
import PreviewNavigator from "./_components/preview-navigator";

export const dynamic = "force-dynamic";

/**
 * /preview/* 는 개발 환경에서만 열린다.
 * 운영 빌드에서는 404 — 시안이 실제 서비스에 노출되지 않도록.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <div className="pv-root">
      {children}
      <PreviewNavigator />
    </div>
  );
}
