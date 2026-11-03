import { readContentLive } from "@/lib/content-live";
import ReferenceBadge from "../../_components/reference-badge";
import ArticleFrame from "../../_components/reaction/article-frame";
import EmojiBar from "../../_components/reaction/emoji-bar";

export const dynamic = "force-dynamic";

export default async function ReactionB() {
  const { projects } = await readContentLive();
  const project = projects[0];
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="reaction-b" /></div>
      <ArticleFrame project={project} afterBody={<EmojiBar slug={project.slug} />} />
    </>
  );
}
