import React, {Component} from "react";
import {connect} from "react-redux";

import Viz from "canon/Viz.jsx";
import "canon/Topic.css";

import {VARIABLES} from "helpers/formatters";

import {API} from ".env";

class Topic extends Component {

  render() {
    const {attrs, profile, vars} = this.props;

    const crops = vars.value_of_production.slice();
    crops.forEach(c => {
      c.name = attrs[c.crop] ? attrs[c.crop].name : c.crop;
    });

    return (
      <div className="topic">
        <h3>Crops by Production Value</h3>
        <div className="side-by-side">
          <div className="text">
            The crop with the highest production value in { profile.name } is { crops[0].name }, with a value of { VARIABLES.value_of_production(crops[0].value_of_production) }.
          </div>
          <Viz type="Treemap" config={{
            data: `${API}api/join/?show=crop&geo=${profile.id}&sumlevel=lowest&required=value_of_production`,
            groupBy: "crop",
            label: d => attrs[d.crop] ? attrs[d.crop].name : d.crop,
            legend: false,
            sum: d => d.value_of_production
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
