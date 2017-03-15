import React from "react";
import {connect} from "react-redux";

import {Geomap} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";
import {fetchData} from "actions/profile";
import {COLORS_RAINFALL} from "helpers/colors";
import {VARIABLES} from "helpers/formatters";

import {API} from ".env";
import Selector from "pages/Profile/ui/Selector";

class RainfallCV extends SectionColumns {
  constructor(props) {
    super(props);
    this.state = {cvLevel: "cropland_rainfallCVgt20pct_pct"};
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({cvLevel: event.target.value});
  }

  render() {
    const {attrs, focus, profile} = this.props;
    const {cvLevel} = this.state;
    const data = this.context.data.rainfallCv;
    const hasData = data && data.length > 0 && data[0][cvLevel] !== undefined;

    const sumlevel = profile.id.slice(0, 3);
    const adm0 = profile.id.slice(5, 10);
    const param = sumlevel === "040" ? `geo=${ focus.join(",") }` : `inside=geo:040AF${adm0}`;
    const apiUrl = `${API}api/join/?show=geo&${param}&sumlevel=all&required=${cvLevel}&display_names=1&order=cropland_rainfallCVgt20pct_pct&sort=desc`;
    const res = data.length > 0 ? data[0] : {};

    const isAdm0 = profile.level === "adm0";
    const topoFilt = isAdm0 ? d => d : d => adm0 === d.properties.geo.slice(5, 10);
    const topoPath = isAdm0 ? "/topojson/continent.json" : "/topojson/cell5m/adm1.json";
    const statValue = hasData ?  data[0][cvLevel] : null;
    const pct = cvLevel === "cropland_rainfallCVgt20pct_pct" ? "20" : "30";
    const sentence = hasData ? <article>From {res.start_year} to {res.year}, {VARIABLES.cropland_cv(statValue)} of cropland area
            in {res.geo_name} had rainfall variability greater than {pct}%.</article> : "";

    const opts = [{label: "20% Rainfall Variability Threshold", value: "cropland_rainfallCVgt20pct_pct"},
                  {label: "30% Rainfall Variability Threshold", value: "cropland_rainfallCVgt30pct_pct"}];
    return (
      <SectionColumns>
        <SectionTitle>Rainfall Variability</SectionTitle>
        <article className="section-text">
          <Selector options={opts} callback={this.onChange}/>
          {sentence}
        </article>
        <Geomap config={{
          colorScale: cvLevel,
          colorScaleConfig: {
            color: COLORS_RAINFALL,
            axisConfig: {
              tickFormat: d => VARIABLES.cropland_cv(d)
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
    );
  }
}

RainfallCV.need = [
  fetchData("rainfallCv", "api/join/?show=geo&geo=<id>&sumlevel=all&required=start_year,cropland_rainfallCVgt20pct_pct,cropland_rainfallCVgt30pct_pct&display_names=1")
];

export default connect(state => ({
  attrs: state.attrs.geo,
  focus: state.focus
}), {})(RainfallCV);
