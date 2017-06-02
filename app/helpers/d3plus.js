import {extent, mean} from "d3-array";
import {titleCase} from "d3plus-text";

import {COLORS_RAINFALL} from "helpers/colors";
import {DICTIONARY} from "helpers/dictionary";
import {VARIABLES} from "helpers/formatters";

const axisConfig = {
  barConfig: {
    "stroke": "#dddddd",
    "stroke-width": 1
  },
  gridConfig: {
    "stroke": "#dddddd",
    "stroke-width": 1
  },
  shapeConfig: {
    fill: "#979797",
    labelConfig: {
      fontColor: "rgba(0, 0, 0, 0.8)",
      fontFamily: () => "Work Sans",
      fontSize: () => 12
    },
    stroke: "#979797"
  },
  tickSize: 0,
  titleConfig: {
    fontFamily: () => "Work Sans",
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase"
  }
};

export default {
  aggs: {
    poverty_prop: mean,
    proportion_of_children: mean,
    year: arr => {
      const e = extent(arr);
      return e[0] === e[1] ? e[0] : e.join("–");
    }
  },
  barPadding: 4,
  cache: true,
  colorScaleConfig: {
    color: COLORS_RAINFALL,
    scale: "jenks",
    shapeConfig: {
      fill: "#979797",
      labelConfig: {
        fontColor: "rgba(0, 0, 0, 0.8)",
        fontFamily: () => "Work Sans",
        fontSize: () => 12
      },
      stroke: "#979797"
    },
    tickSize: 0,
    titleConfig: {
      fontFamily: () => "Work Sans",
      fontSize: "14px",
      fontWeight: 600,
      textTransform: "uppercase"
    }
  },
  controlConfig: {
    buttonStyle: {
      margin: "12px"
    },
    labelStyle: {
      "color": "rgba(0, 0, 0, 0.2)",
      "display": "inline-block",
      "font-family": "Work Sans",
      "font-size": "12px",
      "font-weight": 600,
      "padding": "12px 16px"
    }
  },
  downloadButton: true,
  legendConfig: {
    padding: 8,
    shapeConfig: {
      labelConfig: {
        fontColor: "rgba(0, 0, 0, 0.8)",
        fontFamily: () => "Work Sans",
        fontResize: false,
        fontSize: 12,
        fontWeight: 400
      },
      height: () => 20,
      width: () => 20
    }
  },
  legendTooltip: {
    body: ""
  },
  shapeConfig: {
    hoverOpacity: 0.7,
    labelConfig: {
      fontColor: "rgba(0, 0, 0, 0.4)",
      fontFamily: () => "Work Sans",
      fontWeight: 600
    }
  },
  timeline: false,
  titleConfig: {
    fontColor: "#4A4A4A",
    fontFamily: () => "Work Sans"
  },
  tooltipConfig: {
    background: "#fff",
    bodyStyle: {
      "color": "#4A4A4A",
      "font-family": "Work Sans",
      "font-size": "12px",
      "font-weight": 400,
      "margin-top": "12px"
    },
    borderRadius: "4px",
    padding: "16px",
    footerStyle: {
      "color": "#ccc",
      "font-family": "Work Sans",
      "font-size": "12px",
      "margin-top": "10px"
    },
    titleStyle: {
      "color": "#4A4A4A",
      "font-family": "Work Sans",
      "font-size": "16px",
      "font-weight": 600
    }
  },
  xConfig: axisConfig,
  x2Config: {barConfig: axisConfig.barConfig},
  yConfig: axisConfig,
  y2Config: {barConfig: axisConfig.barConfig}
};

export function yearControls(data) {

  const years = Array.from(new Set(data.map(d => d.year))).sort();
  if (years.length < 2) return [];

  function change(year) {
    this.timeFilter(d => d.year === parseFloat(year)).render();
  }

  return [{
    checked: Math.max(...years),
    on: {change},
    options: years.map(year => ({text: year, value: year})),
    type: "Radio"
  }];

}

export function tooltipBody(d) {
  while (d.__d3plus__) d = d.data;
  return this.map(key => typeof key === "function" ? key(d)
    : `<span class="d3plus-body-key">${key in DICTIONARY ? DICTIONARY[key] : titleCase(key)}:</span> <span class="d3plus-body-value">${ key in VARIABLES ? VARIABLES[key](d[key]) : d[key] }</span>`).join("<br>");
}
