# Product Designer 사이트 (`design` → haeilydesign-portfolio)

- 디자인 개편 요청은 이 사이트를 기준으로 한다(2026-11-26 사용자 지정).
- `main`과 같은 코드에서 아래만 다르다.
  - 홈: `src/app/page.tsx` → `src/app/_pd/sketch-home.tsx` (캐릭터·소개 스크롤 인터랙션 + 시리즈별 목록, 상단 내비 숨김)
  - 상위 분류 이름: AI Workflow / Product Design (키는 `knowledge-systems` / `design-systems` 그대로)
  - 소분류: Component Registry / PRD Automation
  - 소개·직함(Product Designer · PD), 프로젝트(Astra, 신한투자 등)는 `content.json`
- 상세(`/projects/[slug]`)는 기존 글 형식 그대로 둔다(2026-11-26 사용자 지정). 새 상세 인터랙션은 `/preview`에서 따로 검토한다.
- 시안 보관: `src/app/preview/home`(홈), `src/app/preview/dark`·`light`(상세 플레이어), 공통 `src/app/preview/_shared`
- 참고: 2026-11-23 `design` 브랜치에서 했던 작업(Featured 캐러셀 제거, "다른 프로젝트 보러가기" 목록, `ai-workflow`/`product-design` 키 변경, 새 bio)은 2026-11-27 정리 때 11-26 배포본 기준으로 덮었다. 다시 쓰려면 커밋 `3c3e5bb`에서 가져온다.
