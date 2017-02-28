import React from "react";

import {DICTIONARY} from "helpers/dictionary";
import {VARIABLES, formatPlaceName} from "helpers/formatters";


export function povertyContent(profile, poverty) {
  const first = poverty && poverty.length > 0 ? poverty[0] : null;
  const items = poverty.map(row => `${VARIABLES.totpop(row.num)} people living below ${DICTIONARY[row.poverty_level]}`);
  const place = formatPlaceName(first, "poverty", profile.level);
  return <p>As of {first.year}, in {place} there were {items.join(" and ")}.</p>;
}
