import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import { buildStory } from "../../../_shared/story";
import Player from "../../_player";

export default async function PreviewLightDetail({ params }: { params: Promise<{ variant: string; slug: string }> }) {
  const { variant, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || variant !== "a") notFound();
  const { scenes, chapters } = buildStory(project, { covers: false }); // 챕터 표지(“03 Problem” 같은 PPT식 장면)는 장면으로 치지 않는다
  return <Player project={project} scenes={scenes} chapters={chapters} back="/preview/light" />;
}
