import React, {Component} from "react";
import {connect} from "react-redux";

import {Treemap} from "d3plus-react";
import {SectionColumns} from "datawheel-canon";

import {fetchData} from "actions/profile";
import {VARIABLES} from "helpers/formatters";

class CropsByHarvest extends Component {

  render() {

    const {data, profile} = this.props;

    return (
      <SectionColumns title="Crops by Harvested Area">
        <article>
          The most common crop in { profile.name }, by harvested area, is { data[0].crop_name || data[0].crop } with a harvested area of { VARIABLES.harvested_area(data[0].harvested_area) }.
        </article>
        <Treemap config={{
          data,
          groupBy: "crop",
          label: d => d.crop_name || d.crop,
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

export default connect(state => ({
  data: state.profile.data.harvested_area
}), {})(CropsByHarvest);
