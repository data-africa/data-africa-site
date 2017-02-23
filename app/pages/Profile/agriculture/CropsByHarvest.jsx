import React from "react";

import {Treemap} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {fetchData} from "actions/profile";
import {VARIABLES} from "helpers/formatters";

class CropsByHarvest extends SectionColumns {

  render() {

    const {profile} = this.props;
    const data = this.context.data.harvested_area;

    return (
      <SectionColumns>
        <SectionTitle>Crops by Harvested Area</SectionTitle>
        <article>
          The most common crop in { profile.name }, by harvested area, is { data[0].crop_name } with a harvested area of { VARIABLES.harvested_area(data[0].harvested_area) }.
        </article>
        <Treemap config={{
          data,
          groupBy: "crop",
          label: d => d.crop_name,
          legend: false,
          sum: d => d.harvested_area
        }} />
      </SectionColumns>
    );
  }
}

CropsByHarvest.need = [
  fetchData("harvested_area", "api/join/?geo=<id>&show=crop&required=harvested_area,value_of_production&order=harvested_area&sort=desc&display_names=true")
];

export default CropsByHarvest;
