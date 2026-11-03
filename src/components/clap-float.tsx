"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

/**
 * 우하단 플로팅 박수 버튼 — 1인 1회.
 * - 방문자 ID는 브라우저에 한 번 만들어 두고 계속 쓴다 (로그인 없음)
 * - 누르면 서버 카운트 +1, 버튼은 비활성. 로그는 Vercel Analytics 이벤트로 남긴다
 * - 저장소가 설정되지 않았으면(503) 버튼을 아예 그리지 않는다
 */
function getVisitorId(): string | null {
  try {
    const k = "visitor-id";
    let v = localStorage.getItem(k);
    if (!v) {
      v = crypto.randomUUID().replace(/-/g, "");
      localStorage.setItem(k, v);
    }
    return v;
  } catch {
    return null;
  }
}

export default function ClapFloat({ slug }: { slug: string }) {
  const [state, setState] = useState<{ claps: number; mine: number } | null>(null);
  const [hidden, setHidden] = useState(false);
  const [burst, setBurst] = useState(false);
  const [visitor, setVisitor] = useState<string | null>(null);

  useEffect(() => {
    const v = getVisitorId();
    if (!v) { setHidden(true); return; }
    setVisitor(v);
    fetch(`/api/clap?slug=${encodeURIComponent(slug)}&visitor=${v}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setState({ claps: d.claps, mine: d.mine }))
      .catch(() => setHidden(true));
  }, [slug]);

  if (hidden || !state || !visitor) return null;

  const done = state.mine >= 1;

  async function clap() {
    if (done || !visitor) return;
    setState((s) => (s ? { claps: s.claps + 1, mine: 1 } : s)); // 낙관적 반영
    setBurst(true);
    track("clap", { slug });
    try {
      const r = await fetch("/api/clap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, visitor }),
      });
      if (r.ok) {
        const d = await r.json();
        setState({ claps: d.claps, mine: d.mine });
      }
    } catch {
      /* 네트워크 실패 시 낙관적 값 유지 */
    }
  }

  return (
    <div className="clap-float">
      <div style={{ position: "relative" }}>
        {burst && <span className="clap-burst" onAnimationEnd={() => setBurst(false)}>+1</span>}
        <button
          className="clap-btn"
          data-done={done}
          disabled={done}
          onClick={clap}
          aria-label={done ? "이미 박수를 보냈어요" : "박수 보내기"}
          title={done ? "고마워요!" : "박수 보내기"}
        >
          👏
        </button>
      </div>
      <div className="clap-count" data-done={done}>{state.claps}</div>
    </div>
  );
}
