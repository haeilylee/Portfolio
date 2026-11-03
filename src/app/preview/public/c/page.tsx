import { readContentLive } from "@/lib/content-live";
import ReferenceBadge from "../../_components/reference-badge";
import VelogChips from "../../_components/public/velog-chips";

export const dynamic = "force-dynamic";

export default async function PublicC() {
  const { projects } = await readContentLive();
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="public-c" /></div>
      <VelogChips projects={projects} />
    </>
  );
}
