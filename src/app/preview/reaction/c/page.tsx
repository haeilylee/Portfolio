import { readContentLive } from "@/lib/content-live";
import ReferenceBadge from "../../_components/reference-badge";
import ArticleFrame from "../../_components/reaction/article-frame";
import Guestbook from "../../_components/reaction/guestbook";

export const dynamic = "force-dynamic";

export default async function ReactionC() {
  const { projects } = await readContentLive();
  const project = projects[0];
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="reaction-c" /></div>
      <ArticleFrame project={project} afterBody={<Guestbook slug={project.slug} />} />
    </>
  );
}
