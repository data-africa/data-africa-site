import React from "react";
import {connect} from "react-redux";


import {BarChart, Geomap} from "d3plus-react";
import {SectionColumns, SectionRows, SectionTitle} from "datawheel-canon";

import {fetchData} from "actions/profile";
import {COLORS_RAINFALL} from "helpers/colors";
import {VARIABLES} from "helpers/formatters";

import {API} from ".env";

class RainfallBars extends SectionColumns {

  render() {
    const {attrs, focus, profile} = this.props;
    const data = this.context.data.rainfall;
    const sumlevel = profile.id.slice(0, 3);
    const param = sumlevel === "040" ? `geo=${ focus.join(",") }` : `neighbors=${ profile.id }`;
    const apiUrl = `${API}api/join/?show=geo&${param}&sumlevel=all&required=rainfall_awa_mm&display_names=1&order=rainfall_awa_mm&sort=desc`;
    const res = data.length > 0 ? data[0] : {};

    const isAdm0 = profile.level === "adm0";
    const adm0 = profile.id.slice(5, 10);
    const topoFilt = isAdm0 ? d => d : d => adm0 === d.properties.geo.slice(5, 10);
    const topoPath = isAdm0 ? "/topojson/continent.json" : "/topojson/cell5m/adm1.json";

    return (
      <SectionColumns>
        <SectionTitle>Rainfall by Location</SectionTitle>

        <article>From {res.start_year} to {res.year} {res.geo_name} had an annual
        average rainfall of {VARIABLES.rainfall_awa_mm(res.rainfall_awa_mm)} across a total
        cropland area of {VARIABLES.harvested_area(res.cropland_total_ha)}.</article>
          <Geomap config={{
            colorScale: "rainfall_awa_mm",
            colorScaleConfig: {
              color: COLORS_RAINFALL,
              axisConfig: {
                tickFormat: d => VARIABLES.rainfall_awa_mm(d)
              }
            },
            colorScalePosition: "left",
            data: apiUrl,
            groupBy: d => d.data ? d.id : isAdm0 ? attrs[d.geo] ? attrs[d.geo].iso3 : d.geo : d.geo,
            label: d => d.data ? d.data.geo_name : d.geo_name,
            ocean: "transparent",
            padding: 0,
            tiles: false,
            topojson: topoPath,
            topojsonFilter: topoFilt,
            topojsonId: d => isAdm0 ? d.properties.iso_a3 : d.properties.geo,
            zoom: false
          }} />
          <BarChart config={{
            colorScale: "rainfall_awa_mm",
            colorScaleConfig: {
              color: COLORS_RAINFALL
            },
            colorScalePosition: false,
            data: apiUrl,
            discrete: "y",
            groupBy: "geo_name",
            groupPadding: 4,
            legend: false,
            shapeConfig: {label: false},
            x: "rainfall_awa_mm",
            xConfig: {
              tickFormat: d => VARIABLES.rainfall_awa_mm(d),
              title: "Rainfall"
            },
            y: "geo_name",
            yConfig: {
              gridSize: 0,
              tickFormat: d => d === "United Republic of Tanzania" ? "United Republic\nof Tanzania" : d,
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
  attrs: state.attrs.geo,
  focus: state.focus
}), {})(RainfallBars);
