import React from "react";
import {connect} from "react-redux";
import {Profile} from "datawheel-canon";
import d3plus from "helpers/d3plus";
import "./sections.css";
import "./Embed.css";

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

class Embed extends Profile {

  constructor() {
    super();
  }

  render() {

    const {id, slug} = this.props.params;
    const {attrs} = this.props;

    const attr = attrs.geo[id];

    const Comp = sections[slug];

    return <Comp profile={attr} embed={ true } />;
  }
}

Embed.defaultProps = {d3plus};

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
