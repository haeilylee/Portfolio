"use client";

import AdminShell from "../../_components/admin-shell";
import ReferenceBadge from "../../_components/reference-badge";
import Segmented from "../../_components/selectors/segmented";

export default function AdminB() {
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="admin-b" /></div>
      <AdminShell
        variantName="B · Segmented Selector"
        placement="top"
        selector={(p) => <Segmented {...p} />}
      />
    </>
  );
}
