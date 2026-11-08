import { notFound } from "next/navigation";
import "./preview.css";
import { LangProvider } from "./_components/lang";
import PreviewBar from "./_components/preview-bar";

export const dynamic = "force-dynamic";

/** /preview/* 는 개발 환경에서만 열린다. 운영 빌드에서는 404. */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <LangProvider>
      <div className="pv-root">
        {children}
        <PreviewBar />
      </div>
    </LangProvider>
  );
}
