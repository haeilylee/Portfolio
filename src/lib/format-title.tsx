import { Fragment } from "react";

const BR_TAG = /<br\s*\/?>/gi;

/** Renders a title string as JSX, turning literal "<br>" markers into real line breaks. */
export function renderTitle(title: string) {
  const parts = title.split(BR_TAG);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

/** Strips "<br>" markers for plain-text contexts (alt text, <title>, etc). */
export function stripTitleBreaks(title: string) {
  return title.replace(BR_TAG, " ").replace(/\s+/g, " ").trim();
}
