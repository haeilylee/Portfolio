# Portfolio — 작업 규칙

이 파일은 매 세션 자동으로 읽힌다. 사용자가 정한 규칙이 생기면 여기에 바로 추가한다.

## 1. 콘텐츠 노출 규칙

- **주요 성과(`outcomes`)는 홈 목록에만 노출한다.** 프로젝트 상세 페이지 본문에는 넣지 않는다.
  - 예: "수작업으로 진행되던 요구사항 정의를 AI 워크플로우로 자동화, 실제 WBS 기준 30일 → 3일로 단축" → 홈 목록 불릿 전용
  - 상세 페이지 흐름: eyebrow(분류·기간) → 제목 → 히어로 → 핵심 인사이트(인용) → Skills/Tools → 본문 `sections`
- **프로젝트 프리뷰/설명(`preview`, `desc`) 필드는 쓰지 않는다.** Admin 입력란, FO(홈 목록·카드·상세 요약) 노출, 타입·데이터에서 모두 제거했다(2026-11-04). 목록이나 상세에 요약 문단을 다시 넣지 않는다.
  - 툴 설명(`tools[].desc`), 표 블록 설명(`rows[].desc`)은 다른 필드라 유지한다.
- **홈 구조는 toss.tech형(Home B)이다** — `src/components/home-feed.tsx`
  - 대표 프로젝트 캐러셀 → 탭(전체 / 상위 분류) → 목록 5개씩 + "더보기" → 오른쪽 사이드(인기 있는 프로젝트(박수 순) · 최근 댓글 · 시리즈)
  - 목록 행에도 성과 불릿을 유지한다(이력서 의도). 불릿을 없애는 매거진·연재형은 채택하지 않는다.
- **상위 분류(Collection)**는 `knowledge-systems` / `design-systems` 두 가지이며, `src/lib/collections.ts`에 정의한다. 지정은 Admin의 칩으로 한다.
  - 기존 `category`(AI, AI Design System 등)는 별도의 소분류 레이블이다.

- **목차(TOC)는 2단 구조이고 Admin에서 직접 입력한다.** 코드에 슬러그별 그룹 배열을 하드코딩하지 않는다.
  - 상위 분류 `sections[].group`: 기본 구성은 **Background → Problem → Solution → Outcome**. 목차에서 Helvetica 검정 이탤릭으로 나온다
  - 세부 분류 `sections[].subgroup`(예: Solution 안의 Workflow, 시행착오): 연회색 채움 배지로 나오고, 그 구간을 읽는 중이면 한 톤 진해진다. 그 아래 항목은 한 단계 더 들여쓴다
  - 첫 항목 이름은 `overviewLabel`(비우면 Overview)
  - 목차를 클릭하면 섹션 제목이 상단 내비게이션 바로 아래(본문 최상단, 내비 높이 + 32px)에 오도록 스크롤한다 — `src/components/toc-nav.tsx`
- **다음 이야기(Next)는 본문에 넣지 않는다.** Admin에서 섹션의 "다음 이야기로 표시"(`sections[].kind = "next"`)를 체크하면, 본문과 목차에서 빠지고 본문 끝·댓글 위에 **시리즈 로드맵**(01 지금 읽은 글 → 02 다음 이야기)으로 나온다 — `src/components/next-roadmap.tsx`
  - 연결할 공개 프로젝트(`nextSlug`)가 없으면 "작업 중": 흑백·점선·링크 없음, 첫 단락만 보이고 나머지는 "구상 내용 더 보기"로 펼친다
  - 연결하면 색이 돌아오고 해당 프로젝트로 링크된다
  - "→ 다음 프로젝트에서 이어 보기" 같은 안내 문장은 본문에 쓰지 않는다(로드맵이 대신한다)
