import {format, formatPrefix} from "d3-format";
import {timeFormat} from "d3-time-format";

function abbreviate(n) {

  const length = n.toString().split(".")[0].length;

  if (n === 0) return "0";
  else if (length > 3) return formatPrefix(",.0", n)(n).replace("G", "B");
  else if (length === 3) return format(",f")(n);
  else if (n === parseInt(n, 10)) return format(".2")(n);
  else return format(".3g")(n);

}

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
  harvested_area: d => `${abbreviate(d)} ha`,
  rainfall_awa_mm: d => `${format(",.2f")(d)}mm`,
  value_of_production: d => `Intl.$${abbreviate(d)}`
};
