import React from "react";
import {connect} from "react-redux";


import {BarChart, Geomap} from "d3plus-react";
import {SectionRows, SectionColumns, SectionTitle} from "datawheel-canon";

import {fetchData} from "actions/profile";
import {COLORS_RAINFALL} from "helpers/colors";
import {VARIABLES} from "helpers/formatters";
import Selector from "components/Selector";
import {API} from ".env";

class RainfallBars extends SectionRows {
  constructor(props) {
    super(props);
    this.state = {variable: "rainfall_awa_mm"};
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({variable: event.target.value});
  }

  renderViz() {
    const {attrs, focus, profile} = this.props;
    const {variable} = this.state;
    const sumlevel = profile.id.slice(0, 3);
    const adm0 = profile.id.slice(5, 10);
    const param = sumlevel === "040" ? `geo=${ focus.join(",") }` : `inside=geo:040AF${adm0}`;
    const isAdm0 = profile.level === "adm0";
    const topoFilt = isAdm0 ? d => d : d => adm0 === d.properties.geo.slice(5, 10);
    const topoPath = isAdm0 ? "/topojson/continent.json" : "/topojson/cell5m/adm1.json";

    const apiUrl = `${API}api/join/?show=geo&${param}&sumlevel=all&required=${variable}&display_names=1&order${variable}&sort=desc`;

    const myId = isAdm0 ? profile.iso3 : profile.id;

    return <div className="small-height">
            <SectionColumns>
              <Geomap config={{
                colorScale: variable,
                colorScaleConfig: {
                  color: COLORS_RAINFALL,
                  axisConfig: {
                    tickFormat: d => VARIABLES[variable](d)
                  }
                },
                colorScalePosition: "left",
                data: apiUrl,
                groupBy: d => d.data ? d.id : isAdm0 ? attrs[d.geo] ? attrs[d.geo].iso3 : d.geo : d.geo,
                height: 350,
                label: d => d.data ? d.data.geo_name : d.geo_name,
                ocean: "transparent",
                padding: 0,
                shapeConfig: {Path: {
                  stroke: d =>  d.id === myId ? "rgba(0, 0, 0, 0.6)" : "rgba(7, 94, 128, 0.5)",
                  strokeWidth: d => d.id === myId ? "2px" : "1px"
                }},
                tiles: false,
                topojson: topoPath,
                topojsonFilter: topoFilt,
                topojsonId: d => isAdm0 ? d.properties.iso_a3 : d.properties.geo,
                zoom: false
              }} />
            <BarChart config={{
              colorScale: variable,
              colorScaleConfig: {
                color: COLORS_RAINFALL
              },
              colorScalePosition: false,
              data: apiUrl,
              discrete: "y",
              groupBy: "geo_name",
              groupPadding: 4,
              height: 400,
              legend: false,
              shapeConfig: {label: false},
              x: variable,
              xConfig: {
                tickFormat: d => VARIABLES[variable](d),
                title: "Rainfall"
              },
              y: "geo_name",
              yConfig: {
                gridSize: 0,
                tickFormat: d => d === "United Republic of Tanzania" ? "United Republic\nof Tanzania" : d,
                title: false
              },
              ySort: (a, b) => a[variable] - b[variable]
            }} />
          </SectionColumns>
        </div>;

  }


  render() {
    const {profile} = this.props;
    const {variable} = this.state;
    const data = this.context.data.rainfall;
    const isRainfall = variable === "rainfall_awa_mm";
    const hasData = data && data.length > 0 && (data[0][variable] !== null && data[0][variable] !== undefined);

    const res = data.length > 0 ? data[0] : {};
    const opts = [{label: "Rainfall", value: "rainfall_awa_mm"},
                  {label: "Rainfall Variability", value: "cropland_rainfallCVgt20pct_pct"}];
    const title = isRainfall ? "Average Annual Rainfall" : "Rainfall Variability";
    const desc = isRainfall ? `${res.geo_name} had average annual rainfall of ${VARIABLES[variable](res[variable])}`
                  : `${VARIABLES[variable](res[variable])} of cropland area in ${res.geo_name} had
                     rainfall variability greater than 20%`;
    const sentence = !hasData ? `Showing ${title.toLowerCase()} data across ${profile.parent_name}` : `From ${res.start_year} to ${res.year} ${desc} across a total cropland area of ${VARIABLES.harvested_area(res.cropland_total_ha)}`;
    return (
      <SectionColumns>


        <article className="section-text">
          <SectionTitle>{title} by Location</SectionTitle>
          <Selector options={opts} callback={this.onChange}/>
          {sentence}.
        </article>

          {this.renderViz()}
    </SectionColumns>

    );
  }
}

RainfallBars.need = [
  fetchData("rainfall", "api/join/?show=geo&geo=<id>&sumlevel=all&required=start_year,cropland_rainfallCVgt20pct_pct,rainfall_awa_mm,cropland_total_ha&display_names=1")
];

export default connect(state => ({
  attrs: state.attrs.geo,
  focus: state.focus
}), {})(RainfallBars);
