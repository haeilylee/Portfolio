"use client";

import { useState } from "react";
import { useLimitedClap } from "./use-reactions";
import { LogPanel } from "./clap-a-float";

/**
 * Clap B — 본문 끝 인라인 큰 버튼 + "오늘 n/5" 텍스트 · 로그는 서버 장부(ledger).
 * 서버(KV)에 박수 한 줄씩 {시각, 익명 방문자, 개수}를 남긴다. 최근 200줄만 유지해서 가볍다.
 * → 내 사이트 안에서 바로 볼 수 있고, Admin에 "최근 박수" 패널을 붙이기 쉽다.
 */
export default function ClapBInline({ slug }: { slug: string }) {
  const { data, clap, limit, used, remaining, total } = useLimitedClap(slug, "ledger");
  const [pulse, setPulse] = useState(0);

  function onClap() {
    if (clap()) setPulse((p) => p + 1);
  }
  const done = remaining <= 0;
  const log = (data.log ?? []).filter((l) => l.via === "ledger").slice(0, 6);

  return (
    <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "28px" }}>
      <div className="pv-clap-inline">
        <button
          key={pulse}
          className="pv-clap-big"
          data-done={done}
          onClick={onClap}
          aria-label="박수"
        >
          <span className="pv-clap-big-emoji">👏</span>
          <span className="pv-clap-big-label">{done ? "오늘은 여기까지" : "박수 보내기"}</span>
        </button>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#111", letterSpacing: "-0.05em", lineHeight: 1 }}>
            {total} <span style={{ fontSize: "12px", color: "#bbb", fontWeight: 500, letterSpacing: "-0.01em" }}>claps</span>
          </div>
          <div style={{ fontSize: "12px", color: done ? "#111" : "#888", marginTop: "6px", letterSpacing: "-0.02em" }}>
            {done ? "오늘 박수 5번을 다 보냈어요. 내일 다시 보낼 수 있어요." : `오늘 ${used}/${limit} · ${remaining}번 더 보낼 수 있어요`}
          </div>
          <div className="pv-clap-meter" aria-hidden>
            <span style={{ width: `${(used / limit) * 100}%` }} />
          </div>
        </div>
      </div>

      <LogPanel
        title="로그 · 서버 장부 (KV에 한 줄씩)"
        desc="박수마다 {시각, 익명 방문자 ID 앞 6자리, 개수}를 KV 리스트에 넣고 최근 200줄만 남겨요. 하루 한도도 같은 저장소에서 '날짜×방문자' 키로 세니까 한 곳에서 끝나요."
        pros="사이트 안에서 바로 조회 · Admin에 '최근 박수' 패널 붙이기 쉬움 · 한도 검증과 저장소가 하나"
        cons="Upstash Redis 같은 KV 연결 필요 (무료 티어 가능) · 로그 보관량을 직접 관리"
        lines={log.length ? log.map((l) => `${l.at.slice(5, 16).replace("T", " ")}  visitor:${l.visitor}  +${l.n}`) : ["(박수를 누르면 장부에 한 줄 추가돼요)"]}
      />
    </div>
  );
}
