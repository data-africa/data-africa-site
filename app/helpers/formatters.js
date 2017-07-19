import {format, formatPrefix} from "d3-format";
import {timeFormat} from "d3-time-format";

function round2(d) {
  if (d === undefined || d === null) return "N/A";
  return formatPrefix(",.2", d)(d).replace("G", "B");
}

function abbreviate(n, forceRounding = false) {
  if (n === undefined || n === null) return "N/A";

  const length = n.toString().split(".")[0].length;

  if (n === 0) return "0";
  else if (length > 3) return formatPrefix(",.2", n)(n).replace("G", "B");
  else if (length === 3) return format(`,${forceRounding ? ".0" : ""}f`)(n);
  else if (n === parseInt(n, 10)) return format(".2")(n);
  else return format(".3g")(n);

}

export const FORMATTERS = {
  commas: format(","),
  date: timeFormat("%B %d, %Y"),
  ordinal: n => {
    if (n > 3 && n < 21) return `${n}th`; // thanks kennebec
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  },
  ratio: d => format(".2%")(d / 100),
  round: format(",.0f"),
  share: format(".2%"),
  shareWhole: format(".0%"),
  year: y => y < 0 ? `${Math.abs(y)} BC` : y
};

export const VARIABLES = {
  cropland_rainfallCVgt20pct_ha: d => `${abbreviate(d)} ha`,
  cropland_rainfallCVgt30pct_ha: d => `${abbreviate(d)} ha`,
  cropland_rainfallCVgt20pct_pct: d => `${round2(d)}%`,
  cropland_rainfallCVgt30pct_pct: d => `${round2(d)}%`,
  cropland_total_ha: d => `${abbreviate(d)} ha`,
  gini: format(".3"),
  harvested_area: d => `${abbreviate(d, true)} ha`,
  hc: FORMATTERS.share,
  num: abbreviate,
  povgap: FORMATTERS.ratio,
  poverty_prop: FORMATTERS.shareWhole,
  proportion_of_children: FORMATTERS.share,
  rainfall_awa_mm: d => `${FORMATTERS.round(d)}mm`,
  sevpov: FORMATTERS.ratio,
  totpop: d => round2(d),
  value_of_production: d => `Intl $${abbreviate(d, true)}`,
  value_density: d => `Intl $${abbreviate(d)} per ha`
};

function formatPlaceName(datum, mode, level = "adm0") {
  let place = "N/A";
  if (!datum) {
    return place;
  }
  else if (mode === "poverty") {
    place = datum.poverty_geo_name;
    if (level === "adm1") place += `, ${datum.poverty_geo_parent_name}`;
  }
  else if (mode === "health") {
    place = datum.dhs_geo_name;
    if (level === "adm1") place += `, ${datum.dhs_geo_parent_name}`;
  }
  return place;
}

export {formatPlaceName};
