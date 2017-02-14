import React, {Component} from "react";
import {connect} from "react-redux";

import {BarChart} from "d3plus-react";
import {Section} from "datawheel-canon";

import {API} from ".env";

class RainfallBars extends Component {

  render() {
    const {attrs, focus, profile} = this.props;
    const countryUrl = `${API}api/join/?show=geo&geo=${ focus.join(",") }sumlevel=all&required=rainfall_awa_mm`;
    const provinceUrl = `${API}api/join/?show=geo&neighbors=${ profile.id }&sumlevel=all&required=rainfall_awa_mm`;
    const sumlevel = attrs[profile.id].level;
    const apiUrl = sumlevel === "adm0" ? countryUrl : provinceUrl;

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
