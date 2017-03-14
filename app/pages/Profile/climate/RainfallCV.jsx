import React from "react";
import {connect} from "react-redux";

import {Geomap} from "d3plus-react";
import {SectionColumns, SectionRows, SectionTitle} from "datawheel-canon";
import {fetchData} from "actions/profile";
import {COLORS_RAINFALL} from "helpers/colors";
import {VARIABLES} from "helpers/formatters";

import {API} from ".env";

class RainfallBars extends SectionRows {

  render() {
    const {attrs, focus, profile} = this.props;
    const data = this.context.data.rainfallCv;
    const hasData = data && data.length > 0 && data[0].cropland_rainfallCVgt20pct_pct !== undefined;

    const sumlevel = profile.id.slice(0, 3);
    const adm0 = profile.id.slice(5, 10);
    const param = sumlevel === "040" ? `geo=${ focus.join(",") }` : `inside=geo:040AF${adm0}`;
    const apiUrl = `${API}api/join/?show=geo&${param}&sumlevel=all&required=cropland_rainfallCVgt20pct_pct&display_names=1&order=cropland_rainfallCVgt20pct_pct&sort=desc`;
    const res = data.length > 0 ? data[0] : {};

    const isAdm0 = profile.level === "adm0";
    const topoFilt = isAdm0 ? d => d : d => adm0 === d.properties.geo.slice(5, 10);
    const topoPath = isAdm0 ? "/topojson/continent.json" : "/topojson/cell5m/adm1.json";
    const statValue = hasData ?  data[0].cropland_rainfallCVgt20pct_pct : null;
    const sentence = hasData ? <article>From {res.start_year} to {res.year}, {VARIABLES.cropland_rainfallCVgt20pct_pct(statValue)} of cropland area
            in {res.geo_name} had rainfall variability greater than 20%.</article> : "";

    return (
      <SectionRows>
        <SectionTitle>Rainfall Variability</SectionTitle>
        {sentence}
        <SectionColumns>
          <Geomap config={{
            colorScale: "cropland_rainfallCVgt20pct_pct",
            colorScaleConfig: {
              color: COLORS_RAINFALL,
              axisConfig: {
                tickFormat: d => VARIABLES.cropland_rainfallCVgt20pct_pct(d)
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
        </SectionColumns>
    </SectionRows>
    );
  }
}

RainfallBars.need = [
  fetchData("rainfallCv", "api/join/?show=geo&geo=<id>&sumlevel=all&required=start_year,cropland_rainfallCVgt20pct_pct&display_names=1")
];

export default connect(state => ({
  attrs: state.attrs.geo,
  focus: state.focus
}), {})(RainfallBars);
