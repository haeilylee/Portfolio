# Portfolio — 작업 규칙 (목차)

이 파일은 매 세션 자동으로 읽힌다. 규칙 본문은 `context/`에 있고 아래에서 불러온다.
사용자가 새 규칙을 말하면 맞는 `context/` 파일에 바로 추가한다.

## 저장소 한눈에 보기

- 원본은 GitHub `haeilylee/Portfolio` 하나다. 로컬 폴더는 지워도 되는 작업 공간이고, 남길 것은 전부 커밋·push한다.
- 사이트 2개 = 브랜치 2개 = 로컬 폴더 2개 (같은 저장소의 git worktree)

  | 로컬 폴더 (`Toss TW/` 아래) | 브랜치 | 사이트 |
  |---|---|---|
  | `technical-writer/` | `main` | https://haeilylee-portfolio.vercel.app/ |
  | `product-design/` | `design` | https://haeilydesign-portfolio.vercel.app/ |

- 지금 어느 폴더에서 작업 중인지(`git branch --show-current`)로 대상 사이트를 판단한다.
- 저장소 안 폴더
  - `context/` — Claude가 읽는 작업 규칙 (두 브랜치 공통 파일)
  - `docs/` — 사람이 보는 참고 자료(캡처·원고 등). 사이트 빌드에는 쓰지 않는다
  - `src/`, `public/` — 사이트 코드와 이미지

## 규칙

- 공통(콘텐츠·시안·고객사 글·반응): @context/common.md
- 배포·Git·Admin: @context/deploy.md
- Technical Writer 사이트(`main`) 전용: @context/technical-writer.md
- Product Designer 사이트(`design`) 전용: @context/product-design.md
