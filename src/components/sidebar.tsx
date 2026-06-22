"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
}

function SidebarLink({ href, children }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      style={{
        display: "block",
        fontSize: "13px",
        letterSpacing: "-0.025em",
        color: isActive ? "var(--tx-1)" : "var(--tx-3)",
        background: isActive ? "#ededed" : "transparent",
        padding: "5px 10px",
        margin: "0 6px",
        borderRadius: "6px",
        transition: "color 0.15s, background 0.15s",
        fontWeight: isActive ? 500 : 400,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--tx-1)";
          (e.currentTarget as HTMLAnchorElement).style.background = "#ededed";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--tx-3)";
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
        }
      }}
    >
      {children}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: "var(--nav-h)",
        width: "var(--sidebar-w)",
        height: "calc(100vh - var(--nav-h))",
        background: "#ffffff",
        borderRight: "1px solid #e8e8e8",
        overflowY: "auto",
        padding: "12px 0",
        zIndex: 40,
      }}
    >
      <div style={{ marginBottom: "4px" }}>
        <SidebarLink href="/">Home</SidebarLink>
      </div>

      <div style={{ marginTop: "16px" }}>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            color: "var(--tx-3)",
            letterSpacing: "0.06em",
            padding: "12px 12px 4px",
            fontWeight: 500,
          }}
        >
          Categories
        </div>
        <SidebarLink href="/projects/sdui">Design System</SidebarLink>
        <SidebarLink href="/projects/ai-requirements">AI</SidebarLink>
        <SidebarLink href="/projects/data-ux">UX Research</SidebarLink>
      </div>

      <div style={{ marginTop: "16px" }}>
        <SidebarLink href="/about">About</SidebarLink>
      </div>
    </aside>
  );
}
