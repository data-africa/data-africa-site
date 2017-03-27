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

    const {attrs, vars} = this.props;
    const {column, geo} = {geo: "adm0", column: "rainfall_awa_mm", ...this.props.location.query};

    const levels = vars.filter(v => v.column === column)[0].levels[0];
    const geoLevels = levels.geo ? levels.geo.filter(g => g !== "all") : [];

    return (
      <div className="map">
        <div className="controls">
          <span className="dropdown-title">Metric</span>
          <Selector options={ vars.map(v => v.column) } callback={ this.handleColumn.bind(this) } selected={ column } />
          {
            geoLevels.length > 1 ? <Radio options={ geoLevels } checked={ geo } callback={ this.handleGeo.bind(this) } /> : null
          }
        </div>
        <Geomap config={{
          colorScale: column,
          colorScaleConfig: {
            // color: "#74E19A",
            axisConfig: {
              tickFormat: d => VARIABLES[column] ? VARIABLES[column](d) : d
            }
          },
          colorScalePosition: "right",
          data: `${API}api/join/?show=geo&sumlevel=${geo}&required=${column}&order=${column}&sort=desc&display_names=true`,
          fitObject: "/topojson/continent.json",
          groupBy: d => geo === "adm0" ? attrs[d.geo] ? attrs[d.geo].iso3 : d.geo : d.geo,
          label: d => d.geo_name,
          ocean: "transparent",
          padding: 24,
          tiles: false,
          topojson: geo === "adm0" ? "/topojson/continent.json" : "/topojson/cell5m/adm1.json",
          topojsonId: d => geo === "adm0" ? d.properties.iso_a3 : d.properties.geo,
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
