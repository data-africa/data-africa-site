import React from "react";
import pluralize from "pluralize";

import {DICTIONARY} from "helpers/dictionary";
import {VARIABLES, FORMATTERS, formatPlaceName} from "helpers/formatters";


export function povertyContent(profile, poverty) {
  const first = poverty && poverty.length > 0 ? poverty[0] : null;
  const items = poverty.map(row => `${VARIABLES.totpop(row.num)} people living below ${DICTIONARY[row.poverty_level]}`);
  const place = formatPlaceName(first, "poverty", profile.level);
  return <p>As of {first.year}, in {place} there were {items.join(" and ")}.</p>;
}


export function povertyByModeContent(profile, povertyData, povLevel, mode = "gender") {
  if (!povertyData || povertyData.length === 0) {
    return <p>No data available</p>;
  }

  const [categoryA, categoryB] = mode === "gender" ? ["male", "female"] : ["urban", "rural"];

  const first = povertyData[0];
  const place = formatPlaceName(first, "poverty", profile.level);
  let modeA = povertyData.filter(x => x[mode] === categoryA && povLevel === x.poverty_level);
  let modeB = povertyData.filter(x => x[mode] === categoryB && povLevel === x.poverty_level);
  modeA = modeA.length > 0 ? modeA[0] : null;
  modeB = modeB.length > 0 ? modeB[0] : null;

  return <p>As of {first.year}, {FORMATTERS.shareWhole(modeA.hc)} of {pluralize.plural(categoryA)} and {FORMATTERS.shareWhole(modeB.hc)} of {pluralize.plural(categoryB)} in {place} live below {DICTIONARY[modeB.poverty_level]}.</p>;
}
