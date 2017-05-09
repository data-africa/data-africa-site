import React from "react";

import {FORMATTERS, formatPlaceName} from "helpers/formatters";

export function childHealth(profile, health, blankFallback = false) {
  if (!health) {
    return blankFallback ? <span></span> : <p>No data available</p>;
  }
  // filter data to the most recent year
  const maxYear = Math.max(...health.map(x => x.year));
  health = health.filter(x => x.year === maxYear);
  const first = health && health.length > 0 ? health[0] : null;
  const place = formatPlaceName(first, "health", profile.level);
  const items = health.map(
    (row, idx) => `${idx === health.length - 1 ? "and " : ""}${FORMATTERS.shareWhole(row.proportion_of_children)} were severely ${row.condition}`);
  if (first) {
    return <p>Among children in {place} in {maxYear}, {items.join(", ")}.</p>;
  }
  else {
    return blankFallback ? <span></span> : <p>No data available</p>;
  }
}

function formatCategory(cat) {
  if (["urban", "rural"].indexOf(cat) >= 0) {
    return `children in ${cat} areas`;
  }
  else {
    return cat;
  }
}

export function childHealthByMode(profile, healthData, mode = "gender") {
  const [categoryA, categoryB] = mode === "gender" ? ["male", "female"] : ["urban", "rural"];

  if (!healthData || healthData.length === 0) {
    return <p>No Data</p>;
  }
  else {
    const latestYear = Math.max(...healthData.map(d => d.year));
    const first = healthData[0];
    const catAData = healthData.filter(x => x.year === latestYear && x[mode] === categoryA && x.severity === "severe");
    const catBData = healthData.filter(x => x.year === latestYear && x[mode] === categoryB && x.severity === "severe");

    const mostSevereSort = (a, b) => b.proportion_of_children - a.proportion_of_children;
    catAData.sort(mostSevereSort);
    catBData.sort(mostSevereSort);
    const sevACond = catAData[0];
    const sevBCond = catBData[0];

    if (sevACond && !sevBCond || sevBCond && !sevACond) {
      const [category, cond] = sevACond ? [categoryA, sevACond] : [categoryB, sevBCond];
      return <p>The health condition most severely afflicting {category} children
         in {latestYear} in {place} is severely {cond.condition} children
        with {FORMATTERS.shareWhole(cond.proportion_of_children)} of {categoryA} children
         affected.</p>;
    }

    const sameCondition = sevBCond.condition === sevACond.condition;
    const place = formatPlaceName(first, "health", profile.level);

    if (sameCondition) {
      return <p>The health condition most severely afflicting {categoryA} and {categoryB} children
       in {latestYear} in {place} is severely {sevACond.condition} children
      with {FORMATTERS.shareWhole(sevACond.proportion_of_children)} of {categoryA} children
       affected and {FORMATTERS.shareWhole(sevBCond.proportion_of_children)} of {categoryB} children affected.</p>;
    }
    else {
      return <p>The health condition most severely afflicting {formatCategory(categoryA)} in {latestYear} in {place} is
       severely {sevACond.condition} children
      with {FORMATTERS.shareWhole(sevACond.proportion_of_children)} of {categoryA} children
       affected. The health condition most severely afflicting {formatCategory(categoryB)} in {place}
       is severely {sevACond.condition} children with {FORMATTERS.shareWhole(sevBCond.proportion_of_children)} of {categoryB} children affected.</p>;
    }
  }
}
