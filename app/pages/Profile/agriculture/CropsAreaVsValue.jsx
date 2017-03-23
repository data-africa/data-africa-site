import React from "react";

import {Plot} from "d3plus-react";
import pluralize from "pluralize";

import {fetchData} from "actions/profile";
import {VARIABLES, FORMATTERS} from "helpers/formatters";
import {COLORS_CROP} from "helpers/colors";
import {SectionColumns, SectionTitle} from "datawheel-canon";

class CropsAreaVsValue extends SectionColumns {

  render() {

    const {profile} = this.props;
    const data = this.context.data.harvested_area;
    let crops = data.slice();
    crops = crops.filter(c => c.harvested_area && c.harvested_area > 0);
    crops.forEach(c => {
      c.name = c.crop_name ? pluralize.plural(c.crop_name) : c.crop;
      c.density = c.value_of_production / c.harvested_area;
    });
    crops.sort((a, b) => b.density - a.density);
    const topCrop = crops[0];
    const bottomCrop = crops[crops.length - 1];

    return (
      <SectionColumns>
        <SectionTitle>Harvested Area Versus Value of Production</SectionTitle>
        <article className="section-text">
          <p><strong>{ topCrop.name }</strong> are the crop with the highest production value per area in { profile.name }, with a harvested area of { VARIABLES.value_density(topCrop.density) }.</p>
          <p><strong>{ bottomCrop.name }</strong> are the crop with the lowest production value per area in { profile.name }, with a harvested area of { VARIABLES.value_density(bottomCrop.density) }.</p>
          <p>This means that growers of {topCrop.name} will earn approximately <strong>{FORMATTERS.round(topCrop.density / bottomCrop.density)} times</strong> more per hectacre of {topCrop.name} that they grow versus {bottomCrop.name}.</p>
        </article>
        <div className="viz-container columns">
        <Plot config={{
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
          x: "harvested_area",
          xConfig: {
            tickFormat: VARIABLES.harvested_area,
            title: "Harvested Area"
          },
          y: "value_of_production",
          yConfig: {
            tickFormat: VARIABLES.value_of_production,
            title: "Value of Production"
          }
        }} />
        </div>
      </SectionColumns>
    );
  }
}

CropsAreaVsValue.need = [
  fetchData("harvested_area", "api/join/?geo=<id>&sumlevel=lowest&show=crop&required=harvested_area,value_of_production,crop_parent,crop_name&order=harvested_area&sort=desc")
];

export default CropsAreaVsValue;
