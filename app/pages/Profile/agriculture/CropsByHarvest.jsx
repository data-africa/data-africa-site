import React, {Component} from "react";
import {connect} from "react-redux";

import Viz from "canon/Viz.jsx";
import "canon/Topic.css";

import {VARIABLES} from "helpers/formatters";

import {API} from ".env";

class Topic extends Component {

  render() {

    const {attrs, profile, vars} = this.props;

    const crops = vars.harvested_area.slice();
    crops.forEach(c => {
      c.name = attrs[c.crop] ? attrs[c.crop].name : c.crop;
    });

    return (
      <div className="topic">
        <h3>Crops by Harvested Area</h3>
        <div className="side-by-side">
          <div className="text">
            The most common crop in { profile.name }, by harvested area, is { crops[0].name } with a harvested area of { VARIABLES.harvested_area(crops[0].harvested_area) }.
          </div>
          <Viz type="Treemap" config={{
            data: `${API}api/join/?show=crop&geo=${profile.id}&sumlevel=lowest&required=harvested_area`,
            groupBy: "crop",
            label: d => attrs[d.crop] ? attrs[d.crop].name : d.crop,
            legend: false,
            sum: d => d.harvested_area
          }} />
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.crop.reduce((obj, d) => (obj[d.id] = d, obj), {}),
  vars: state.profile.vars.crop
}), {})(Topic);
