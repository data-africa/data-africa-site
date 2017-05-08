import React from "react";

import {BarChart, Treemap} from "d3plus-react";
import {SectionRows, SectionColumns, SectionTitle} from "datawheel-canon";
import {titleCase} from "d3plus-text";

import {fetchData} from "datawheel-canon";
import {VARIABLES, FORMATTERS} from "helpers/formatters";
import Selector from "components/Selector";
import {COLORS_CROP} from "helpers/colors";

class CropsBySupply extends SectionRows {
  constructor(props) {
    super(props);
    this.state = {metric: "harvested_area"};
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({metric: event.target.value});
  }

  render() {

    const {profile} = this.props;
    const {metric} = this.state;
    const {waterData} = this.context.data;
    const irrData = waterData.filter(x => x.water_supply === "irrigated");
    const rainData = waterData.filter(x => x.water_supply === "rainfed");
    const metricLabel = metric === "harvested_area" ? "harvested area" : "production value";
    const irrVals = irrData.map(x => x[metric]);
    const rainVals = rainData.map(y => y[metric]);

    const totalIrr = irrVals.reduce((a, b) => a + b, 0);
    const totalRain = rainVals.reduce((a, b) => a + b, 0);
    const pctRainfall = totalRain / (totalRain + totalIrr);
    const opts = [{value: "harvested_area", label: "Harvested Area"},
                  {value: "value_of_production", label: "Production Value"}];
    return (
      <SectionColumns>
        <article className="section-text">
          <SectionTitle>Water Supply for Crops</SectionTitle>
          <Selector options={opts} callback={this.onChange}/>
          {FORMATTERS.shareWhole(pctRainfall)} percent of crops by {metricLabel} in {profile.name} are
          rainfed, whereas {FORMATTERS.shareWhole(1 - pctRainfall)} percent as irrigated.
        </article>
        <div className="small-height">
        <SectionRows>
            <BarChart config={{
              data: waterData.sort(a => a.water_supply === "rainfed" ? -1 : 1),
              discrete: "y",
              groupBy: ["water_supply"],
              groupPadding: 0,
              height: 150,
              label: d => titleCase(d.water_supply),
              shapeConfig: {
                fill: d => d.water_supply === "rainfed" ? "#C2DFF0" : "#0A86B7",
                Bar: {
                  labelConfig: {
                    textAnchor: "center"
                  }
                }
              },
              stacked: true,
              x: metric,
              xConfig: {
                tickFormat: VARIABLES[metric],
                title: titleCase(metricLabel)
              },
              y: () => "",
              yConfig: {
                gridSize: 0,
                tickFormat: d => titleCase(d),
                title: ""
              }
            }} />
            <div className="margin-right">
            <SectionColumns>
                <Treemap config={{
                  data: rainData,
                  groupBy: ["crop_parent", "crop_name"],
                  height: 250,
                  label: d => d.crop_name instanceof Array ? d.crop_parent : d.crop_name,
                  legend: false,
                  shapeConfig: {
                    fill: d => COLORS_CROP[d.crop_parent]
                  },
                  sum: d => d[metric],
                  title: `Rainfed Crops (${FORMATTERS.shareWhole(pctRainfall)} of crops)`
                }} />

                <Treemap config={{
                  data: irrData,
                  groupBy: ["crop_parent", "crop_name"],
                  height: 250,
                  label: d => d.crop_name instanceof Array ? d.crop_parent : d.crop_name,
                  legend: false,
                  shapeConfig: {
                    fill: d => COLORS_CROP[d.crop_parent]
                  },
                  sum: d => d[metric],
                  title: `Irrigated Crops (${FORMATTERS.shareWhole(1 - pctRainfall)} of crops)`
                }} />

            </SectionColumns>
            </div>
          </SectionRows>
        </div>
      </SectionColumns>
    );
  }
}

CropsBySupply.need = [
  fetchData("waterData", "api/join/?geo=<id>&sumlevel=lowest,lowest&show=crop,water_supply&required=crop_parent,harvested_area,value_of_production,crop_name")
];

export default CropsBySupply;
