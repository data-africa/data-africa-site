import React from "react";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import d3plus from "helpers/d3plus";
import {DICTIONARY} from "helpers/dictionary";
import {VARIABLES} from "helpers/formatters";
import Radio from "components/Radio";
import Selector from "components/Selector";
import {API} from ".env";
import axios from "axios";
import "./Map.css";

import {Profile} from "datawheel-canon";
import {mean} from "d3-array";
import {nest} from "d3-collection";
import {merge} from "d3plus-common";
import {Geomap} from "d3plus-react";
import {titleCase} from "d3plus-text";
import {dataFold as fold} from "d3plus-viz";

const queryDefaults = {
  column: "rainfall_awa_mm",
  geo: "adm1"
};

class Map extends Profile {
  constructor(props) {
    super(props);
    const {column, geo} = {...queryDefaults, ...props.location.query};

    this.state = {
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
    const required = mapParams.variable === "geo" ? column : `${[mapParams.variable, mapParams.variableName].join(",")},${column}`;
    const show = mapParams.variable;
    const url = `${API}api/join/?show=year,${show}&sumlevel=latest_by_geo,${geo}&required=${required}&order=${column}&sort=desc&display_names=true`;

    axios.get(url).then(result => {
      const data = fold(result.data);
      this.setState({geo, column, data, loaded: true}, () => this.handleUrl());
    });
  }


  dataset(column) {
    const povCols = ["povgap", "hc", "sevpov", "num", "gini", "totpop"];
    if (column === "proportion_of_children") {
      return "dhs";
    }
    else if (povCols.includes(column)) {
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

    const labelFunc = d => titleCase(d[variableName]);
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
    const {geo, column} = this.state;
    const obj = {...this.props.location.query, geo, column};
    browserHistory.push(`/map?${Object.keys(obj).map(k => `${k}=${obj[k]}`).join("&")}`);
  }

  renderTopTen() {
    const {geo, column, data} = this.state;
    const mapParams = this.datasetPrep(geo, column);

    const averages = ["gini", "hc", "povgap", "sevpov"];

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
    const {geo, column, data, loaded} = this.state;
    const mapParams = this.datasetPrep(geo, column);
    const levels = vars.filter(v => v.column === column)[0].levels[0];
    const geoLevels = levels.geo ? levels.geo.filter(g => g !== "all") : [];

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
          if (d) window.location = `/profile/${d.geo}`;
        }
      },
      padding: "92 32 32 484",
      tiles: true,
      tooltipConfig: {
        body: d => `${DICTIONARY[column]}: ${ column in VARIABLES ? VARIABLES[column](d[column]) : d[column] }`,
        footer: "",
        footerStyle: {
          "margin-top": 0
        },
        padding: "12px",
        title: d => `${mapParams.labelFunc(d)}<img class='link-arrow' src='/images/nav/link-arrow.svg' />`
      },
      topojson: mapParams.topojsonPath,
      topojsonId: mapParams.topojsonId,
      topojsonKey: "collection"
    }}/>;

    const loading = loaded ? null : <div className="loading"><div className="text">Loading...</div></div>;

    return (
      <div className="map">
        <div className="floater">

          <div className="controls">
            <span className="dropdown-title">Metric</span>
            <Selector options={ vars.map(v => v.column) } callback={ this.handleColumn } selected={ column } />
            {
              geoLevels.length > 1 ? <Radio options={ geoLevels } checked={ geo } callback={ this.handleGeo } /> : null
            }
            { this.renderTopTen() }
          </div>
          <svg id="legend"></svg>
        </div>
        {map}
        {loading}
      </div>
    );
  }
}

Map.defaultProps = {d3plus};

Map.need = [
  () => ({type: "GET_VARS", promise: axios.get(`${API}api/geo/variables/`)})
];

export default connect(state => ({
  attrs: state.attrs.geo,
  focus: state.focus,
  vars: state.map.vars
}))(Map);
