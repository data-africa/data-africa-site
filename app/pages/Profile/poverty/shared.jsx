import React from "react";
import pluralize from "pluralize";

import {DICTIONARY} from "helpers/dictionary";
import {VARIABLES, FORMATTERS, formatPlaceName} from "helpers/formatters";
import {dataFold} from "d3plus-viz";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {API} from ".env";
import {COLORS_RESIDENCE, COLORS_GENDER} from "helpers/colors";

export function povertyContent(profile, poverty) {
  const first = poverty && poverty.length > 0 ? poverty[0] : null;
  if (!first) {
    return <p></p>;
  }
  const items = poverty.map(row => `${VARIABLES.totpop(row.num)} people living below ${DICTIONARY[row.poverty_level]}`);
  const place = formatPlaceName(first, "poverty", profile.level);
  return <p>As of {first.year}, in {place} there were {items.join(" and ")}.</p>;
}


export function povertyTextByMode(profile, povertyData, povLevel, mode = "gender") {
  if (!povertyData || povertyData.length === 0) {
    return <p>No data available</p>;
  }
  const isGender = mode === "gender";
  const [categoryA, categoryB] = isGender ? ["male", "female"] : ["urban", "rural"];

  const first = povertyData[0];
  const place = formatPlaceName(first, "poverty", profile.level);
  let modeA = povertyData.filter(x => x[mode] === categoryA && povLevel === x.poverty_level);
  let modeB = povertyData.filter(x => x[mode] === categoryB && povLevel === x.poverty_level);
  modeA = modeA.length > 0 ? modeA[0] : null;
  modeB = modeB.length > 0 ? modeB[0] : null;
  const labelA = isGender ? pluralize.plural(categoryA) : `people living in ${categoryA} areas`;
  const labelB = isGender ? pluralize.plural(categoryB) : `people living in ${categoryB} areas`;
  return <p>As of {first.year}, {FORMATTERS.shareWhole(modeA.hc)} of {labelA} and {FORMATTERS.shareWhole(modeB.hc)} of {labelB} in {place} live below {DICTIONARY[modeB.poverty_level]}.</p>;
}

export function povertyVizByMode(profile, povertyData, povertyLevel, mode) {
  const colorMap = mode === "residence" ? COLORS_RESIDENCE : COLORS_GENDER;
  return <BarChart config={{
    data: `${API}api/join/?show=year,${mode}&geo=${profile.id}&required=poverty_level,hc,povgap,sevpov&sumlevel=latest_by_geo,all&poverty_level=${povertyLevel}`,
    groupBy: [mode, "poverty_level"],
    groupPadding: 100,
    label: d => d.measure instanceof Array ? titleCase(d[mode]) : `${titleCase(d[mode])} ${DICTIONARY[d.measure]}`,
    shapeConfig: {
      fill: d => colorMap[d[mode]],
      label: false
    },
    x: "measure",
    xConfig: {
      tickFormat: d => DICTIONARY[d],
      title: "Poverty Measure"
    },
    y: "value",
    yConfig: {
      domain: [0, 1],
      tickFormat: FORMATTERS.shareWhole,
      title: "Proportion of Poverty"
    }
  }}
    dataFormat={d => dataFold(d).reduce((arr, d) => {
      arr.push({...d, measure: "hc", value: d.hc});
      arr.push({...d, measure: "povgap", value: d.povgap});
      arr.push({...d, measure: "sevpov", value: d.sevpov});
      return arr;
    }, [])} />;

}
