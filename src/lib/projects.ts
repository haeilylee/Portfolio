import contentData from "@/data/content.json";
import type { CollectionId } from "@/lib/collections";

export interface Tool {
  name: string;
  desc: string;
}

export type Block =
  | { type: "text"; content: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "code"; code: string; lang?: string; filename?: string }
  | { type: "callout"; label: string; content: string }
  | { type: "list"; items: { title?: string; content: string }[] }
  | { type: "table"; rows: { term: string; desc: string }[] }
  | { type: "spacer"; height?: number }
  | { type: "divider" }
  | { type: "step"; step?: string; title: string; tag?: string; tagColor?: string; content: string };

export interface Section {
  id: string;
  title: string;
  /** 목차 그룹 레이블 (Admin에서 직접 입력). 같은 값이 이어지면 한 그룹으로 묶인다 */
  group?: string;
  /** 목차 세부 분류 (예: Solution 안의 Workflow). 같은 group 안에서 같은 값이 이어지면 한 묶음 */
  subgroup?: string;
  /** "next"면 본문 밖 '다음 이야기'(시리즈 로드맵)로 그린다. 목차에서도 빠진다 */
  kind?: "next";
  /** 다음 이야기와 이어지는 공개 프로젝트 slug. 비어 있으면 '작업 중'(흑백·링크 없음) */
  nextSlug?: string;
  blocks: Block[];
}

export interface Project {
  slug: string;
  thumbnail?: string;
  heroThumbnail?: string;
  title: string;
  category: string;
  catClass: "design-system" | "ai" | "ux";
  /** 상위 분류. 미지정이면 undefined — 목록에서는 그대로 노출된다. */
  collection?: CollectionId;
  date: string;
  tags: string[];
  outcomes: string[];
  tools: Tool[];
  insight: string;
  insightHighlights?: string[];
  codeSnippet?: { code: string; lang?: string; filename?: string };
  sections?: Section[];
  /** 목차 첫 항목 이름. 비우면 Overview */
  overviewLabel?: string;
  github_url: string;
  download_url: string;
}

export interface Hero {
  name: string;
  role: string;
  bio: string;
  github: string;
  linkedin: string;
}

export const hero: Hero = contentData.hero;
export const projects: Project[] = contentData.projects as Project[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
