import React from "react";
import {connect} from "react-redux";

import Section from "src/components/Section";
import {Plot} from "d3plus-react";

import {API} from ".env";
import {VARIABLES} from "helpers/formatters";

class CropsAreaVsValue extends Section {

  render() {
    const {attrs, profile} = this.props;
    return (
      <div className="section">
        <h3>Harvested Area Versus Value of Production</h3>
        <Plot config={{
          data: `${API}api/join/?show=crop&geo=${profile.id}&sumlevel=lowest&required=harvested_area,value_of_production`,
          label: d => attrs[d.crop] ? attrs[d.crop].name : d.crop,
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
}), {})(CropsAreaVsValue);
