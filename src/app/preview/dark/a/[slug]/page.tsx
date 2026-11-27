import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import { buildStory } from "../../../_shared/story";
import DarkDetail from "../../_detail";

export default async function PreviewDarkDetailA({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const { scenes, chapters } = buildStory(project);
  return <DarkDetail project={project} scenes={scenes} chapters={chapters} variant="a" />;
}
