import type { Localized } from "./lang";

/**
 * 홈 자소서 콘텐츠.
 * 왼쪽은 짧은 단락(beat), 오른쪽은 프로젝트 카드 스택. 단락을 읽으면 그 단락의 카드·이미지가 앵커링된다.
 * 사실은 모두 각 프로젝트 상세(content.json sections)에서 가져왔다. 01 배경만 히어로 소개문 기반 — "예시"로 표시.
 */

export interface Beat {
  text: Localized;
  /** 이 단락을 읽을 때 카드 안에 보일 이미지 (없으면 카드 커버 유지) */
  image?: string;
  caption?: Localized;
}

export interface Story {
  id: string;
  no: string;
  /** 오른쪽 카드 — 분류 레이블 · 제목 · 핵심 수치 */
  label: Localized;
  title: Localized;
  stat?: { value: string; label: Localized };
  cover: string;
  href?: string;
  draft?: boolean;
  /** 왼쪽 챕터 제목 */
  heading: Localized;
  beats: Beat[];
  /** 예시(초안) 여부 */
  sample?: boolean;
  /** 오른쪽 스택에 카드를 두지 않음 (배경 챕터) */
  noCard?: boolean;
}

export const HERO = {
  name: "Hakyeong Lee",
  role: { ko: "Technical Writer", en: "Technical Writer" } as Localized,
  headline: {
    ko: "좋은 AI는\n좋은 문서에서 시작됩니다",
    en: "Good AI starts\nwith good documentation",
  } as Localized,
  intro: {
    ko: "UX 디자인에서 출발해, 지금은 AI가 읽고 실행할 수 있는 문서 체계를 만듭니다. 2026년 두 개의 구축 프로젝트에서 요구사항 정의와 디자인 시스템을 AI 워크플로우로 옮겼습니다.",
    en: "I started in UX design and now build documentation systems that AI can read and act on. In 2026, across two build projects, I moved requirements definition and the design system into AI workflows.",
  } as Localized,
  /** 터미널형 프로젝트 목록 (A안 히어로) */
  ledger: [
    { year: "2026.02", name: "PRD Automation", desc: { ko: "요구사항 정의서 30일 → 3일", en: "Requirements spec, 30 days → 3" } },
    { year: "2026.04", name: "AI Design System", desc: { ko: "AI가 읽는 컴포넌트 레지스트리", en: "An AI-readable component registry" } },
    { year: "Next", name: "Living Design System", desc: { ko: "바뀐 규칙을 먼저 알려주는 시스템 (구상)", en: "A system that reports rule changes first (planned)" } },
  ],
};

