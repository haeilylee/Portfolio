"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

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
        padding: "0 48px",
      }}
    >
      <div
        style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile.webp"
            alt="Hakyeong Lee"
            style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }}
          />
          <span style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.04em", color: "var(--tx-1)" }}>
            Hakyeong Lee
          </span>
        </Link>

        {/* Contact 말풍선 */}
        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              left: 0,
              pointerEvents: "none",
            }}
          >
            {/* 꼭짓점 */}
            <div style={{
              position: "absolute",
              top: "-6px",
              left: "16px",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "6px solid #111",
            }} />
            {/* 본체 */}
            <div
              style={{
                background: "#111",
                borderRadius: "16px",
                padding: "12px 16px",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,.18)",
                fontFamily: "'Pretendard Variable', sans-serif",
              }}
            >
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#555", marginBottom: "6px", lineHeight: 1.2 }}>
                Want to get in touch?
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,.75)", letterSpacing: "-0.03em", lineHeight: 1.4, marginBottom: "2px" }}>
                time1910@naver.com
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,.75)", letterSpacing: "-0.03em", lineHeight: 1.4 }}>
                010-9294-9452
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
