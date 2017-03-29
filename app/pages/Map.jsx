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

const queryDefaults = {
  column: "rainfall_awa_mm",
  geo: "adm0"
};

class Map extends Profile {

  constructor() {
    super();
    this.state = {
      column: false
    };
  }

  dataset(column) {
    const povCols = ["povgap", "hc", "sevpov", "num"];
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
    // let parentName = "geo_parent_name";

    if (geoLevel === "adm1") {
      const dataset = this.dataset(column);
      if (dataset === "dhs") {
        topojsonPath = "/topojson/health/adm1.json";
        variable = topojsonId = "dhs_geo";
        variableName = "dhs_geo_name";
        // parentName = "dhs_geo_parent_name";
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
    const groupBy = d => isAdm0 ? attrs[d[variable]].iso3 : d[variable];
    const labelFunc = d => d[variableName];
    return {topojsonPath, variable, variableName, topojsonId, groupBy, labelFunc};
  }

  handleColumn(event) {
    this.handleUrl({column: event.target.value});
  }

  handleGeo(event) {
    this.handleUrl({geo: event.target.value});
  }

  handleUrl(params) {
    const obj = {...queryDefaults, ...this.props.location.query, ...params};
    browserHistory.push(`/map?${Object.keys(obj).map(k => `${k}=${obj[k]}`).join("&")}`);
  }

  render() {

    const {vars} = this.props;
    const {column, geo} = {...queryDefaults, ...this.props.location.query};

    const levels = vars.filter(v => v.column === column)[0].levels[0];
    const geoLevels = levels.geo ? levels.geo.filter(g => g !== "all") : [];
    const mapParams = this.datasetPrep(geo, column);

    const required = mapParams.variable === "geo" ? column : `${[mapParams.variable, mapParams.variableName].join(",")},${column}`;

    return (
      <div className="map">
        <div className="floater">
          <div className="controls">
            <span className="dropdown-title">Metric</span>
            <Selector options={ vars.map(v => v.column) } callback={ this.handleColumn.bind(this) } selected={ column } />
            {
              geoLevels.length > 1 ? <Radio options={ geoLevels } checked={ geo } callback={ this.handleGeo.bind(this) } /> : null
            }
          </div>
          <svg id="legend"></svg>
        </div>
        <Geomap config={{
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
          data: `${API}api/join/?show=year,geo&sumlevel=latest_by_geo,${geo}&required=${required}&order=${column}&sort=desc&display_names=true`,
          fitObject: "/topojson/continent.json",
          groupBy: mapParams.groupBy,
          label: mapParams.labelFunc,
          ocean: "transparent",
          padding: "92 32 32 484",
          tiles: false,
          topojson: mapParams.topojsonPath,
          topojsonId: mapParams.topojsonId,
          topojsonKey: "collection"
        }} />
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
