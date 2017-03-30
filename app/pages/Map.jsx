import React from "react";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import d3plus from "helpers/d3plus";
import {VARIABLES} from "helpers/formatters";
import Radio from "components/Radio";
import Selector from "components/Selector";
import {API} from ".env";
import axios from "axios";
import "./Map.css";

import {Profile} from "datawheel-canon";
import {Geomap} from "d3plus-react";
import {dataFold as fold} from "d3plus-viz";
import {titleCase} from "d3plus-text";

const queryDefaults = {
  column: "rainfall_awa_mm",
  geo: "adm0"
};

class Map extends Profile {
  constructor(props) {
    super(props);
    const {column, geo} = {...queryDefaults, ...props.location.query};

    this.state = {
      loaded: false,
      column,
      geo,
      data: []
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

    const url = `${API}api/join/?show=year,geo&sumlevel=latest_by_geo,${geo}&required=${required}&order=${column}&sort=desc&display_names=true`;

    axios.get(url).then(result => {
      const data = fold(result.data);
      this.setState({geo, column, data, loaded: true});
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

  handleUrl(params) {
    const obj = {...queryDefaults, ...this.props.location.query, ...params};
    browserHistory.push(`/map?${Object.keys(obj).map(k => `${k}=${obj[k]}`).join("&")}`);
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
        color: "#74E19A",
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
      padding: "92 32 32 484",
      tiles: true,
      topojson: mapParams.topojsonPath,
      topojsonId: mapParams.topojsonId,
      topojsonKey: "collection"
    }}/>;

    const loading = loaded ? <div className="loading">Loading...</div> : null;


    return (
      <div className="map">
        <div className="floater">
          <div className="controls">
            <span className="dropdown-title">Metric</span>
            <Selector options={ vars.map(v => v.column) } callback={ this.handleColumn } selected={ column } />
            {
              geoLevels.length > 1 ? <Radio options={ geoLevels } checked={ geo } callback={ this.handleGeo } /> : null
            }
          </div>
          <svg id="legend"></svg>
        </div>
        {loading}
        {map}
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
