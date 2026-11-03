"use client";

import AdminShell from "../../_components/admin-shell";
import ReferenceBadge from "../../_components/reference-badge";
import DropdownPreview from "../../_components/selectors/dropdown-preview";

export default function AdminC() {
  return (
    <>
      <div className="pv-container"><ReferenceBadge id="admin-c" /></div>
      <AdminShell
        variantName="C · Dropdown + Preview"
        placement="after-meta"
        selector={(p) => <DropdownPreview {...p} />}
      />
    </>
  );
}
