import React from "react";

import {Plot} from "d3plus-react";
import pluralize from "pluralize";

import {fetchData} from "datawheel-canon";
import {VARIABLES, FORMATTERS} from "helpers/formatters";
import {COLORS_CROP} from "helpers/colors";
import {tooltipBody} from "helpers/d3plus";
import {SectionColumns, SectionTitle} from "datawheel-canon";

class CropsAreaVsValue extends SectionColumns {
  constructor(props) {
    super(props);
    this.state = {cropsData: null, scaleMode: "Linear"};
  }

  onChangeScale(scaleMode) {
    this.setState({logScale: scaleMode === "log"});
  }

  logControls() {
    return [{
      on: {change: this.onChangeScale.bind(this)},
      options: [{text: "Linear", value: "linear"}, {text: "Log", value: "log"}],
      type: "Radio"
    }];
  }

  render() {

    const {profile} = this.props;
    const {logScale} = this.state;

    const data = this.context.data.harvested_area.map(x => ({...x,
      value_of_production_log: Math.log10(x.value_of_production),
      harvested_area_log: Math.log10(x.harvested_area)
    }));

    let crops = data.slice();
    crops = crops.filter(c => c.harvested_area && c.harvested_area > 0);
    crops.forEach(c => {
      c.name = c.crop_name ? pluralize.plural(c.crop_name) : c.crop;
      c.density = c.value_of_production / c.harvested_area;
    });
    crops.sort((a, b) => b.density - a.density);
    const topCrop = crops[0];
    const bottomCrop = crops[crops.length - 1];

    const logFormatter = varName => logScale ? val => VARIABLES[varName](Math.pow(10, val)) : VARIABLES[varName];
    if (!crops || crops.length === 0) {
      return null;
    }
    return (
      <SectionColumns>
        <article className="section-text">
        <SectionTitle>Harvested Area Versus Value of Production</SectionTitle>
          <p><strong>{ topCrop.name }</strong> are the crop with the highest production value per area in { profile.name }, with { VARIABLES.value_density(topCrop.density) }.</p>
          <p><strong>{ bottomCrop.name }</strong> are the crop with the lowest production value per area in { profile.name }, with { VARIABLES.value_density(bottomCrop.density) }.</p>
          <p>This means that growers of {topCrop.name} will earn approximately <strong>{FORMATTERS.round(topCrop.density / bottomCrop.density)} times</strong> more per hectare than if they grow {bottomCrop.name}.</p>
        </article>
        <Plot config={{
          controls: this.logControls(),
          data: crops,
          height: 450,
          label: d => d.crop_name instanceof Array ? d.crop_parent : d.crop_name,
          legend: false,
          groupBy: ["crop_parent", "crop_name"],
          shapeConfig: {
            fill: d => COLORS_CROP[d.crop_parent],
            stroke: "#979797",
            strokeWidth: 1
          },
          tooltipConfig: {
            body: tooltipBody.bind(["harvested_area", "value_of_production"])
          },
          x: logScale ? "harvested_area_log" : "harvested_area",
          xConfig: {
            tickFormat: logFormatter("harvested_area"),
            title: "Harvested Area"
          },
          y: logScale ? "value_of_production_log" : "value_of_production",
          yConfig: {
            tickFormat: logFormatter("value_of_production"),
            title: "Value of Production"
          }
        }} />
      </SectionColumns>
    );
  }
}

CropsAreaVsValue.need = [
  fetchData("harvested_area", "api/join/?geo=<geoid>&sumlevel=lowest&show=crop&required=harvested_area,value_of_production,crop_parent,crop_name&order=harvested_area&sort=desc")
];

export default CropsAreaVsValue;
