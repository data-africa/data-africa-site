import React, {Component} from "react";
import Helmet from "react-helmet";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import d3plus, {tooltipBody} from "helpers/d3plus";
import {DICTIONARY} from "helpers/dictionary";
import {VARIABLES} from "helpers/formatters";
import Radio from "components/Radio";
import Selector from "components/Selector";
import {API} from "helpers/consts.js";
import axios from "axios";
import "./Map.css";

import header from "../helmet.js";

import {CanonComponent} from "datawheel-canon";
import {extent, mean} from "d3-array";
import {nest} from "d3-collection";
import {selectAll} from "d3-selection";
import {merge} from "d3plus-common";
import {Geomap} from "d3plus-react";
import {titleCase} from "d3plus-text";
import {dataFold as fold} from "d3plus-viz";

const queryDefaults = {
  column: "rainfall_awa_mm",
  geo: "adm0"
};

class Map extends Component {
  constructor(props) {
    super(props);
    const {column, geo} = {...queryDefaults, ...props.location.query};

    this.state = {
      first: true,
      loaded: false,
      column,
      geo,
      data: [],
      levels: {}
    };

    this.handleColumn = this.handleColumn.bind(this);
    this.handleGeo = this.handleGeo.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData(newVars = {}) {
    let {geo, column} = this.state;
    geo = newVars.geo ? newVars.geo : geo;
    column = newVars.column ? newVars.column : column;
    const mapParams = this.datasetPrep(geo, column);
    const dataset = this.dataset(column);
    const origColumn = column;

    let required = mapParams.variable === "geo" ? column : `${[mapParams.variable, mapParams.variableName].join(",")},${column}`;
    console.log(column, origColumn, dataset);
    if (["cropland_total_ha",
      "rainfall_awa_mm",
      "cropland_rainfallCVgt20pct_pct",
      "cropland_rainfallCVgt20pct_ha",
      "cropland_rainfallCVgt30pct_pct",
      "cropland_rainfallCVgt30pct_ha"].includes(column)) required += ",start_year";
    if (dataset === "poverty" && (column.endsWith("ppp1") || column.endsWith("ppp2"))) {
      const povLevel = column.split("_").slice(-1)[0];
      const url = `${API}api/poverty?show=${geo}&poverty_level=${povLevel}`;
      axios.get(url).then(result => {
        const data = result.data.data;
        this.setState({geo, column, data, loaded: true}, () => this.handleUrl());
      });
    }
    else if (dataset === "dhs") {
      const condition = origColumn.split("_").slice(-1)[0];
      const url = `${API}api/health?show=${geo}&severity=severe&condition=${condition}`;
      axios.get(url).then(result => {
        const data = result.data.data;
        this.setState({geo, column, data, loaded: true}, () => this.handleUrl());
      });
    }
    else if (column === "harvested_area") {
      const url = `${API}api/harvested_area?show=${geo}`;
      axios.get(url).then(result => {
        const data = result.data.data;
        this.setState({geo, column, data, loaded: true}, () => this.handleUrl());
      });
    }
    else {
      const show = mapParams.variable;
      const url = `${API}api/join/?show=year,${show}&sumlevel=latest_by_geo,${geo}&required=${required},url_name&order=${column}&sort=desc&display_names=true`;

      axios.get(url).then(result => {
        const data = fold(result.data);
        this.setState({geo, column: origColumn, data, loaded: true}, () => this.handleUrl());
      });
    }
  }


  dataset(column) {
    const povCols = ["povgap", "hc", "sevpov", "num", "gini", "totpop"];
    if (column.includes("proportion_of_children")) {
      return "dhs";
    }
    else if (povCols.includes(column) || column.endsWith("ppp1") || column.endsWith("ppp2")) {
      return "poverty";
    }
    else {
      return "cell5m";
    }
  }

  datasetPrep(geoLevel, column) {
    const {attrs} = this.props;
    let topojsonPath = "/topojson/continent.json";
    let variable = "geo";
    let variableName = "geo_name";

    const groupBy = d => isAdm0 ? attrs[d[variable]] ? attrs[d[variable]].iso3 : d[variable] : d[variable];
    if (geoLevel === "adm1") {
      const dataset = this.dataset(column);
      if (dataset === "dhs") {
        topojsonPath = "/topojson/health/adm1.json";
        variable = topojsonId = "dhs_geo";
        variableName = "dhs_geo_name";
      }
      else if (dataset === "poverty") {
        topojsonPath = "/topojson/poverty/adm1.json";
        variable = topojsonId = "poverty_geo";
        variableName = "poverty_geo_name";
      }
      else {
        topojsonId = "geo";
        topojsonPath = "/topojson/cell5m/adm1.json";
      }
    }
    const isAdm0 = geoLevel === "adm0";
    let topojsonId = d => isAdm0 ? d.properties.iso_a3 : d.properties[variable];

    const labelFunc = d => {
      while (d.data) d = d.data;
      return titleCase(d[variableName]);
    };
    return {topojsonPath, variable, variableName, topojsonId, groupBy, labelFunc};
  }

  handleColumn(event) {
    const column = event.target.value;
    this.setState({loaded: false}, () => this.fetchData({column}));
  }

  handleGeo(event) {
    const geo = event.target.value;
    this.setState({loaded: false}, () => this.fetchData({geo}));
  }

  handleUrl() {
    const {geo, column, first} = this.state;
    if (first) this.setState({first: false});
    else {
      const obj = {...this.props.location.query, geo, column};
      browserHistory.push(`/map?${Object.keys(obj).map(k => `${k}=${obj[k]}`).join("&")}`);
    }
  }

  renderTopTen() {
    const {geo, data} = this.state;
    let {column} = this.state;
    const mapParams = this.datasetPrep(geo, column);

    const averages = ["gini", "hc", "povgap", "sevpov"];
    if (column.includes("proportion_of_children")) {
      column = "proportion_of_children";
    }
    else if (column.endsWith("_ppp1") || column.endsWith("_ppp2")) {
      column = column.split("_")[0];
    }
    const dataNest = nest()
      .key(d => d[mapParams.variable])
      .entries(data)
      .map(d => merge(d.values, averages.reduce((obj, d) => (obj[d] = mean, obj), {})))
      .sort((a, b) => b[column] - a[column]);

    return <table className="data-table">
        <tbody>
        {dataNest.map((x, i) =>
          <tr className="row" key={i}>
            <td className="col rank">{i + 1}.</td>
            <td className="col name">{mapParams.labelFunc(x)}</td>
            <td className="col value">{column in VARIABLES ? VARIABLES[column](x[column]) : x[column]}</td>
          </tr>)}
        </tbody>
      </table>;
  }

  render() {
    const {vars} = this.props;
    const {geo, data, loaded} = this.state;
    let {column} = this.state;

    const origColumn = column;
    if (column.includes("proportion_of_children")) {
      column = "proportion_of_children";
    }
    else if (column.endsWith("_ppp1") || column.endsWith("_ppp2")) {
      column = column.split("_")[0];
    }
    const mapParams = this.datasetPrep(geo, column);
    const levels = vars && vars.length ? vars.filter(v => v.column === column)[0].levels[0] : {};
    const geoLevels = levels.geo ? levels.geo.filter(g => g !== "all") : [];
    const years = extent(data.map(d => d.year).concat(data.map(d => d.start_year || d.year)));
    const myPlaces = Array.from(new Set(data.map(d => d[mapParams.variable])));
    const map = <Geomap config={{
      colorScale: column,
      colorScaleConfig: {
        align: "start",
        axisConfig: {
          shapeConfig: {
            labelConfig: {
              fontColor: "#999999",
              fontFamily: () => "Work Sans",
              fontSize: () => 12
            }
          },
          tickFormat: d => VARIABLES[column] ? VARIABLES[column](d) : d,
          tickSize: 0
        },
        height: 544,
        padding: 12,
        select: "#legend",
        size: 20,
        rectConfig: {
          stroke: "#BBBBBB"
        },
        width: 120
      },
      colorScalePosition: "right",
      data,
      downloadButton: false,
      fitObject: "/topojson/continent.json",
      groupBy: mapParams.groupBy,
      label: mapParams.labelFunc,
      legend: null,
      on: {
        "click.shape": d => {
          if (d && d.url_name) {
            selectAll(".d3plus-tooltip").remove();
            browserHistory.push(`/profile/${d.url_name}`);
          }
        }
      },
      padding: "92 32 32 484",
      tiles: true,
      tooltipConfig: {
        body: tooltipBody.bind(["year", column]),
        footer: "",
        footerStyle: {
          "margin-top": 0
        },
        padding: "12px",
        title: d => `${mapParams.labelFunc(d)}${ d.geo ? "<img class='link-arrow' src='/images/nav/link-arrow.svg' />" : "" }`
      },
      topojson: mapParams.topojsonPath,
      topojsonId: mapParams.topojsonId,
      topojsonKey: "collection",
      topojsonFilter: this.dataset(column) !== "cell5m" && geo === "adm1" ? d => myPlaces.includes(d.properties[mapParams.variable]) : undefined
    }}/>;
    let tmpVars = vars.filter(v => v.column !== "proportion_of_children" && !["num", "hc", "sevpov", "povgap"].includes(v.column));
    const glevels = [{geo: ["all", "adm0", "adm1"]}];
    const povTemplates = vars
      .filter(v => ["hc", "sevpov", "povgap", "num"].includes(v.column))
      .map(x => [{...x, column: `${x.column}_ppp1`}, {...x, column: `${x.column}_ppp2`}])
      .reduce((obj, acc) => [...acc, ...obj], {});
    tmpVars = [...tmpVars,
      {column: "proportion_of_children_wasted", levels: glevels},
      {column: "proportion_of_children_stunted", levels: glevels},
      {column: "proportion_of_children_underweight", levels: glevels},
      ...povTemplates
    ];

    const dropdownOptions = tmpVars.map(v => v.column)
      .sort((a, b) => DICTIONARY[a].localeCompare(DICTIONARY[b]));

    const loading = loaded ? null : <div className="loading"><div className="text">Loading...</div></div>;
    let yearSpan = <span className="data-year">{ data.length ? `Data ${ years[0] !== years[1] ? `collected from ${years[0]} to` : "from" } ${ years[1] }` : null }</span>;
    if (column === "cropland_total_ha") {
      yearSpan = <span className="data-year">Data from 2005</span>;
    }
    return (
      <CanonComponent d3plus={d3plus}>
        <div className="map">
          <Helmet title={ `${ header.title } - ${ DICTIONARY[column] } by ${ geo === "adm0" ? "Country" : "State/Province" }` } />
          <div className="floater">

            <div className="controls">
              <span className="dropdown-title">Metric</span>
              <Selector options={ dropdownOptions } callback={ this.handleColumn } selected={ origColumn } />
              {
                geoLevels.length > 1 ? <Radio options={ geoLevels } checked={ geo } callback={ this.handleGeo } /> : null
              }
              { yearSpan }
              { this.renderTopTen() }
            </div>
            <svg id="legend"></svg>
          </div>
          { data.length ? map : null }
          {loading}
        </div>
      </CanonComponent>
    );
  }
}

Map.need = [
  () => ({type: "GET_VARS", promise: axios.get(`${API}api/geo/variables/`)})
];

export default connect(state => ({
  attrs: state.attrs.geo,
  focus: state.focus,
  vars: state.map.vars
}))(Map);
