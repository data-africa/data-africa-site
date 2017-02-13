import React, {Component} from "react";
import {connect} from "react-redux";

import {Treemap} from "d3plus-react";
import SectionColumns from "src/components/Section";

import {VARIABLES} from "helpers/formatters";

import {API} from ".env";

class CropsByHarvest extends Component {

  render() {

    const {attrs, profile, vars} = this.props;

    const crops = vars.harvested_area.slice();
    crops.forEach(c => {
      c.name = attrs[c.crop] ? attrs[c.crop].name : c.crop;
    });

    return (
      <SectionColumns title="Crops by Harvested Area">
        <article>
          The most common crop in { profile.name }, by harvested area, is { crops[0].name } with a harvested area of { VARIABLES.harvested_area(crops[0].harvested_area) }.
        </article>
        <Treemap config={{
          data: `${API}api/join/?show=crop&geo=${profile.id}&sumlevel=lowest&required=harvested_area`,
          groupBy: "crop",
          label: d => attrs[d.crop] ? attrs[d.crop].name : d.crop,
          legend: false,
          sum: d => d.harvested_area
        }} />
      </SectionColumns>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.crop,
  vars: state.profile.vars.crop
}), {})(CropsByHarvest);
