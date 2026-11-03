/** 시안 목록 — Navigator, 인덱스, 각 페이지의 Reference 배지가 공유한다. */
export interface Variant {
  id: string;
  group: "admin" | "public" | "reaction";
  letter: "A" | "B" | "C";
  href: string;
  name: string;
  summary: string;
  reference: { site: string; pattern: string; url: string };
}

export const VARIANTS: Variant[] = [
  {
    id: "admin-a",
    group: "admin",
    letter: "A",
    href: "/preview/admin/a",
    name: "Inline Chips",
    summary: "편집 필드 사이에 칩으로 카테고리를 고른다",
    reference: { site: "Velog", pattern: "글 상단 태그 칩", url: "https://velog.io" },
  },
  {
    id: "admin-b",
    group: "admin",
    letter: "B",
    href: "/preview/admin/b",
    name: "Segmented Selector",
    summary: "두 카테고리를 좌우로 고르는 세그먼트 컨트롤",
    reference: { site: "Toss Tech", pattern: "상위 카테고리 전환", url: "https://toss.tech/category/engineering" },
  },
  {
    id: "admin-c",
    group: "admin",
    letter: "C",
    href: "/preview/admin/c",
    name: "Dropdown + Preview",
    summary: "드롭다운으로 고르고 제목·부제를 미리 본다",
    reference: { site: "Brunchbook", pattern: "연재 제목·소개 영역", url: "https://brunch.co.kr/brunchbook/338280" },
  },
  {
    id: "public-a",
    group: "public",
    letter: "A",
    href: "/preview/public/a",
    name: "Category Navigation",
    summary: "상단 카테고리 탭 → 제목·부제 → 목록",
    reference: { site: "Toss Tech", pattern: "카테고리 중심 탐색", url: "https://toss.tech/category/engineering" },
  },
  {
    id: "public-b",
    group: "public",
    letter: "B",
    href: "/preview/public/b",
    name: "Editorial Series",
    summary: "카테고리를 하나의 연재 시리즈처럼 읽는다",
    reference: { site: "Brunchbook", pattern: "주제형 연재 구조", url: "https://brunch.co.kr/brunchbook/338280" },
  },
  {
    id: "public-c",
    group: "public",
    letter: "C",
    href: "/preview/public/c",
    name: "Chip Navigation",
    summary: "카드 위 칩을 눌러 같은 분류를 모아 본다",
    reference: { site: "Velog", pattern: "태그·시리즈 탐색", url: "https://velog.io" },
  },
  {
    id: "reaction-a",
    group: "reaction",
    letter: "A",
    href: "/preview/reaction/a",
    name: "Clap Button",
    summary: "플로팅 박수 버튼 — 여러 번 눌러 응원",
    reference: { site: "Medium", pattern: "Clap 반응", url: "https://medium.com" },
  },
  {
    id: "reaction-b",
    group: "reaction",
    letter: "B",
    href: "/preview/reaction/b",
    name: "Emoji Reactions",
    summary: "이모지 반응 바 — 종류별 카운트",
    reference: { site: "GitHub / Notion", pattern: "이모지 리액션", url: "https://github.com" },
  },
  {
    id: "reaction-c",
    group: "reaction",
    letter: "C",
    href: "/preview/reaction/c",
    name: "Guestbook Comments",
    summary: "닉네임 + 한 줄 댓글 방명록",
    reference: { site: "Velog", pattern: "글 하단 댓글", url: "https://velog.io" },
  },
];

export const GROUP_LABEL: Record<Variant["group"], string> = {
  admin: "Admin",
  public: "Public",
  reaction: "Reaction",
};

export function getVariant(id: string) {
  return VARIANTS.find((v) => v.id === id);
}
