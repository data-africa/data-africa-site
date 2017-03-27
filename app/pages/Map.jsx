import React from "react";
import {connect} from "react-redux";
import d3plus from "helpers/d3plus";
import Selector from "components/Selector";
import {API} from ".env";
import axios from "axios";
import "./Map.css";

import {Profile} from "datawheel-canon";
import {Geomap} from "d3plus-react";

class Map extends Profile {

  constructor() {
    super();
    this.state = {
      column: false
    };
  }

  onChange(event) {
    this.setState({column: event.target.value});
  }

  render() {

    const {attrs, vars} = this.props;
    let {column} = this.state;
    if (!column) column = vars[0].column;
    const isAdm0 = true;

    return (
      <div className="map">
        <div className="controls">
          <span className="dropdown-title">Metric</span>
          <Selector options={ vars.map(v => v.column) } callback={ this.onChange.bind(this) } />
        </div>
        <Geomap config={{
          colorScale: column,
          colorScalePosition: "left",
          data: `${API}api/join/?show=geo&sumlevel=adm0&required=${column}&order=${column}&sort=desc&display_names=true`,
          groupBy: d => isAdm0 ? attrs[d.geo] ? attrs[d.geo].iso3 : d.geo : d.geo,
          label: d => d.geo_name,
          ocean: "transparent",
          padding: 24,
          tiles: false,
          topojson: "/topojson/continent.json",
          topojsonId: d => isAdm0 ? d.properties.iso_a3 : d.properties.geo,
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
