import React from "react";

import {FORMATTERS, formatPlaceName} from "helpers/formatters";

export function childHealth(profile, health) {
  const first = health && health.length > 0 ? health[0] : null;
  const place = formatPlaceName(first, "health", profile.level);
  const items = health.map(
    (row, idx) => `${idx === health.length - 1 ? "and " : ""}${FORMATTERS.shareWhole(row.proportion_of_children)} are severely ${row.condition}`);
  if (first) {
    return <p>Among children in {place}, {items.join(", ")}.</p>;
  }
  else {
    return <p></p>;
  }
}
