"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { VARIANTS, GROUP_LABEL, GROUPS } from "./variants";

export default function PreviewNavigator() {
  return (
    <Suspense fallback={null}>
      <NavigatorInner />
    </Suspense>
  );
}

function NavigatorInner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const embedded = params.get("embed") === "1";
  const [mobile, setMobile] = useState(false);

  // 폰 프레임 안(iframe)에서는 Navigator를 숨긴다
  useEffect(() => {
    document.documentElement.dataset.embed = embedded ? "1" : "";
  }, [embedded]);
  useEffect(() => { setMobile(false); }, [pathname]);

  if (embedded) return null;

  const groups = GROUPS.map((g) => ({ group: g, items: VARIANTS.filter((v) => v.group === g) }));

  return (
    <>
      {mobile && (
        <div className="pv-phone-overlay" onClick={() => setMobile(false)}>
          <div className="pv-phone" onClick={(e) => e.stopPropagation()}>
            <div className="pv-phone-top">
              <span>iPhone 390 × 780</span>
              <button onClick={() => setMobile(false)} aria-label="닫기">×</button>
            </div>
            <iframe
              key={pathname}
              src={`${pathname}?embed=1`}
              title="모바일 미리보기"
              className="pv-phone-screen"
            />
          </div>
        </div>
      )}

      <div className="pv-nav" role="navigation" aria-label="시안 이동">
        <div className="pv-nav-inner">
          {groups.map(({ group, items }) => (
            <div key={group} className="pv-nav-group">
              <span className="pv-nav-label">{GROUP_LABEL[group]}</span>
              {items.map((v) => (
                <Link
                  key={v.id}
                  href={v.href}
                  className="pv-nav-link"
                  data-active={pathname === v.href}
                  data-chosen={v.chosen}
                  title={`${v.name} · ${v.reference.site}${v.chosen ? " · 선택됨" : ""}`}
                >
                  {v.letter}
                  {v.chosen && <span className="pv-nav-check">✓</span>}
                </Link>
              ))}
            </div>
          ))}
          <button className="pv-nav-mobile" onClick={() => setMobile((m) => !m)} data-active={mobile}>
            📱 모바일 보기
          </button>
          <Link href="/preview" className="pv-nav-home">시안 목록 ↗</Link>
        </div>
      </div>
    </>
  );
}
