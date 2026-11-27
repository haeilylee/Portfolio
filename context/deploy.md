# 배포 · Git · Admin

## 배포

- **사이트 2개 = 브랜치 2개** (2026-11-23)
  | 브랜치 | Vercel 프로젝트 | 도메인 |
  |---|---|---|
  | `main` | `haeilylee-portfolio` | https://haeilylee-portfolio.vercel.app/ |
  | `design` | `haeilydesign-portfolio` | https://haeilydesign-portfolio.vercel.app/ |
  - 각 프로젝트는 자기 브랜치를 production으로 자동 배포한다. 다른 브랜치 push는 preview로만 빌드된다.
  - `vercel deploy`(CLI)나 `vercel alias set`으로 수동 배포하지 않는다. push한 커밋만 운영에 나가야 git과 운영이 어긋나지 않는다(2026-11-26까지 PD 사이트를 CLI로 올려서 git과 어긋났던 적이 있음).
  - 확인: `vercel ls <프로젝트> --scope haeilylees-projects` → Ready, 로그인 없이 `curl`로 200.
- **운영에 반영하는 작업(`main`/`design` push)은 사용자에게 확인을 받은 뒤에 실행한다.**

## Git

- 원본은 GitHub 하나. 로컬 폴더 `technical-writer/`(main), `product-design/`(design)는 같은 저장소의 worktree다.
  - 새 컴퓨터에서 받기: `git clone <repo> technical-writer && cd technical-writer && git worktree add ../product-design design`
- 두 사이트에 공통인 코드·`context/`·`docs/` 변경은 `main`에 커밋한 뒤 `design`에서 `git merge main`한다. 콘텐츠(`content.json`)와 사이트 전용 화면은 브랜치별로 다르게 유지한다.
- `archive/*` 브랜치는 정리 전 로컬 작업 보관용이다(2026-11-27). 지우지 않는다.
- `tsconfig.tsbuildinfo`, `.next`, `doc_build`는 빌드 캐시이므로 커밋 대상이 아니다.
- remote URL에 토큰이 들어 있으므로 `git remote -v` 출력을 그대로 보여주지 않는다.

## Admin (localhost:3000/admin)

- Admin은 **dev 서버를 띄운 폴더의 체크아웃 브랜치**에 커밋·푸시한다(`src/lib/site-target.ts`). TW는 `technical-writer/`, PD는 `product-design/`에서 `npm run dev`. Admin 상단 배지로 대상을 확인한다.
- 저장하면 `content.json`·`public/images`만 커밋하고 바로 push한다. 그래서 Admin에서 올린 내용은 항상 git에 먼저 남는다.
- Admin 저장은 화면에 불러온 데이터 전체로 `content.json`을 덮어쓴다. 코드에서 데이터 구조(필드)를 바꾼 뒤에는 Admin을 새로고침하고 편집해야 한다. 그렇지 않으면 새 필드가 지워진다(2026-11-04 목차 그룹이 지워져 복구함). 커밋 전에 `git diff src/data/content.json`으로 의도치 않게 지워진 필드가 없는지 확인한다.
- push가 실패해 로컬 커밋만 남는 경우가 있다. `git status`에서 `ahead`가 보이면 push한다.
- Admin push는 git remote URL에 넣어 둔 PAT로 한다. "배포 중 오류"가 나면 PAT가 만료된 경우가 많다.
