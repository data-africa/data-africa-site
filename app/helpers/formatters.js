import {format} from "d3-format";
import {timeFormat} from "d3-time-format";

export const FORMATTERS = {
  commas: format(","),
  share: format(".2%"),
  shareWhole: format(".0%"),
  date: timeFormat("%B %d, %Y"),
  year: y => y < 0 ? `${Math.abs(y)} BC` : y,
  ordinal: n => {
    if (n > 3 && n < 21) return `${n}th`; // thanks kennebec
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }
};

export const VARIABLES = {
  harvested_area: d => `${format(",")(d)} ha`,
  rainfall_awa_mm: d => `${format(",.2f")(d)}mm`,
  value_of_production: d => `Intl.$${format(",")(d)}`
};
