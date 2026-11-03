import { readContentLive } from "@/lib/content-live";
import ReferenceBadge from "../../_components/reference-badge";
import ArticleFrame from "../../_components/reaction/article-frame";
import ClapBInline from "../../_components/reaction/clap-b-inline";

export const dynamic = "force-dynamic";

// 시안마다 저장 키를 분리(slug#clap-x)해서 하루 5회 한도를 각각 따로 테스트할 수 있게 한다.
export default async function ClapB() {
  const { projects } = await readContentLive();
  const project = projects[0];
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="clap-b" /></div>
      <ArticleFrame project={project} afterBody={<ClapBInline slug={`${project.slug}#clap-b`} />} />
    </>
  );
}