export const STORIES: Story[] = [
  {
    id: "why",
    no: "01",
    label: { ko: "BACKGROUND", en: "BACKGROUND" },
    title: { ko: "화면이 아니라 기준을 만드는 사람", en: "Making the rules, not just the screens" },
    cover: "/profile.webp",
    heading: { ko: "왜 문서인가", en: "Why documentation" },
    sample: true,
    noCard: true,
    beats: [
      {
        text: {
          ko: "UX 디자이너로 일하며 알게 된 건, 프로젝트를 느리게 만드는 게 화면이 아니라 '누가 어떤 기준으로 결정했는지'가 어디에도 적혀 있지 않다는 점이었습니다. 같은 질문이 회의마다 돌아왔고, 답은 늘 누군가의 머릿속에만 있었어요.",
          en: "As a UX designer I learned that what slows a project isn't the screens — it's that nobody writes down who decided what, and why. The same questions came back every meeting; the answers lived in someone's head.",
        },
      },
      {
        text: {
          ko: "그래서 테크니컬 라이터가 됐습니다. 그리고 AI가 팀에 들어오자 이 일의 정의가 한 번 더 바뀌었어요. 사람이 읽는 문서가 아니라, AI가 읽고 실행할 수 있는 문서가 필요해졌습니다. 아래 두 프로젝트는 그 답을 찾아간 기록입니다.",
          en: "So I became a technical writer. When AI joined the team, the job changed once more: we needed documents AI could read and execute, not just people. The two projects below are how I worked that out.",
        },
      },
    ],
  },
  {
    id: "ai-requirements",
    no: "02",
    label: { ko: "KNOWLEDGE SYSTEMS · PRD AUTOMATION", en: "KNOWLEDGE SYSTEMS · PRD AUTOMATION" },
    title: { ko: "30일 걸리던 요구사항 정의서, AI 워크플로우로 3일 만에", en: "A 30-day requirements spec, done in 3 with an AI workflow" },
    stat: { value: "30 → 3", label: { ko: "일 · WBS 기준", en: "days · per WBS" } },
    cover: "/images/ai-requirements/01_thumbnail_policy-to-requirements.png",
    href: "/projects/ai-requirements",
    heading: { ko: "수백 건의 요구사항을 손으로 쓰던 팀", en: "A team writing hundreds of requirements by hand" },
    beats: [
      {
        image: "/images/ai-requirements/02_problem_review-cost.png",
        caption: { ko: "요구사항 1건에 필요한 교차 검토", en: "Cross-checking needed per requirement" },
        text: {
          ko: "요구사항 1건을 쓰려면 정책서·기능내역서·IA·화면설계 네다섯 개를 교차 대조해야 했고, 한 건에 20분이 넘게 걸렸습니다. 이걸 여러 명이 수백 건 나눠 쓰니 누락이 생겼고, 완성된 요구사항이 어떤 근거에서 나왔는지는 아무도 역추적할 수 없었어요.",
          en: "One requirement meant cross-reading four or five documents — policy, feature inventory, IA, screen specs — at 20+ minutes each. Split across people and hundreds of items, things slipped, and nobody could trace a finished requirement back to its source.",
        },
      },
      {
        image: "/images/ai-requirements/04_pivot-test.png",
        caption: { ko: "첫 시도: 원문만 넣으면 9%만 살아남는다", en: "First attempt: raw docs alone — 9% survived" },
        text: {
          ko: "처음엔 원문을 통째로 AI에 넣었습니다. 살아남은 요구사항은 9%였어요. 문서가 덜 정제된 게 문제가 아니었습니다. '어떤 고객 관점에서 찾아야 하는가'라는 암묵적 분석 기준이 어디에도 적혀 있지 않았던 겁니다.",
          en: "First I fed the raw documents to AI. 9% of the output survived. The problem wasn't messy input — the tacit rule of 'which customer lens to search from' had never been written down.",
        },
      },
      {
        image: "/images/ai-requirements/07_full-workflow.png",
        caption: { ko: "스크립트 / LLM / 사람의 경계를 나눈 워크플로우", en: "Workflow split between script, LLM and people" },
        text: {
          ko: "그래서 기준을 먼저 세웠습니다. 파싱 같은 정형 작업은 스크립트로, 맥락 해석은 LLM으로, 최종 판단은 사람이. 세그먼트 × AARRR 퍼널 조합마다 전담 에이전트를 병렬로 두고, 어떤 문서를 어떤 가중치로 읽을지 라우팅 테이블로 지시했습니다. 모든 요구사항엔 출처 필드를 강제했고요.",
          en: "So I set the boundaries first: scripts for structured work like parsing, the LLM for interpreting context, people for the final call. One dedicated agent per segment × AARRR-funnel pair, run in parallel, with a routing table telling each which documents to read and how heavily. Every requirement had to carry its sources.",
        },
      },
      {
        image: "/images/ai-requirements/10_wbs-30d-vs-3d.png",
        caption: { ko: "WBS 30일 → 3일", en: "WBS 30 days → 3" },
        text: {
          ko: "결과는 WBS 30일에서 3일로. 운영팀 검수 기준으로 산출된 요구사항의 70~80%가 실제 반영됐습니다. 핵심은 더 좋은 모델이 아니라, 문서에 적힌 정보와 사람 머릿속의 판단을 구분해 규칙으로 바꾸는 일이었습니다.",
          en: "The result: 30 days on the WBS became 3, and 70–80% of generated requirements were accepted by the operations team. The key wasn't a better model — it was separating what the documents say from what people know, and turning the latter into rules.",
        },
      },
    ],
  },
  {
    id: "sdui",
    no: "03",
    label: { ko: "DESIGN SYSTEMS · AI DESIGN SYSTEM", en: "DESIGN SYSTEMS · AI DESIGN SYSTEM" },
    title: { ko: "머릿속에 있던 컴포넌트 선택 기준을, AI가 읽는 레지스트리로", en: "Turning tacit component choices into an AI-readable registry" },
    stat: { value: "50 / 5,000", label: { ko: "컴포넌트 · 적용 화면", en: "components · screens" } },
    cover: "/images/sdui/thumbnail-detail.png",
    href: "/projects/sdui",
    heading: { ko: "AI는 생성을 못 한 게 아니라, 선택을 몰랐다", en: "AI didn't fail to generate — it didn't know what to pick" },
    beats: [
      {
        image: "/images/sdui/헬로우.png",
        caption: { ko: "\"목업 만들어줘\" — 이름만 붙은 빈 네모", en: "\"Make a mockup\" — empty boxes with names" },
        text: {
          ko: "AI에게 목업을 시키면 화면은 그럴듯했습니다. Figma로 가져가면 'Button'이라고만 적힌 빈 네모였어요. 색상도 크기도 상태값도 없었습니다. 사람은 '이건 Primary·Large·Disabled 버튼'이라고 읽지만, AI에겐 수백 개 컴포넌트 중 무엇을 고를지의 기준이 없었던 겁니다.",
          en: "Ask AI for a mockup and the screen looks fine — until you bring it into Figma and find empty boxes labeled 'Button'. No color, size or state. A person reads 'Primary, Large, Disabled'; AI had no criteria for choosing among hundreds of components.",
        },
      },
      {
        image: "/images/sdui/___.png",
        caption: { ko: "Type 기준 컴포넌트 템플릿", en: "Component template keyed by Type" },
        text: {
          ko: "Readable · Reasonable · Interactive 세 방향 중 Readable을 첫 MVP로 잡았습니다. SDUI Type을 식별자로 Variant·State·Property와 사용 조건을 하나의 템플릿에 정리하고, UI팀과 어긋나는 값을 조율해 AI·디자이너·개발자가 같은 문서를 보는 SSOT를 만들었습니다.",
          en: "Of three directions — Readable, Reasonable, Interactive — I made Readable the first MVP. Using the SDUI Type as the key, I put Variant, State, Property and usage rules into one template, reconciled mismatches with the UI team, and built a single source of truth shared by AI, designers and engineers.",
        },
      },
      {
        image: "/images/sdui/뮤.png",
        caption: { ko: "50개 컴포넌트 · 5,000개 화면에 공통 템플릿", en: "50 components, one template across 5,000 screens" },
        text: {
          ko: "50개 컴포넌트를 하나의 기준으로 설명했고, 5,000개 화면에 쓰일 공통 템플릿이 됐습니다. 담당자의 기억에 기대던 선택 기준이 문서 한 곳에서 구조와 함께 읽히게 됐어요. 그 md 파일들은 UI팀의 DS Portal로 자리잡았습니다.",
          en: "Fifty components described by one standard, now the shared template for 5,000 screens. Choices that used to live in someone's memory are read from one document, alongside the structure. Those markdown files became the UI team's DS Portal.",
        },
      },
    ],
  },
  {
    id: "next",
    no: "04",
    label: { ko: "NEXT · 구상 중", en: "NEXT · PLANNED" },
    title: { ko: "매번 설명하지 않아도, 바뀐 규칙을 먼저 알려준다면", en: "What if the system reported rule changes before you asked" },
    cover: "/images/sdui/sdui_1111.png",
    draft: true,
    heading: { ko: "지금 하고 싶은 일", en: "What I want to do next" },
    beats: [
      {
        text: {
          ko: "레지스트리를 만들고 나니 다음 질문이 생겼습니다. 기준이 바뀔 때마다 사람이 문서를 다시 확인해야 할까? Git diff·Storybook·Slack을 연결해 변경된 규칙을 먼저 찾아 알려주는, 살아 있는 디자인 시스템을 구상하고 있습니다. 문서가 산출물이 아니라 팀이 함께 참조하는 기준이 되는 일. 그게 제가 하고 싶은 일입니다.",
          en: "Once the registry existed, a new question followed: must a person re-read the docs every time a rule changes? I'm sketching a living design system that connects Git diffs, Storybook and Slack to find and announce changed rules first. Documentation as the standard a team shares, not an artifact left behind — that's the work I want to do.",
        },
      },
    ],
  },
];

export const PRINCIPLES: { title: Localized; text: Localized }[] = [
  { title: { ko: "암묵지를 규칙으로", en: "Tacit knowledge into rules" }, text: { ko: "문서에 적힌 정보와 사람 머릿속의 판단을 구분하고, 후자를 명시적 기준으로 바꿉니다.", en: "Separate what documents say from what people know, and write the latter down as explicit rules." } },
  { title: { ko: "스크립트 · LLM · 사람의 경계", en: "Script · LLM · human boundaries" }, text: { ko: "정형 작업은 코드로 싸고 정확하게, 복잡한 추론은 AI로, 최종 판단은 사람이 합니다.", en: "Structured work goes to cheap, exact code; complex reasoning to AI; the final call to people." } },
  { title: { ko: "문서는 SSOT", en: "Documents as the SSOT" }, text: { ko: "산출물이 아니라 AI·디자인·개발이 같은 기준을 참조하는 단일 진실 공급원으로 설계합니다.", en: "Not an artifact but the single source of truth that AI, design and engineering all reference." } },
];
