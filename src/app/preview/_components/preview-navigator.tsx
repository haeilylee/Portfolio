"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VARIANTS, GROUP_LABEL } from "./variants";

export default function PreviewNavigator() {
  const pathname = usePathname();
  const groups = (["admin", "public", "reaction"] as const).map((g) => ({
    group: g,
    items: VARIANTS.filter((v) => v.group === g),
  }));

  return (
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
                title={`${v.name} · ${v.reference.site}`}
              >
                {v.letter}
              </Link>
            ))}
          </div>
        ))}
        <Link href="/preview" className="pv-nav-home">
          시안 목록 ↗
        </Link>
      </div>
    </div>
  );
}
