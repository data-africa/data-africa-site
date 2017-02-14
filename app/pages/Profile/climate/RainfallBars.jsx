import React, {Component} from "react";
import {connect} from "react-redux";

import {BarChart} from "d3plus-react";
import {Section} from "datawheel-canon";

import {API} from ".env";

class RainfallBars extends Component {

  render() {
    const {attrs, focus, profile} = this.props;
    const sumlevel = attrs[profile.id].level;
    const param = sumlevel === "adm0" ? `geo=${ focus.join(",") }` : `neighbors=${ profile.id }`;
    const apiUrl = `${API}api/join/?show=geo&${param}&sumlevel=all&required=rainfall_awa_mm`;

    return (
      <Section title="Rainfall by Location">
        <BarChart config={{
          barPadding: 5,
          data: apiUrl,
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
    </Section>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.geo,
  focus: state.focus
}), {})(RainfallBars);
