"use client";

import { useEffect, useRef, useState } from "react";
import { useReactions, useLocalFlag } from "./use-reactions";

/**
 * Reaction A — Medium 형 Clap.
 * 본문 옆에 떠 있는 박수 버튼. 여러 번 눌러 쌓을 수 있고(1인 최대 20), 잠깐 모았다가 한 번에 서버로 보낸다.
 * 모바일에서는 우하단 플로팅으로 내려간다.
 */
const MAX_PER_PERSON = 20;

export default function ClapButton({ slug }: { slug: string }) {
  const { data, post } = useReactions(slug);
  const [mine, setMine] = useLocalFlag(`pv-clap-${slug}`);
  const myCount = Number(mine ?? 0);
  const [pending, setPending] = useState(0);
  const [burst, setBurst] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 모았다가 전송 (연타 중에는 요청하지 않음)
  useEffect(() => {
    if (pending === 0) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const n = pending;
      setPending(0);
      await post({ action: "clap", count: n });
    }, 600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [pending, post]);

  function clap() {
    if (myCount >= MAX_PER_PERSON) return;
    setMine(String(myCount + 1));
    setPending((p) => p + 1);
    setBurst(myCount + 1);
  }

  const total = data.claps + pending;

  return (
    <div className="pv-clap-float">
      <div style={{ position: "relative" }}>
        {burst !== null && (
          <span key={burst} className="pv-clap-burst" onAnimationEnd={() => setBurst(null)}>
            +{burst}
          </span>
        )}
        <button
          className="pv-clap-btn"
          data-clapped={myCount > 0}
          onClick={clap}
          aria-label="박수"
          title={myCount >= MAX_PER_PERSON ? "최대 20번까지 보낼 수 있어요" : "박수 보내기"}
        >
          <span style={{ filter: myCount > 0 ? "grayscale(1) brightness(10)" : "none" }}>👏</span>
        </button>
      </div>
      <div style={{ textAlign: "center", lineHeight: 1.2 }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#111", letterSpacing: "-0.03em" }}>{total}</div>
        <div style={{ fontSize: "10px", color: "#bbb", letterSpacing: "-0.01em" }}>
          {myCount > 0 ? `내 박수 ${myCount}` : "claps"}
        </div>
      </div>
    </div>
  );
}
