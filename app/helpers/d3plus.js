const axisConfig = {
  barConfig: {
    "stroke": "#cccccc",
    "stroke-width": 1
  },
  gridConfig: {
    "stroke": "#cccccc",
    "stroke-width": 1
  },
  shapeConfig: {
    fill: "#979797",
    fontColor: "rgba(0, 0, 0, 0.8)",
    fontFamily: () => "Work Sans",
    fontSize: () => 12,
    stroke: "#979797",
    textTransform: "uppercase"
  },
  tickSize: 0,
  titleConfig: {
    fontFamily: "Work Sans",
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase"
  }
};

export default {
  barPadding: 4,
  controlConfig: {
    labelStyle: {
      "color": "rgba(0, 0, 0, 0.2)",
      "display": "inline-block",
      "font-family": "Work Sans",
      "font-size": "12px",
      "font-weight": 600,
      "padding": "12px 16px"
    }
  },
  legendConfig: {
    marginLeft: 50,
    padding: 8,
    shapeConfig: {
      fontColor: "rgba(0, 0, 0, 0.8)",
      fontFamily: "Work Sans",
      fontResize: false,
      fontSize: 12,
      fontWeight: 400,
      height: () => 20,
      width: () => 20
    }
  },
  shapeConfig: {
    fontColor: "rgba(0, 0, 0, 0.4)",
    fontFamily: "Work Sans",
    fontWeight: 600
  },
  timeline: false,
  tooltipConfig: {
    background: "#fff",
    fontSize: "24px!important",
    padding: "16px",
    footer: "click to highlight",
    footerStyle: {
      "color": "#ccc",
      "font-size": "12px",
      "margin-top": "10px"
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
