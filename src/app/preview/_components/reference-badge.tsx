import { getVariant, GROUP_LABEL } from "./variants";

export default function ReferenceBadge({ id }: { id: string }) {
  const v = getVariant(id);
  if (!v) return null;
  return (
    <div className="pv-ref">
      <span className="pv-ref-tag">
        {GROUP_LABEL[v.group]} {v.letter}
      </span>
      <b>{v.name}</b>
      <span>·</span>
      <span>
        Reference: <b>{v.reference.site}</b> — {v.reference.pattern}
      </span>
      <a href={v.reference.url} target="_blank" rel="noopener noreferrer">
        원본 보기 ↗
      </a>
    </div>
  );
}
