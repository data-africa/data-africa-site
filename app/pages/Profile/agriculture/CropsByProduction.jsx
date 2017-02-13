import React, {Component} from "react";
import {connect} from "react-redux";

import {Treemap} from "d3plus-react";
import SectionColumns from "src/components/Section";

import {VARIABLES} from "helpers/formatters";

import {API} from ".env";

class CropsByProduction extends Component {

  render() {

    const {attrs, profile, vars} = this.props;

    const crops = vars.value_of_production.slice();
    crops.forEach(c => {
      c.name = attrs[c.crop] ? attrs[c.crop].name : c.crop;
    });

    return (
      <SectionColumns title="Crops by Production Value">
        <article>
          The crop with the highest production value in { profile.name } is { crops[0].name }, with a value of { VARIABLES.value_of_production(crops[0].value_of_production) }.
        </article>
        <Treemap config={{
          data: `${API}api/join/?show=crop&geo=${profile.id}&sumlevel=lowest&required=value_of_production`,
          groupBy: "crop",
          label: d => attrs[d.crop] ? attrs[d.crop].name : d.crop,
          legend: false,
          sum: d => d.value_of_production
        }} />
      </SectionColumns>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.crop,
  vars: state.profile.vars.crop
}), {})(CropsByProduction);
