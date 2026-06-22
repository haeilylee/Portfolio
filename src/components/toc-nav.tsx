"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string };

export default function TocNav({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "28px",
        top: "calc(var(--nav-h) + 40px)",
        width: "148px",
        zIndex: 30,
      }}
    >
      <div
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#c0c0c0",
          fontWeight: 600,
          marginBottom: "12px",
        }}
      >
        On This Page
      </div>
      <nav style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                all: "unset",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                letterSpacing: "-0.02em",
                color: isActive ? "#111" : "#aaa",
                padding: "5px 0",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: isActive ? 600 : 400,
                transition: "color 0.15s",
                textAlign: "left",
              }}
            >
              {/* Active indicator line */}
              <span
                style={{
                  width: "2px",
                  height: "12px",
                  borderRadius: "2px",
                  background: isActive ? "#111" : "transparent",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
