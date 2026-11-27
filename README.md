# Hakyeong Lee — Portfolio

개인 포트폴리오 사이트 2개(Technical Writer / Product Designer)를 한 저장소에서 관리합니다. Next.js 기반이고, 로컬 Admin 패널에서 콘텐츠를 저장하면 체크아웃된 브랜치로 push되어 자동 배포됩니다.

## 사이트와 브랜치

| 브랜치 | 사이트 | 로컬 폴더(권장) |
|---|---|---|
| `main` | https://haeilylee-portfolio.vercel.app/ (Technical Writer) | `technical-writer/` |
| `design` | https://haeilydesign-portfolio.vercel.app/ (Product Designer) | `product-design/` |

공통 코드는 `main`에 커밋한 뒤 `design`에 merge합니다. `archive/*` 브랜치는 이전 작업 보관용입니다.

## 로컬 세팅

```bash
git clone https://github.com/haeilylee/Portfolio.git technical-writer
cd technical-writer && npm install
git worktree add ../product-design design
cd ../product-design && npm install
```

```bash
npm run dev   # http://localhost:3000, Admin: /admin
```

## 폴더

- `context/` — 작업 규칙(Claude가 `CLAUDE.md`를 통해 읽음)
- `docs/` — 참고 자료(캡처·원고). 사이트 빌드에는 쓰지 않음
- `src/`, `public/` — 사이트 코드와 이미지 (`src/data/content.json`이 콘텐츠)
