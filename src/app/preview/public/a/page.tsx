import { Suspense } from "react";
import { readContentLive } from "@/lib/content-live";
import ReferenceBadge from "../../_components/reference-badge";
import TossNav from "../../_components/public/toss-nav";

export const dynamic = "force-dynamic";

export default async function PublicA() {
  const { projects } = await readContentLive();
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="public-a" /></div>
      <Suspense fallback={null}>
        <TossNav projects={projects} />
      </Suspense>
    </>
  );
}
