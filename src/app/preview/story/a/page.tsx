import { projects } from "@/lib/projects";
import HomeFeed from "@/components/home-feed";
import StoryHero from "../../_components/story-hero";
import StoryScroll from "../../_components/story-scroll";
import StoryFooter from "../../_components/story-footer";
import { ReferenceBadge } from "../../_components/preview-bar";

/**
 * Story A — 홈 자체가 자소서.
 * 첫 화면부터 헤드라인 → 짧은 단락 + 우측 프로젝트 카드 스택(expand) → 원칙·연락 → 전체 프로젝트 목록.
 */
export default function StoryA() {
  return (
    <div className="st-page" data-tone="dark" id="top">
      <div className="st-container">
        <ReferenceBadge id="a" note="01 배경 단락은 예시 — 실제 경력으로 교체 필요" />
        <StoryHero terminal={true} tone="dark" />
        <StoryScroll mode="expand" />
        <StoryFooter tone="dark" />
      </div>
      <div className="st-feed">
        <div className="st-container">
          <div className="st-feed-head">
            <div className="sf-eyebrow">Projects</div>
            <h2>모든 프로젝트</h2>
          </div>
          <HomeFeed projects={projects} />
          <div style={{ height: "80px" }} />
        </div>
      </div>
    </div>
  );
}
