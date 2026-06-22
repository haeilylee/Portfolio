<!-- PROJECTS_JSON
[
  {"preview":"서버 드리븐 UI 전환에 맞춰 디자인 시스템 컴포넌트를 재정의하고, 개발/디자인 팀 모두가 참조할 수 있는 문서 체계를 구축했어요.","title":"SDUI 대응 컴포넌트 시스템 문서화","desc":"서버 드리븐 UI 전환에 맞춰 디자인 시스템 컴포넌트를 재정의하고, 개발/디자인 팀 모두가 참조할 수 있는 문서 체계를 구축했어요.","tags":["Design System","Figma","Documentation"],"date":"2026/01 → 02","link":"/projects/sdui","image":"","github_url":"","download_url":""},
  {"preview":"기획자가 매번 수동으로 작성하던 요구사항 정의서를 AI 파이프라인으로 자동화했어요.","title":"요구사항 정의서 자동화 생성","desc":"통신사 채널 통합 슈퍼앱 문서 선행연구 R&D 프로젝트에서 기획자가 매번 수동으로 작성하던 요구사항 정의서를 AI 파이프라인으로 자동화했어요.","tags":["AI","Github","Markdown"],"date":"2026/02 → 03","link":"/projects/ai-requirements","image":"","github_url":"","download_url":""},
  {"preview":"사용자 인터뷰와 히트맵 분석으로 핵심 불편 지점을 도출하고, 정보 계층 구조를 재설계해 조회 완료율을 높였어요.","title":"데이터 통화 조회 서비스 UX 개선","desc":"사용자 인터뷰와 히트맵 분석을 통해 핵심 불편 지점을 도출하고, 정보 계층 구조를 재설계해 조회 완료율을 높였어요.","tags":["UX Research","Product"],"date":"2025/09 → 11","link":"/projects/data-ux","image":"","github_url":"","download_url":""}
]
-->

<div class="learn-hero">
  <div class="learn-hero-eyebrow">
    <img src="/profile.webp" alt="Hakyeong Lee" class="learn-hero-avatar" />
    <span class="learn-hero-role">Product Designer · PM</span>
  </div>
  <h1 class="learn-hero-title">Hakyeong Lee</h1>
  <p class="learn-hero-sub">제품의 구조를 설계하고, 팀이 같은 언어로 일할 수 있도록 만드는 일을 해요.</p>
  <div class="filter-bar">
    <button class="filter-chip active" onclick="filterCards('all', this)">전체</button>
    <button class="filter-chip" onclick="filterCards('Design System', this)">Design System</button>
    <button class="filter-chip" onclick="filterCards('AI', this)">AI</button>
    <button class="filter-chip" onclick="filterCards('UX Research', this)">UX Research</button>
    <button class="filter-chip" onclick="filterCards('Product', this)">Product</button>
  </div>
</div>

<div class="learn-section">
  <div class="learn-section-header">
    <span class="learn-section-title">Projects</span>
  </div>
  <div class="project-grid" id="project-grid">

<a class="project-card" href="/projects/sdui" data-tags="Design System,Figma,Documentation">
  <div class="project-card-thumbnail">
    <span class="project-card-category cat-design-system">Design System</span>
    <div class="project-card-thumbnail-placeholder">🗂</div>
  </div>
  <div class="project-card-top">
    <div class="project-card-title">SDUI 대응 컴포넌트 시스템 문서화</div>
    <div class="project-card-preview">서버 드리븐 UI 전환에 맞춰 디자인 시스템 컴포넌트를 재정의하고, 개발/디자인 팀 모두가 참조할 수 있는 문서 체계를 구축했어요.</div>
    <div class="project-card-date">이하경 · 2026/01 → 02</div>
  </div>
</a>

<a class="project-card" href="/projects/ai-requirements" data-tags="AI,Github,Markdown">
  <div class="project-card-thumbnail">
    <span class="project-card-category cat-ai">AI</span>
    <div class="project-card-thumbnail-placeholder">🤖</div>
  </div>
  <div class="project-card-top">
    <div class="project-card-title">요구사항 정의서 자동화 생성</div>
    <div class="project-card-preview">기획자가 매번 수동으로 작성하던 요구사항 정의서를 AI 파이프라인으로 자동화했어요.</div>
    <div class="project-card-date">이하경 · 2026/02 → 03</div>
  </div>
</a>

<a class="project-card" href="/projects/data-ux" data-tags="UX Research,Product">
  <div class="project-card-thumbnail">
    <span class="project-card-category cat-ux">UX Research</span>
    <div class="project-card-thumbnail-placeholder">📊</div>
  </div>
  <div class="project-card-top">
    <div class="project-card-title">데이터 통화 조회 서비스 UX 개선</div>
    <div class="project-card-preview">사용자 인터뷰와 히트맵 분석으로 핵심 불편 지점을 도출하고, 정보 계층 구조를 재설계해 조회 완료율을 높였어요.</div>
    <div class="project-card-date">이하경 · 2025/09 → 11</div>
  </div>
</a>

  </div>
</div>

<script>
function filterCards(tag, btn) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    const tags = card.getAttribute('data-tags') || '';
    card.style.display = (tag === 'all' || tags.includes(tag)) ? '' : 'none';
  });
}
</script>
