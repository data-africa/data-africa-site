import React from "react";
import {connect} from "react-redux";

import {dataFold} from "d3plus-viz";
import {BarChart} from "d3plus-react";
import Section from "src/components/Section";

import {API} from ".env";

class RainfallBars extends Section {

  render() {
    const {attrs, focus, profile} = this.props;
    return (
      <div className="section">
        <h3>Rainfall by Location</h3>
        <BarChart config={{
          barPadding: 5,
          data: `${API}api/join/?show=geo&geo=${ focus.join(",") }sumlevel=all&required=rainfall_awa_mm`,
          discrete: "y",
          groupBy: "geo",
          label: d => attrs[d.geo] ? attrs[d.geo].name : d.geo,
          legend: false,
          shapeConfig: {
            fill: d => d.geo === profile.id ? "rgb(120, 220, 133)" : "rgb(61, 71, 55)"
          },
          x: "rainfall_awa_mm",
          xConfig: {
            title: "Rainfall"
          },
          y: "geo",
          yConfig: {
            labels: [],
            title: "Locations"
          }
        }} />
      </div>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.geo,
  focus: state.focus
}), {})(RainfallBars);
