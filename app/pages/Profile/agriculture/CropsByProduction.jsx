import React from "react";

import {sum} from "d3-array";

import {Treemap} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {fetchData} from "datawheel-canon";
import {COLORS_CROP} from "helpers/colors";
import {tooltipBody} from "helpers/d3plus";
import {FORMATTERS, VARIABLES} from "helpers/formatters";

class CropsByProduction extends SectionColumns {

  render() {

    const {embed, profile} = this.props;
    const data = this.context.data.value_of_production;
    const total = sum(data, d => d.value_of_production);

    return (
      <SectionColumns>

        <article className="section-text">
         <SectionTitle>Crops by Production Value</SectionTitle>
          The crop with the highest production value in { profile.name } is { data[0].crop_name }, with a value of <strong>{ VARIABLES.value_of_production (data[0].value_of_production) }</strong>.
        </article>
        <Treemap config={{
          data,
          groupBy: ["crop_parent", "crop_name"],
          height: embed ? undefined : 450,
          label: d => d.crop_name instanceof Array ? d.crop_parent : d.crop_name,
          shapeConfig: {
            fill: d => COLORS_CROP[d.crop_parent]
          },
          tooltipConfig: {
            body: tooltipBody.bind(["value_of_production", d => `<span class="d3plus-body-key">Share:</span> <span class="d3plus-body-value">${ FORMATTERS.share(d.value_of_production / total) }</span>`])
          },
          sum: d => d.value_of_production
        }} />
    </SectionColumns>
    );
  }
}

CropsByProduction.need = [
  fetchData("value_of_production", "api/join/?geo=<geoid>&show=crop&sumlevel=lowest&required=harvested_area,value_of_production,crop_parent,crop_name&order=value_of_production&sort=desc")
];

export default CropsByProduction;
