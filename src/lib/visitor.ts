/** 브라우저에 한 번 만들어 두고 계속 쓰는 익명 방문자 ID (로그인 없음). 저장소를 못 쓰면 null */
export function getVisitorId(): string | null {
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
