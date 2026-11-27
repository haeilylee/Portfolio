import { projects } from "@/lib/projects";
import SketchHome from "./_pd/sketch-home";

/** PD 사이트 홈 — 캐릭터·소개 스크롤 인터랙션 + 시리즈별 목록. 상세는 기존 /projects/[slug] 그대로 */
export default function HomePage() {
  return (
    <>
      <style>{`
        .site-nav { display: none !important; }
        main { padding-top: 0 !important; }
        html { background: #f6f7f9 !important; }
        body { background: transparent !important; }
      `}</style>
      <SketchHome projects={projects} />
    </>
  );
}
