"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "ko" | "en";
export type Localized<T = string> = Record<Lang, T>;

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "ko", setLang: () => {} });

/** KO/EN — URL은 그대로 두고 브라우저가 선택을 기억한다 (레퍼런스와 같은 방식) */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko");
  useEffect(() => {
    try { const v = localStorage.getItem("lang"); if (v === "en" || v === "ko") setLangState(v); } catch { /* noop */ }
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch { /* noop */ }
    document.documentElement.lang = l;
  };
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

/** 현재 언어의 문자열을 고른다 */
export function useT() {
  const { lang } = useLang();
  return <T,>(v: Localized<T>) => v[lang];
}

export function LangToggle({ compact }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle" data-compact={compact} role="group" aria-label="언어">
      {(["ko", "en"] as Lang[]).map((l) => (
        <button key={l} data-active={lang === l} onClick={() => setLang(l)} aria-pressed={lang === l}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
