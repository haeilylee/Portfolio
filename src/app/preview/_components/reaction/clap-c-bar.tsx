"use client";

import { useState } from "react";
import { useLimitedClap } from "./use-reactions";
import { LogPanel } from "./clap-a-float";

/**
 * Clap C — 화면 하단 고정 바(모바일 친화) · 로그는 Slack/Discord 웹훅 알림.
 * 박수가 오면 내 Slack 채널(또는 Discord)에 "👏 sdui에 박수 3개" 한 줄이 도착한다.
 * → 대시보드를 열어 볼 필요 없이 알림으로 받는다. 집계는 서버 숫자, 로그는 채널 히스토리.
 */
export default function ClapCBar({ slug }: { slug: string }) {
  const { clap, limit, used, remaining, total, lastResponse } = useLimitedClap(slug, "webhook");
  const [bump, setBump] = useState(0);

  function onClap() {
    if (clap()) setBump((b) => b + 1);
  }
  const done = remaining <= 0;
  const webhook = lastResponse?.webhook as { sent: boolean; message: string; error?: string } | undefined;

  return (
    <>
      <div className="pv-clap-bar" role="region" aria-label="박수">
        <div className="pv-clap-bar-inner">
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#111", letterSpacing: "-0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {done ? "오늘 박수를 다 보냈어요" : "이 글이 도움이 됐다면"}
            </div>
            <div style={{ fontSize: "11px", color: "#999", letterSpacing: "-0.01em" }}>
              {done ? "내일 또 보낼 수 있어요" : `오늘 ${remaining}번 남음`}
            </div>
          </div>
          <button key={bump} className="pv-clap-pill" data-done={done} onClick={onClap} aria-label="박수">
            <span className="pv-clap-pill-emoji">👏</span>
            <span>{total}</span>
            <span className="pv-clap-pill-dots">
              {Array.from({ length: limit }).map((_, i) => <i key={i} data-on={i < used} />)}
            </span>
          </button>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "28px" }}>
        <LogPanel
          title="로그 · Slack / Discord 웹훅 알림"
          desc="박수가 반영될 때마다 서버가 웹훅 URL로 한 줄을 보내요. 채널이 곧 로그가 되고, 폰 알림으로도 받을 수 있어요. 연타는 600ms 모아서 보내니 알림이 쏟아지지 않아요."
          pros="대시보드 안 열어도 됨 · 설정은 환경변수 CLAP_WEBHOOK_URL 하나 · 채널 검색으로 과거 로그 확인"
          cons="집계 숫자는 여전히 KV 필요 · 채널이 시끄러워질 수 있어 일 단위 요약으로 바꿀 여지"
          lines={
            webhook
              ? [
                  `${webhook.sent ? "✓ 전송됨" : "○ 미리보기 (CLAP_WEBHOOK_URL 없음)"}${webhook.error ? " · " + webhook.error : ""}`,
                  `POST ${"{ text: \"" + webhook.message + "\" }"}`,
                ]
              : ["(박수를 누르면 보낼 메시지가 여기 보여요)"]
          }
        />
      </div>
    </>
  );
}