- **하이라이트 구문**(Admin의 `insightHighlights`, 예: "AI-Readable 디자인 시스템을 위해 공통의 기준을 가진 컴포넌트 레지스트리를 구축") 스타일은 모든 프로젝트에 일괄 적용한다 — `src/components/project-blocks.tsx`의 `renderWithHighlights` 한 곳에서만 정의
  - 형광펜: 진행바 파랑(#3182f6)의 23% 불투명도 → `rgba(49, 130, 246, 0.23)`, 글자 아래 45% 높이
  - 글자: 볼드(700) + 본문(#444)보다 진한 검정 `#111`

## 2. 시안 작업 방식

- 시안은 기본 **3개**로 제안한다. 확정되면 `/preview` 시안 코드와 이력은 지운다(2026-11-04에 전부 정리함). 새 시안이 필요하면 `/preview/<group>/{a,b,c}`(개발 환경 전용)로 다시 만든다.
- 각 시안에는 참고한 레퍼런스(사이트·패턴·URL)를 표시한다.
- 실제 데이터가 부족해서 넣은 항목(목록을 늘린 예시, mock 숫자·댓글)에는 화면에 "예시"라고 표시한다.
- 개발 서버(Turbopack)가 `globals.css` 변경을 놓치는 경우가 있다. 스타일이 안 먹으면 `.next`를 지우고 `npm run dev`를 재시작한다.
- 운영에 반영하기 전에 로컬(`npm run dev` → localhost:3000)에서 홈부터 상세까지 읽는 흐름을 먼저 보여주고 확인을 받는다.

## 3. 배포

- 운영 도메인: **https://haeilylee-portfolio.vercel.app/**
  - 이 도메인은 Vercel 프로젝트 **`haeilylee-portfolio`**(GitHub `haeilylee/Portfolio`의 `main`에 연결)에 붙어 있다.
  - 2026-11-04부터 이 주소는 프로젝트의 **정식 운영 도메인**으로 등록돼 있다. `main`에 push하면 빌드가 끝나는 대로 자동 반영되고, 누구나 로그인 없이 볼 수 있다.
  - 예전처럼 `vercel alias set`으로 수동 연결하지 않는다. 수동 alias 주소는 Vercel 보호(로그인) 대상이 되어 외부에서 볼 수 없다.
  - 배포 확인: `vercel ls haeilylee-portfolio`로 최신 배포가 Ready인지 보고, 로그인하지 않은 상태에서 `curl`로 운영 주소를 열어 확인한다.
- 이 프로젝트에는 아직 Upstash Redis 환경변수가 없다. 그래서 운영에서는 박수 버튼, 댓글, 홈 인기·댓글 구좌가 숨겨져 있다. Vercel Marketplace에서 Upstash를 `haeilylee-portfolio` 프로젝트에 연결하면 켜진다.
- 로컬 `.vercel/`은 다른 프로젝트(`portfolio`)에 연결돼 있다. 여기서 `vercel --prod`를 실행해도 운영 사이트에는 반영되지 않으니 쓰지 않는다.
- 운영에 반영하는 작업(push, alias 변경)은 사용자에게 확인을 받은 뒤에 실행한다.
- Admin 저장은 화면에 불러온 데이터 전체로 `content.json`을 덮어쓴다. 코드에서 데이터 구조(필드)를 바꾼 뒤에는 Admin을 새로고침하고 편집해야 한다. 그렇지 않으면 새 필드가 지워진다(2026-11-04 목차 그룹이 지워져 복구함). 커밋 전에 `git diff src/data/content.json`으로 의도치 않게 지워진 필드가 없는지 확인한다.
- Admin 저장은 로컬 커밋까지만 만들고, push가 안 되는 경우가 있다. 배포할 때 `git log origin/main..main`으로 남은 커밋을 확인한다.
- Admin 배포 버튼은 git remote URL에 넣어 둔 PAT로 push한다. "배포 중 오류"가 나면 PAT가 만료된 경우가 많다.

## 4. Git

- `main` = 운영 브랜치. `web-publish`, `wp-deploy`는 예전 작업 브랜치다.
- `tsconfig.tsbuildinfo`는 빌드 캐시이므로 커밋 대상이 아니다.
- remote URL에 토큰이 들어 있으므로 `git remote -v` 출력을 그대로 보여주지 않는다.

## 5. 반응(박수·댓글)

- 박수는 1인 1회 익명 방식이다(visitor ID, Upstash Redis `clap:{slug}`). 누가 쳤는지는 알 수 없으므로 "박수 많이 친 사람" 같은 순위는 만들 수 없다.
- 댓글: 상세 본문 끝(`#comments`), 닉네임(선택) + 300자, 같은 방문자 30초 간격 제한. 저장소 `src/lib/comment-store.ts` (Redis `comments:{slug}`, `comments:recent`; 로컬은 `src/data/comments.dev.json`).
  - 저장소가 없으면(Redis 환경변수 없음) 댓글 영역과 홈 구좌가 자동으로 숨는다.
  - 삭제(모더레이션)는 아직 Upstash 콘솔에서 직접 한다.
