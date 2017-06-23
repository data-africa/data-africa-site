import React from "react";
import {nest} from "d3-collection";
import {merge} from "d3plus-common";
import {titleCase} from "d3plus-text";

import {FORMATTERS, formatPlaceName} from "helpers/formatters";

export function childHealth(profile, health, blankFallback = false, stat = true) {
  if (!health) {
    return blankFallback ? <span></span> : <p>No data available</p>;
  }
  // filter data to the most recent year
  const maxYear = Math.max(...health.map(x => x.year));
  health = health.filter(x => x.year === maxYear);
  const first = health && health.length > 0 ? health[0] : null;
  const level = first.geo && first.geo !== profile.geo ? "adm0" : profile.level;
  const place = formatPlaceName(first, "health", level);
  const items = health.map(
    (row, idx) => `${idx === health.length - 1 ? "and " : ""}${FORMATTERS.shareWhole(row.proportion_of_children)} were severely ${row.condition}`);
  if (first) {
    return <div>
      { stat
      ? <div className="stat">
          <div className="stat-value">{ FORMATTERS.shareWhole(health[0].proportion_of_children) }</div>
          <div className="stat-label">Severely { titleCase(health[0].condition) }</div>
        </div>
      : null }
      <p>Among children in {place} in {maxYear}, {items.join(", ")}.</p>
    </div>;
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

function formatCondition(condName) {
  if (condName === "underweight") {
    return "being underweight";
  }
  else if (condName === "stunted") {
    return "stunting";
  }
  else if (condName === "wasted") {
    return "wasting";
  }
  return condName;
}

export function childHealthByMode(profile, healthData, mode = "gender") {
  const [categoryA, categoryB] = mode === "gender" ? ["male", "female"] : ["urban", "rural"];

  if (!healthData || healthData.length === 0) {
    return <p>No Data</p>;
  }
  else {
    const latestYear = Math.max(...healthData.map(d => d.year));
    const first = healthData[0];
    const catAData = healthData.filter(x => x.year === latestYear && x[mode] === categoryA);
    const catBData = healthData.filter(x => x.year === latestYear && x[mode] === categoryB);

    const column = "proportion_of_children";

    const dataNestA = nest()
      .key(d => [d.year, d.condition])
      .entries(catAData)
      .map(d => merge(d.values))
      .sort((a, b) => b[column] - a[column]);

    const dataNestB = nest()
      .key(d => [d.year, d.condition])
      .entries(catBData)
      .map(d => merge(d.values))
      .sort((a, b) => b[column] - a[column]);

    const sevACond = dataNestA[0];
    const sevBCond = dataNestB[0];

    if (sevACond && !sevBCond || sevBCond && !sevACond) {
      const [category, cond] = sevACond ? [categoryA, sevACond] : [categoryB, sevBCond];
      return <p>The health condition most afflicting {category} children
         in {latestYear} in {place} is {formatCondition(cond.condition)} children
        with {FORMATTERS.shareWhole(cond.proportion_of_children)} of {categoryA} children
         affected.</p>;
    }

    const sameCondition = sevBCond.condition === sevACond.condition;
    const level = first.geo && first.geo !== profile.geo ? "adm0" : profile.level;
    const place = formatPlaceName(first, "health", level);

    const Stat = () => <div className="stat-flex">
      <div className="stat">
        <div className="stat-value">{ FORMATTERS.shareWhole(sevACond.proportion_of_children) }</div>
        <div className="stat-label">{ titleCase(categoryA) } { titleCase(formatCondition(sevACond.condition)) }</div>
      </div>
      <div className="stat">
        <div className="stat-value">{ FORMATTERS.shareWhole(sevBCond.proportion_of_children) }</div>
        <div className="stat-label">{ titleCase(categoryB) } { titleCase(formatCondition(sevBCond.condition)) }</div>
      </div>
    </div>;

    if (sameCondition) {
      return <div>
        <Stat />
        <p>The health condition most afflicting {categoryA} and {categoryB} children
         in {latestYear} in {place} is {formatCondition(sevACond.condition)} with {FORMATTERS.shareWhole(sevACond.proportion_of_children)} of {categoryA} children
         affected and {FORMATTERS.shareWhole(sevBCond.proportion_of_children)} of {categoryB} children affected.</p>
      </div>;
    }
    else {
      return <div>
        <Stat />
        <p>The health condition most afflicting {formatCategory(categoryA)} in {latestYear} in {place} is {formatCondition(sevACond.condition)} with {FORMATTERS.shareWhole(sevACond.proportion_of_children)} of {categoryA} children
         affected. The health condition most afflicting {formatCategory(categoryB)} in {place} is {formatCondition(sevBCond.condition)} with {FORMATTERS.shareWhole(sevBCond.proportion_of_children)} of {categoryB} children affected.</p>
      </div>;
    }
  }
}
