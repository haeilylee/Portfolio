import { projects, hero } from "@/lib/projects";
import HomeFeed from "@/components/home-feed";
import HomeHero from "@/components/home-hero";

export default function HomePage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div className="home-container" style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 56px" }}>

        <HomeHero hero={hero} />

        {/* ── Projects — 대표 캐러셀 · 탭 목록 · 인기/댓글/시리즈 사이드 (toss.tech 구조) ── */}
        <HomeFeed projects={projects} />
        <div style={{ height: "80px" }} />
      </div>
    </div>
  );
}
