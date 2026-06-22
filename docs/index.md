# Hakyeong Lee

디자이너이자 개발자로, 복잡한 문제를 명확한 경험으로 풀어냅니다.

<div class="filter-bar">
  <button class="filter-chip active" onclick="filterCards('all', this)">전체</button>
  <button class="filter-chip" onclick="filterCards('Design System', this)">Design System</button>
  <button class="filter-chip" onclick="filterCards('AI', this)">AI</button>
  <button class="filter-chip" onclick="filterCards('UX Research', this)">UX Research</button>
  <button class="filter-chip" onclick="filterCards('Product', this)">Product</button>
</div>

<div class="project-grid" id="project-grid">

<div class="project-card" data-tags="Design System,Figma,Documentation">
  <div class="project-card-preview">컴포넌트 체계를 모두가 이해할 수 있는 구조로 세우고, 실제로 대응할 수 있는 형태로 정리했어요.</div>
  <div class="project-card-body">
    <div class="project-card-title">SDUI 대응 컴포넌트 시스템 문서화</div>
    <div class="project-card-desc">디자인 시스템의 구조를 팀 전체가 이해할 수 있도록 문서화하고 온보딩 리소스를 구축했어요.</div>
    <div class="project-card-tags">
      <span class="project-tag tag-blue">Design System</span>
      <span class="project-tag tag-green">Figma</span>
      <span class="project-tag tag-amber">Documentation</span>
    </div>
    <div class="project-card-date">2026/01/01 → 2026/02/01</div>
  </div>
</div>

<div class="project-card" data-tags="AI,Github,Markdown">
  <div class="project-card-preview">AI를 활용해 반복 작업을 자동화하고, 팀의 리소스를 핵심 작업에 집중할 수 있도록 개선했어요.</div>
  <div class="project-card-body">
    <div class="project-card-title">요구사항 정의서 자동화 생성</div>
    <div class="project-card-desc">통신사 채널 통합 슈퍼앱 문서 선행연구 R&D 프로젝트에서 요구사항 정의 프로세스를 AI로 자동화.</div>
    <div class="project-card-tags">
      <span class="project-tag tag-purple">AI</span>
      <span class="project-tag tag-green">Github</span>
      <span class="project-tag tag-amber">Markdown</span>
    </div>
    <div class="project-card-date">2026/02/28 → 2026/03/20</div>
  </div>
</div>

<div class="project-card" data-tags="UX Research,Product">
  <div class="project-card-preview">사용자 흐름을 분석하고, 핵심 경험을 개선해 전환율과 만족도를 높였어요.</div>
  <div class="project-card-body">
    <div class="project-card-title">프로젝트 이름</div>
    <div class="project-card-desc">프로젝트 한 줄 설명. 어떤 문제를 해결했는지, 어떤 임팩트를 만들었는지.</div>
    <div class="project-card-tags">
      <span class="project-tag tag-blue">UX Research</span>
      <span class="project-tag tag-pink">Product</span>
    </div>
    <div class="project-card-date">2025/xx/xx → 2025/xx/xx</div>
  </div>
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
