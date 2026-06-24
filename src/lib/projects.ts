import contentData from "@/data/content.json";

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
  | { type: "spacer"; height?: number };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  catClass: "design-system" | "ai" | "ux";
  date: string;
  tags: string[];
  preview: string;
  desc: string;
  outcomes: string[];
  tools: Tool[];
  insight: string;
  insightHighlights?: string[];
  codeSnippet?: { code: string; lang?: string; filename?: string };
  sections?: Section[];
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
