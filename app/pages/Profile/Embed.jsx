import React, {Component} from "react";
import {connect} from "react-redux";
import {CanonComponent} from "datawheel-canon";
import d3plus from "helpers/d3plus";
import "./sections.css";
import "./Embed.css";
import {fetchData} from "datawheel-canon";
import {dataFold} from "d3plus-viz";
import CropsAreaVsValue from "./agriculture/CropsAreaVsValue";
import CropsByHarvest from "./agriculture/CropsByHarvest";
import CropsByProduction from "./agriculture/CropsByProduction";
import CropsBySupply from "./agriculture/CropsBySupply";
import RainfallBars from "./climate/RainfallBars";
import Conditions from "./health/Conditions";
import ConditionsByGender from "./health/ConditionsByGender";
import ConditionsByResidence from "./health/ConditionsByResidence";
import Poverty from "./poverty/Poverty";
import PovertyByGender from "./poverty/PovertyByGender";
import PovertyByResidence from "./poverty/PovertyByResidence";

const sections = {
  CropsAreaVsValue,
  CropsByHarvest,
  CropsByProduction,
  CropsBySupply,
  RainfallBars,
  Conditions,
  ConditionsByGender,
  ConditionsByResidence,
  Poverty,
  PovertyByGender,
  PovertyByResidence
};

class Embed extends Component {

  constructor() {
    super();
  }

  render() {

    const {slug} = this.props.params;
    const {attrs, data} = this.props;
    const {geoid} = this.props.data;
    const attr = attrs.geo[geoid];

    const Comp = sections[slug];

    return <CanonComponent data={data} d3plus={d3plus}>
      <Comp profile={attr} embed={ true } />
    </CanonComponent>;
  }
}

Embed.preneed = [
  fetchData("geoid", "attrs/geo/<id>", res => dataFold(res)[0].id)
];

Embed.need = [
  Conditions,
  ConditionsByGender,
  ConditionsByResidence,
  CropsByHarvest,
  CropsByProduction,
  CropsBySupply,
  CropsAreaVsValue,
  Poverty,
  PovertyByGender,
  PovertyByResidence,
  RainfallBars
];

export default connect(state => ({
  attrs: state.attrs,
  data: state.profile.data,
  focus: state.focus
}))(Embed);
