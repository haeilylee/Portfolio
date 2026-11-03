"use client";

import AdminShell from "../../_components/admin-shell";
import ReferenceBadge from "../../_components/reference-badge";
import InlineChips from "../../_components/selectors/inline-chips";

export default function AdminA() {
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="admin-a" /></div>
      <AdminShell
        variantName="A · Inline Chips"
        placement="between-title-and-meta"
        selector={(p) => <InlineChips {...p} />}
      />
    </>
  );
}
