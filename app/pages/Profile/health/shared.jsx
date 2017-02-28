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
    const first = healthData[0];
    const catAData = healthData.filter(x => x[mode] === categoryA && x.severity === "severe");
    const catBData = healthData.filter(x => x[mode] === categoryB && x.severity === "severe");

    const mostSevereSort = (a, b) => b.proportion_of_children - a.proportion_of_children;
    catAData.sort(mostSevereSort);
    catBData.sort(mostSevereSort);
    const sevACond = catAData[0];
    const sevBCond = catBData[0];
    const sameCondition = sevBCond.condition === sevACond.condition;
    const place = formatPlaceName(first, "health", profile.level);

    if (sameCondition) {
      return <p>The health condition most severely afflicting {categoryA} and {categoryB} children
       in {place} is severely {sevACond.condition} children
      with {FORMATTERS.shareWhole(sevACond.proportion_of_children)} of {categoryA} children
       affected and {FORMATTERS.shareWhole(sevBCond.proportion_of_children)} of {categoryB} children affected.</p>;
    }
    else {
      return <p>The health condition most severely afflicting {formatCategory(categoryA)} in {place} is
       severely {sevACond.condition} children
      with {FORMATTERS.shareWhole(sevACond.proportion_of_children)} of {categoryA} children
       affected. The health condition most severely afflicting {formatCategory(categoryB)} in {place}
       is severely {sevACond.condition} children with {FORMATTERS.shareWhole(sevBCond.proportion_of_children)} of {categoryB} children affected.</p>;
    }
  }
}
