import React, {Component} from "react";
import {connect} from "react-redux";

import {Plot} from "d3plus-react";
import {Section} from "datawheel-canon";

import {VARIABLES} from "helpers/formatters";

import {API} from ".env";

class CropsAreaVsValue extends Component {

  render() {

    const {attrs, profile} = this.props;

    return (
      <Section title="Harvested Area Versus Value of Production">
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
      </Section>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.crop
}), {})(CropsAreaVsValue);
