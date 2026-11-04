import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/projects";
import { stripTitleBreaks } from "@/lib/format-title";
import ProjectDetail from "@/components/project-detail";

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
  return <ProjectDetail project={project} />;
}
