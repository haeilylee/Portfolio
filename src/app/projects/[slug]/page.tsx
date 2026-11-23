import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/projects";
import { stripTitleBreaks } from "@/lib/format-title";
import ProjectDetail from "@/components/project-detail";
import MoreProjects from "@/components/more-projects";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project ? `${stripTitleBreaks(project.title)} — Hakyeong Lee` : "Not Found" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  // 본문 끝 '다른 프로젝트 보러가기' — 번호 리스트 + 썸네일 (2026-11-23 확정, 시안 C)
  return <ProjectDetail project={project} more={<MoreProjects current={slug} variant="list" />} />;
}
