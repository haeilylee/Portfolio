"use client";

import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "var(--nav-h)",
        background: "var(--bg-nav)",
        borderBottom: "1px solid #e5e5e5",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      {/* Left: Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginRight: "auto",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            flexShrink: 0,
            position: "relative",
          }}
        >
          <Image
            src="/profile.webp"
            alt="Hakyeong Lee"
            width={36}
            height={42}
            style={{
              objectFit: "cover",
              objectPosition: "top center",
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "auto",
              height: "42px",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "var(--tx-1)",
          }}
        >
          Hakyeong Lee
        </span>
      </Link>

      {/* Right: Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <NavLink href="/">Projects</NavLink>
        <NavLink href="/about">About</NavLink>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        fontSize: "13px",
        color: "var(--tx-3)",
        padding: "5px 10px",
        borderRadius: "6px",
        letterSpacing: "-0.02em",
        transition: "color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "var(--tx-1)";
        (e.currentTarget as HTMLAnchorElement).style.background = "#f0f0f0";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "var(--tx-3)";
        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      {children}
    </Link>
  );
}
