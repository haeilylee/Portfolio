/**
 * 상위 분류(Collection). Admin에서 콘텐츠당 하나를 칩으로 지정한다.
 * 기존 `category`(자유 텍스트 레이블)와 별개로, 탐색·그룹핑에만 쓰는 고정 키.
 */
export type CollectionId = "knowledge-systems" | "design-systems";

export interface Collection {
  id: CollectionId;
  title: string;
  subtitle: string;
  /** 포인트 컬러 (기존 category-styles 팔레트와 맞춤) */
  color: string;
  /** 연한 배경 (칩·배너용) */
  soft: string;
}

export const COLLECTIONS: Collection[] = [
  {
    id: "knowledge-systems",
    title: "Knowledge Systems",
    subtitle: "흩어진 정책과 업무 지식을 AI가 실행할 수 있는 문서로",
    color: "#7031d4",
    soft: "#f3eefc",
  },
  {
    id: "design-systems",
    title: "Design Systems",
    subtitle: "디자인의 암묵적인 판단을 재사용 가능한 규칙으로",
    color: "#2d5cd8",
    soft: "#eaf0fd",
  },
];

export const COLLECTION_IDS = COLLECTIONS.map((c) => c.id);

export function getCollection(id?: string | null): Collection | undefined {
  if (!id) return undefined;
  return COLLECTIONS.find((c) => c.id === id);
}

export function isCollectionId(v: unknown): v is CollectionId {
  return typeof v === "string" && (COLLECTION_IDS as string[]).includes(v);
}

/** 미지정 콘텐츠를 묶을 때 쓰는 가상 그룹 */
export const UNASSIGNED = {
  id: "unassigned" as const,
  title: "Others",
  subtitle: "아직 분류되지 않은 프로젝트",
  color: "#888888",
  soft: "#f2f2f2",
};

export function groupByCollection<T extends { collection?: string }>(items: T[]) {
  const groups = COLLECTIONS.map((c) => ({
    collection: c,
    items: items.filter((p) => p.collection === c.id),
  }));
  const unassigned = items.filter((p) => !isCollectionId(p.collection));
  return { groups, unassigned };
}
