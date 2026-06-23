# Hakyeong Lee — Portfolio

개인 포트폴리오 사이트입니다. Next.js 기반으로 제작되었으며, 로컬 Admin 패널에서 콘텐츠를 수정하면 이 브랜치로 자동 배포됩니다.

## 브랜치 구조

| 브랜치 | 용도 |
|---|---|
| `main` | 소스 코드 베이스 |
| `web-publish` | **Vercel 배포 브랜치** — Admin에서 저장/배포 시 이 브랜치로 푸시됨 |

## 배포 파이프라인

```
localhost:3000/admin → 저장하기 / Vercel 배포 버튼
    → content.json 업데이트
    → git push origin web-publish
    → Vercel 자동 빌드 & 배포
    → https://haeilylee-portfolio.vercel.app/
```

## 로컬 실행

```bash
npm install
npm run dev
```

Admin 패널: http://localhost:3000/admin
