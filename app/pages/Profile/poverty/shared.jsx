import React from "react";

import {DICTIONARY} from "helpers/dictionary";
import {VARIABLES, FORMATTERS, formatPlaceName} from "helpers/formatters";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {COLORS_RESIDENCE, COLORS_GENDER} from "helpers/colors";
import Selector from "components/Selector";

export function povertyContent(profile, poverty) {
  const first = poverty && poverty.length > 0 ? poverty[0] : null;
  if (!first) {
    return <span></span>;
  }
  const items = poverty.map(row => `${VARIABLES.totpop(row.num)} people living below ${DICTIONARY[row.poverty_level]}`);
  const place = formatPlaceName(first, "poverty", profile.level);
  return <p>As of {first.year}, in {place} there were {items.join(" and ")}.</p>;
}

function formatGender(gender, isTitle = false) {
  const inSentence = `households headed by ${gender}s`;
  const inTitle = `${titleCase(gender)} Head of Household`;
  return isTitle ? inTitle : inSentence;
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
  const labelA = isGender ? formatGender(categoryA) : `people living in ${categoryA} areas`;
  const labelB = isGender ? formatGender(categoryB) : `people living in ${categoryB} areas`;
  if (modeA && modeB) {
    return <p>As of {first.year}, {FORMATTERS.shareWhole(modeA.hc)} of {labelA} and {FORMATTERS.shareWhole(modeB.hc)} of {labelB} in {place} live below {DICTIONARY[modeB.poverty_level]}.</p>;
  }
  else if (modeA || modeB) {
    const isA = modeA === null ? true : false;
    const mode = isA ? modeA : modeB;
    const label = isA ? labelA : labelB;
    return <p>As of {first.year}, {FORMATTERS.shareWhole(mode.hc)} of {label}.</p>;
  }
  else {
    return <p>No Data Available</p>;
  }
}

export function povertyVizByMode(profile, vizData, povertyLevel, mode) {
  const colorMap = mode === "residence" ? COLORS_RESIDENCE : COLORS_GENDER;
  return <BarChart config={{
    data: vizData,
    groupBy: [mode, "poverty_level"],
    groupPadding: 100,
    label: d => mode === "gender" ? formatGender(d[mode], true) : titleCase(d[mode]),
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
  }}/>;

}

export function makeGeoSelector(profile, povertyData, targetGeo, onChange) {
  // Get a list of the unique places in the dataset
  const places = [... new Set(povertyData.map(x => x.poverty_geo))];
  const opts = places.map(p => {
    const row = povertyData.filter(x => x.poverty_geo === p)[0];
    return {value: p, label: formatPlaceName(row, "poverty", profile.level)};
  });
  // If there is more than one place, insert a place dropdown
  const selector = places && places.length > 1 ? <Selector options={opts} callback={onChange}/> : "";
  // By default, select the first place
  const target = targetGeo !== null ? targetGeo : places[0];
  // Filter the raw data to include only the target geo
  const filteredData = povertyData.filter(x => x.poverty_geo === target);
  // Format the data for viz display
  const vizData = filteredData.reduce((arr, d) => {
    arr.push({...d, measure: "hc", value: d.hc});
    arr.push({...d, measure: "povgap", value: d.povgap});
    arr.push({...d, measure: "sevpov", value: d.sevpov});
    return arr;
  }, []);
  return {
    vizData,
    selector,
    filteredData
  };
}
