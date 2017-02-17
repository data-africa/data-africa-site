import React, {Component} from "react";
import {connect} from "react-redux";

import {Plot} from "d3plus-react";

import {VARIABLES, FORMATTERS} from "helpers/formatters";
import {SectionColumns} from "datawheel-canon";

import {API} from ".env";

class CropsAreaVsValue extends Component {

  render() {

    const {attrs, profile, vars} = this.props;
    let crops = vars.harvested_area.slice();
    crops = crops.filter((c) => c.harvested_area && c.harvested_area > 0);
    crops.forEach(c => {
      c.name = attrs[c.crop] ? attrs[c.crop].name : c.crop;
      c.density = c.value_of_production / c.harvested_area;
    });
    crops.sort((a, b) => b.density - a.density);
    const topCrop = crops[0];
    const bottomCrop = crops[crops.length - 1];

    return (
      <SectionColumns title="Harvested Area Versus Value of Production">
      <article>
        <p><strong>{ topCrop.name }</strong> is the crop with the highest production value per area in { profile.name }, with a harvested area of { VARIABLES.value_density(topCrop.density) }.</p>
        <p><strong>{ bottomCrop.name }</strong> is the crop with the lowest production value per area in { profile.name }, with a harvested area of { VARIABLES.value_density(bottomCrop.density) }.</p>
        <p>This means that growers of {topCrop.name} will earn approximately <strong>{FORMATTERS.round(topCrop.density / bottomCrop.density)} times</strong> more per hectacre of {topCrop.name} that they grow versus {bottomCrop.name}.</p>
      </article>
        <Plot config={{
          data: `${API}api/join/?show=crop&geo=${profile.id}&sumlevel=lowest&required=harvested_area,value_of_production`,
          label: d => attrs[d.crop] ? attrs[d.crop].name : d.crop,
          legend: false,
          groupBy: "crop",
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
      </SectionColumns>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.crop,
  vars: state.profile.vars.crop
}), {})(CropsAreaVsValue);
