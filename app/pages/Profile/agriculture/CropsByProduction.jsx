import React from "react";

import {Treemap} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {fetchData} from "actions/profile";
import {VARIABLES} from "helpers/formatters";

class CropsByProduction extends SectionColumns {

  render() {

    const {profile} = this.props;
    const data = this.context.data.value_of_production;

    return (
      <SectionColumns>
        <SectionTitle>Crops by Production Value</SectionTitle>
        <article>
          The crop with the highest production value in { profile.name } is { data[0].crop_name }, with a value of { VARIABLES.value_of_production(data[0].value_of_production) }.
        </article>
        <Treemap config={{
          data,
          groupBy: "crop",
          label: d => d.crop_name,
          legend: false,
          sum: d => d.value_of_production
        }} />
      </SectionColumns>
    );
  }
}

CropsByProduction.need = [
  fetchData("value_of_production", "api/join/?geo=<id>&show=crop&required=harvested_area,value_of_production&order=value_of_production&sort=desc&display_names=true")
];

export default CropsByProduction;
