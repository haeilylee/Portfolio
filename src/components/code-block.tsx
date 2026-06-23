"use client";

import { useState } from "react";

interface Props {
  code: string;
  lang?: string;
  filename?: string;
  highlighted?: string; // pre-rendered HTML from shiki
}

export default function CodeBlock({ code, lang = "tsx", filename, highlighted }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const lines = code.split("\n");

  return (
    <div style={{
      background: "#f9f9f9",
      border: "1px solid #ebebeb",
      borderRadius: "10px",
      overflow: "hidden",
      fontFamily: "'Geist Mono', 'SF Mono', 'Fira Code', monospace",
      fontSize: "13px",
      lineHeight: "1.7",
      margin: "20px 0",
    }}>
      {/* 상단 바 */}
      {(filename || lang) && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid #ebebeb",
          background: "#fff",
        }}>
          <span style={{ fontSize: "12px", color: "#888", letterSpacing: "-0.01em" }}>
            {filename ?? lang}
          </span>
          <button
            onClick={copy}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "none", border: "1px solid #e0e0e0",
              borderRadius: "6px", padding: "4px 10px",
              fontSize: "11px", color: copied ? "#16a34a" : "#666",
              cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
            }}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </>
            )}
          </button>
        </div>
      )}

      {/* 코드 본문 */}
      {highlighted ? (
        <div
          style={{ padding: "16px 0", overflowX: "auto" }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <div style={{ padding: "16px 0", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} style={{ lineHeight: "1.7" }}>
                  <td style={{
                    width: "44px", minWidth: "44px",
                    textAlign: "right", paddingRight: "16px", paddingLeft: "12px",
                    color: "#ccc", userSelect: "none", verticalAlign: "top",
                    fontSize: "12px",
                  }}>
                    {i + 1}
                  </td>
                  <td style={{ paddingRight: "24px", whiteSpace: "pre", color: "#111" }}>
                    <SimpleHighlight code={line} lang={lang} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* 간단한 토크나이저 (shiki 없을 때 폴백) */
function SimpleHighlight({ code, lang }: { code: string; lang: string }) {
  if (!code) return <span>&nbsp;</span>;

  // JS/TS 키워드
  const keywords = /\b(import|export|from|const|let|var|function|return|async|await|type|interface|default|class|extends|new|if|else|for|while|true|false|null|undefined)\b/g;
  const strings = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g;
  const comments = /(\/\/.*)/g;
  const jsxTag = /(<\/?[\w.]+|>|\/?>)/g;
  const numbers = /\b(\d+)\b/g;

  const parts: React.ReactNode[] = [];
  let last = 0;
  const tokens: { start: number; end: number; type: string }[] = [];

  function collect(re: RegExp, type: string) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(code)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length, type });
    }
  }

  if (lang === "bash" || lang === "sh") {
    collect(comments, "comment");
    collect(strings, "string");
  } else {
    collect(comments, "comment");
    collect(strings, "string");
    collect(jsxTag, "tag");
    collect(keywords, "keyword");
    collect(numbers, "number");
  }

  tokens.sort((a, b) => a.start - b.start);

  const colorMap: Record<string, string> = {
    keyword: "#e53935",
    string: "#0277bd",
    tag: "#7b1fa2",
    comment: "#9e9e9e",
    number: "#00838f",
  };

  for (const tok of tokens) {
    if (tok.start < last) continue;
    if (tok.start > last) parts.push(code.slice(last, tok.start));
    parts.push(
      <span key={tok.start} style={{ color: colorMap[tok.type] }}>
        {code.slice(tok.start, tok.end)}
      </span>
    );
    last = tok.end;
  }
  if (last < code.length) parts.push(code.slice(last));

  return <>{parts}</>;
}
