export interface Tool {
  name: string;
  desc: string;
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
  github_url: string;
  download_url: string;
}

export const projects: Project[] = [
  {
    slug: "sdui",
    title: "SDUI 대응 컴포넌트 시스템 문서화",
    category: "Design System",
    catClass: "design-system",
    date: "2026/01 → 02",
    tags: ["Design System", "Figma", "Documentation"],
    preview:
      "서버 드리븐 UI 전환에 맞춰 디자인 시스템 컴포넌트를 재정의하고, 개발/디자인 팀 모두가 참조할 수 있는 문서 체계를 구축했어요.",
    desc: "서버 드리븐 UI 전환에 맞춰 디자인 시스템 컴포넌트를 재정의하고, 개발/디자인 팀 모두가 참조할 수 있는 문서 체계를 구축했어요.",
    outcomes: [
      "컴포넌트 명세 문서화로 개발-디자인 간 싱크 시간 40% 단축",
      "SDUI 전환 시 재사용 가능한 컴포넌트 비율 68% → 91%로 향상",
      "신규 온보딩 시 컴포넌트 학습 시간 평균 3일 → 1일로 감소",
    ],
    tools: [
      { name: "Figma", desc: "컴포넌트 설계 및 프로토타입 제작" },
      { name: "Notion", desc: "컴포넌트 명세 문서 작성 및 팀 공유" },
      { name: "Storybook", desc: "개발 팀을 위한 인터랙티브 컴포넌트 문서" },
      { name: "GitHub", desc: "버전 관리 및 변경 이력 추적" },
    ],
    insight:
      "SDUI 전환의 핵심은 단순한 컴포넌트 분류가 아니라 '서버가 어떤 단위로 컴포넌트를 제어할 것인가'에 대한 팀 공통 언어를 만드는 것이었습니다. 문서화 작업은 그 언어를 정의하고 공유하는 과정이었어요.",
    github_url: "https://github.com",
    download_url: "#",
  },
  {
    slug: "ai-requirements",
    title: "요구사항 정의서 자동화 생성",
    category: "AI",
    catClass: "ai",
    date: "2026/02 → 03",
    tags: ["AI", "Github", "Markdown"],
    preview:
      "기획자가 매번 수동으로 작성하던 요구사항 정의서를 AI 파이프라인으로 자동화했어요.",
    desc: "기획자가 매번 수동으로 작성하던 요구사항 정의서를 AI 파이프라인으로 자동화했어요.",
    outcomes: [
      "요구사항 정의서 초안 작성 시간 평균 4시간 → 20분으로 단축",
      "GitHub PR 기반 자동 생성으로 누락 항목 발생률 85% 감소",
      "기획-개발 간 요구사항 오해로 인한 재작업 건수 월 평균 6건 → 1건으로 감소",
    ],
    tools: [
      { name: "OpenAI API", desc: "GPT-4o 기반 문서 초안 자동 생성" },
      { name: "GitHub Actions", desc: "PR 트리거 기반 자동화 파이프라인 구성" },
      { name: "Markdown", desc: "표준화된 요구사항 정의서 포맷 설계" },
      { name: "Python", desc: "파이프라인 스크립트 및 API 연동 구현" },
    ],
    insight:
      "AI 자동화의 가치는 '완벽한 문서 생성'이 아니라 '기획자가 더 중요한 판단에 집중할 수 있도록 반복 작업을 제거하는 것'임을 프로젝트를 통해 확인했습니다. 초안의 품질보다 워크플로우 통합이 핵심이었어요.",
    github_url: "https://github.com",
    download_url: "#",
  },
  {
    slug: "data-ux",
    title: "데이터 통화 조회 서비스 UX 개선",
    category: "UX Research",
    catClass: "ux",
    date: "2025/09 → 11",
    tags: ["UX Research", "Product"],
    preview:
      "사용자 인터뷰와 히트맵 분석으로 핵심 불편 지점을 도출하고, 정보 계층 구조를 재설계해 조회 완료율을 높였어요.",
    desc: "사용자 인터뷰와 히트맵 분석으로 핵심 불편 지점을 도출하고, 정보 계층 구조를 재설계해 조회 완료율을 높였어요.",
    outcomes: [
      "조회 완료율 57% → 78%로 21%p 향상",
      "핵심 불편 지점 5가지 도출 및 우선순위 기반 개선안 도입",
      "정보 계층 재설계 후 평균 태스크 완료 시간 38% 단축",
    ],
    tools: [
      { name: "Figma", desc: "정보 구조 재설계 및 와이어프레임 제작" },
      { name: "Hotjar", desc: "히트맵 및 세션 녹화 분석" },
      { name: "Notion", desc: "인터뷰 결과 정리 및 인사이트 문서화" },
      { name: "Maze", desc: "프로토타입 기반 사용자 테스트 진행" },
    ],
    insight:
      "히트맵 데이터와 사용자 인터뷰를 함께 분석했을 때, 숫자가 말해주지 않는 맥락을 인터뷰가 채워줬습니다. 정량 데이터만으로는 '왜 이탈하는가'를 알 수 없었고, 두 방법론을 교차 검증하는 과정이 핵심 인사이트를 만들어냈어요.",
    github_url: "https://github.com",
    download_url: "#",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
