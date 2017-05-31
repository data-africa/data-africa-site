import React from "react";

import {sum} from "d3-array";
import {Treemap} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {fetchData} from "datawheel-canon";
import {COLORS_CROP} from "helpers/colors";
import {tooltipBody} from "helpers/d3plus";
import {FORMATTERS, VARIABLES} from "helpers/formatters";

class CropsByHarvest extends SectionColumns {

  render() {

    const {profile} = this.props;
    const data = this.context.data.harvested_area;
    const total = sum(data, d => d.harvested_area);

    return (
      <SectionColumns>

        <article className="section-text">
          <SectionTitle>Crops by Harvested Area</SectionTitle>
          The most common crop in { profile.name }, by harvested area, is { data[0].crop_name } with <strong>{ VARIABLES.harvested_area(data[0].harvested_area) }</strong>.
        </article>
        <Treemap config={{
          data,
          groupBy: ["crop_parent", "crop_name"],
          height: 450,
          label: d => d.crop_name instanceof Array ? d.crop_parent : d.crop_name,
          shapeConfig: {
            fill: d => COLORS_CROP[d.crop_parent]
          },
          tooltipConfig: {
            body: tooltipBody.bind(["harvested_area", d => `<span class="d3plus-body-key">Share:</span> <span class="d3plus-body-value">${ FORMATTERS.share(d.harvested_area / total) }</span>`])
          },
          sum: d => d.harvested_area
        }} />
    </SectionColumns>
    );
  }
}

CropsByHarvest.need = [
  fetchData("harvested_area", "api/join/?geo=<id>&sumlevel=lowest&show=crop&required=harvested_area,value_of_production,crop_parent,crop_name&order=harvested_area&sort=desc")
];

export default CropsByHarvest;
