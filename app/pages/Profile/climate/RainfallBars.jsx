import React from "react";
import {connect} from "react-redux";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";
import {fetchData} from "actions/profile";
import {VARIABLES} from "helpers/formatters";

import {API} from ".env";

class RainfallBars extends SectionColumns {

  render() {
    const {focus, profile} = this.props;
    const data = this.context.data.rainfall;
    const sumlevel = profile.id.slice(0, 3);
    const param = sumlevel === "040" ? `geo=${ focus.join(",") }` : `neighbors=${ profile.id }`;
    const apiUrl = `${API}api/join/?show=geo&${param}&sumlevel=all&required=rainfall_awa_mm&display_names=1`;
    const res = data.length > 0 ? data[0] : {};
    return (
      <SectionColumns>
        <SectionTitle>Rainfall by Location</SectionTitle>
        <article>From {res.start_year} to {res.year} {res.geo_name} had an annual
        average rainfall of of {VARIABLES.rainfall_awa_mm(res.rainfall_awa_mm)} across a total
        cropland area of {VARIABLES.harvested_area(res.cropland_total_ha)}.</article>
        <BarChart config={{
          barPadding: 5,
          data: apiUrl,
          discrete: "y",
          groupBy: "geo",
          label: d => d.geo_name,
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
    </SectionColumns>
    );
  }
}

RainfallBars.need = [
  fetchData("rainfall", "api/join/?show=geo&geo=<id>&sumlevel=all&required=start_year,rainfall_awa_mm,cropland_total_ha&display_names=1")
];

export default connect(state => ({
  focus: state.focus
}), {})(RainfallBars);
