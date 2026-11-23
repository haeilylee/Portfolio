"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LangToggle } from "./lang";
import { VARIANTS } from "./variants";

export default function PreviewBar() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}

function Bar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const embedded = params.get("embed") === "1";
  const [mobile, setMobile] = useState(false);

  useEffect(() => { document.documentElement.dataset.embed = embedded ? "1" : ""; }, [embedded]);
  useEffect(() => { setMobile(false); }, [pathname]);
  // 검토용: ?scroll=1200 이면 로드 후 그 위치로 이동 (스크린샷으로 앵커링 상태 확인)
  useEffect(() => {
    const y = Number(params.get("scroll"));
    if (y > 0) { const id = setTimeout(() => window.scrollTo({ top: y }), 300); return () => clearTimeout(id); }
  }, [params]);

  if (embedded) return null; // 폰 프레임 안: 히어로의 헤더 토글만 남긴다

  return (
    <>
      {mobile && (
        <div className="pv-phone-overlay" onClick={() => setMobile(false)}>
          <div className="pv-phone" onClick={(e) => e.stopPropagation()}>
            <div className="pv-phone-top"><span>iPhone 390 × 780</span><button onClick={() => setMobile(false)} aria-label="닫기">×</button></div>
            <iframe key={pathname} src={`${pathname}?embed=1`} title="모바일 미리보기" className="pv-phone-screen" />
          </div>
        </div>
      )}
      <div className="pv-nav">
        <div className="pv-nav-inner">
          {[...new Set(VARIANTS.map((v) => v.group))].map((g) => (
            <span key={g} style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginRight: "8px" }}>
              <span className="pv-nav-label">{g}</span>
              {VARIANTS.filter((v) => v.group === g).map((v) => (
                <Link key={v.id} href={v.href} className="pv-nav-link" data-active={pathname === v.href} title={v.name}>
                  {v.letter}
                </Link>
              ))}
            </span>
          ))}
          <span className="pv-nav-sep" />
          <LangToggle compact />
          <button className="pv-nav-mobile" onClick={() => setMobile((m) => !m)} data-active={mobile}>📱 모바일 보기</button>
          <Link href="/preview" className="pv-nav-home">시안 목록 ↗</Link>
        </div>
      </div>
    </>
  );
}

export function ReferenceBadge({ id, note }: { id: string; note?: string }) {
  const v = VARIANTS.find((x) => x.id === id);
  if (!v) return null;
  return (
    <div className="pv-ref">
      <span className="pv-ref-tag">{v.group} {v.letter}</span>
      <b>{v.name}</b>
      <span>· Reference: {v.ref}</span>
      {v.group === "Story" && <a href="https://api.metadata.co.kr/" target="_blank" rel="noopener noreferrer">원본 보기 ↗</a>}
      {note && <span className="pv-ref-note">{note}</span>}
    </div>
  );
}
