import React, {Component} from "react";
import {connect} from "react-redux";

import Viz from "../../../canon/Viz.jsx";
import "../../../canon/Topic.css";

import {API} from "../../../../.env";
import {VARIABLES} from "../../../helpers/formatters";

class Topic extends Component {

  render() {
    const {attrs, id} = this.props;
    const attrLookup = attrs.reduce((obj, d) => (obj[d.id] = d, obj), {});
    return (
      <div className="topic">
        <h3>Harvested Area Versus Value of Production</h3>
        <Viz type="Plot" config={{
          data: `${API}api/join/?show=crop&geo=${id}&sumlevel=lowest&required=harvested_area,value_of_production`,
          label: d => attrLookup[d.crop] ? attrLookup[d.crop].name : d.crop,
          legend: false,
          groupBy: "crop",
          x: "harvested_area",
          xConfig: {
            tickFormat: VARIABLES.harvested_area,
            title: "Harvested Area"
          },
          y: "value_of_production",
          yConfig: {
            tickFormat: VARIABLES.value_of_production,
            title: "Value of Production"
          }
        }} />
      </div>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.crop
}), {})(Topic);
