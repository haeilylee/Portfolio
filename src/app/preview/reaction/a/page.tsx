import { readContentLive } from "@/lib/content-live";
import ReferenceBadge from "../../_components/reference-badge";
import ArticleFrame from "../../_components/reaction/article-frame";
import ClapButton from "../../_components/reaction/clap-button";

export const dynamic = "force-dynamic";

export default async function ReactionA() {
  const { projects } = await readContentLive();
  const project = projects[0];
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="reaction-a" /></div>
      <ArticleFrame project={project}>
        <ClapButton slug={project.slug} />
      </ArticleFrame>
    </>
  );
}
