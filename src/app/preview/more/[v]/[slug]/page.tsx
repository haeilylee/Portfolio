import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import ProjectDetail from "@/components/project-detail";
import MoreProjects, { type MoreVariant } from "@/components/more-projects";
import { ReferenceBadge } from "../../../_components/preview-bar";

const MAP: Record<string, MoreVariant> = { a: "next", b: "grid", c: "list" };

/** 상세 하단 '다른 프로젝트 보러가기' 시안 — 실제 상세 페이지에 꽂아서 본다. 하단으로 스크롤해서 확인 */
export default async function MorePreview({ params }: { params: Promise<{ v: string; slug: string }> }) {
  const { v, slug } = await params;
  const project = getProjectBySlug(slug);
  const variant = MAP[v];
  if (!project || !variant) notFound();
  return (
    <>
      <div className="pv-container"><ReferenceBadge id={`more-${v}`} note="초안 프로젝트는 '준비 중'으로 표시 — 공개되면 링크됨" /></div>
      <ProjectDetail project={project} more={<MoreProjects current={slug} variant={variant} />} />
    </>
  );
}
