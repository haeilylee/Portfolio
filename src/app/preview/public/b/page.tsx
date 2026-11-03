import { readContentLive } from "@/lib/content-live";
import ReferenceBadge from "../../_components/reference-badge";
import BrunchSeries from "../../_components/public/brunch-series";

export const dynamic = "force-dynamic";

export default async function PublicB() {
  const { projects } = await readContentLive();
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="public-b" /></div>
      <BrunchSeries projects={projects} />
    </>
  );
}
