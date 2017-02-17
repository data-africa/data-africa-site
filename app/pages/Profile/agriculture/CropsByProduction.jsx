import React, {Component} from "react";
import {connect} from "react-redux";

import {Treemap} from "d3plus-react";
import {SectionColumns} from "datawheel-canon";

import {fetchData} from "actions/profile";
import {VARIABLES} from "helpers/formatters";

class CropsByProduction extends Component {

  render() {

    const {data, profile} = this.props;

    return (
      <SectionColumns title="Crops by Production Value">
        <article>
          The crop with the highest production value in { profile.name } is { data[0].crop_name || data[0].crop }, with a value of { VARIABLES.value_of_production(data[0].value_of_production) }.
        </article>
        <Treemap config={{
          data,
          groupBy: "crop",
          label: d => d.crop_name || d.crop,
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

export default connect(state => ({
  data: state.profile.data.value_of_production
}), {})(CropsByProduction);
