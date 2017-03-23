import React from "react";

import {Treemap} from "d3plus-react";
import {SectionRows, SectionTitle} from "datawheel-canon";

import {fetchData} from "actions/profile";
import {COLORS_CROP} from "helpers/colors";
import {VARIABLES} from "helpers/formatters";

class CropsByProduction extends SectionRows {

  render() {

    const {profile} = this.props;
    const data = this.context.data.value_of_production;

    return (
      <SectionRows>
        <SectionTitle>Crops by Production Value</SectionTitle>
        <article className="section-text">
          The crop with the highest production value in { profile.name } is { data[0].crop_name }, with a value of <strong>{ VARIABLES.value_of_production (data[0].value_of_production) }</strong>.
        </article>
        <div className="viz-container treemap">
        <Treemap config={{
          data,
          groupBy: ["crop_parent", "crop_name"],
          height: 450,
          label: d => d.crop_name instanceof Array ? d.crop_parent : d.crop_name,
          shapeConfig: {
            fill: d => COLORS_CROP[d.crop_parent]
          },
          sum: d => d.value_of_production
        }} />
        </div>
    </SectionRows>
    );
  }
}

CropsByProduction.need = [
  fetchData("value_of_production", "api/join/?geo=<id>&show=crop&sumlevel=lowest&required=harvested_area,value_of_production,crop_parent,crop_name&order=value_of_production&sort=desc")
];

export default CropsByProduction;
