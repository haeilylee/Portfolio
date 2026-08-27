"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CLOSE_MS = 260;

export default function ImageZoom({
  src,
  alt,
}: {
  src: string;
  alt?: string;
}) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openOverlay = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
  };

  const closeOverlay = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShow(false);
    if (reduced) {
      setOpen(false);
      return;
    }
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_MS);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <>
      <div
        style={{ borderRadius: "10px", overflow: "hidden", cursor: "zoom-in" }}
        onClick={openOverlay}
        role="button"
        aria-label="이미지 확대"
      >
        <Image
          src={src}
          alt={alt ?? ""}
          width={680}
          height={400}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {open && (
        <div
          onClick={closeOverlay}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            opacity: show ? 1 : 0,
            transition: "opacity 220ms ease",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeOverlay();
            }}
            aria-label="닫기"
            style={{
              position: "absolute",
              top: "20px",
              right: "24px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt ?? ""}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              cursor: "default",
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 260ms cubic-bezier(.16,1,.3,1), transform 260ms cubic-bezier(.16,1,.3,1)",
            }}
          />
        </div>
      )}
    </>
  );
}
