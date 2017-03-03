import React from "react";
import {connect} from "react-redux";
import {fetchStats} from "actions/profile";
import {Profile, Stat, TopicTitle} from "datawheel-canon";
import d3plus from "helpers/d3plus";
import "./intro.css";
import "./topics.css";
import "./sections.css";

import {Geomap} from "d3plus-react";
import IntroParagraph from "./splash/IntroParagraph";

import CropsAreaVsValue from "./agriculture/CropsAreaVsValue";
import CropsByHarvest from "./agriculture/CropsByHarvest";
import CropsByProduction from "./agriculture/CropsByProduction";

import RainfallBars from "./climate/RainfallBars";

import Conditions from "./health/Conditions";
import ConditionsByGender from "./health/ConditionsByGender";
import ConditionsByResidence from "./health/ConditionsByResidence";

import Poverty from "./poverty/Poverty";
import PovertyByGender from "./poverty/PovertyByGender";
import PovertyByResidence from "./poverty/PovertyByResidence";

class GeoProfile extends Profile {

  urlPath(attr) {
    const adm0 = String(`00000${attr.adm0_id}`).slice(-5);
    const targetId = `040AF${adm0}`;
    return `url('/images/geo/${targetId}.jpg')`;
  }

  render() {

    const {id} = this.props.params;
    const {attrs, focus, stats} = this.props;
    const attr = attrs.geo[id];
    const focusISO = focus.map(f => attrs.geo[f].iso3);
    const isAdm0 = attr.level === "adm0";
    const adm0 = id.slice(5, 10);

    let fill = d => d.properties.iso_a3 === attr.iso3 ? "white" : focusISO.includes(d.properties.iso_a3) ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.1)";
    let topoFilt = d => d;
    let topoPath = "/topojson/continent.json";

    if (!isAdm0) {
      fill = d => d.properties.geo === id ? "white" : focusISO.includes(d.properties.iso_a3) ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.1)";
      topoFilt = d => adm0 === d.properties.geo.slice(5, 10);
      topoPath = "/topojson/cell5m/adm1.json";
    }


    return (
      <div className="profile">

        <div className="intro">

          <div className="splash">
            <div className="image" style={{backgroundImage: this.urlPath(attr)}}></div>
            <div className="gradient"></div>
          </div>

          <div className="header">
            <Geomap config={{
              ocean: "transparent",
              padding: 0,
              shapeConfig: {Path: {
                fill,
                stroke: "rgba(255, 255, 255, 0.25)"
              }},
              tiles: false,
              topojson: topoPath,
              topojsonFilter: topoFilt,
              topojsonKey: "collection",
              zoom: false
            }} />
            <div className="meta">
              <div className="title">{ attr.name }</div>
              { stats.map(stat => <Stat key={ stat.key } label={ stat.label } value={ stat.attr ? attrs[stat.attr][stat.value].name : stat.value } />) }
            </div>
          </div>

          <div className="subnav">
            <a className="sublink" href="#introduction">
              <img className="icon" src="/images/topics/introduction.svg" />
              Introduction
            </a>
            <a className="sublink" href="#agriculture">
              <img className="icon" src="/images/topics/agriculture.svg" />
              Agriculture
            </a>
            <a className="sublink" href="#climate">
              <img className="icon" src="/images/topics/climate.svg" />
              Climate
            </a>
            <a className="sublink" href="#health">
              <img className="icon" src="/images/topics/health.svg" />
              Health
            </a>
            <a className="sublink" href="#poverty">
              <img className="icon" src="/images/topics/poverty.svg" />
              Poverty
            </a>
          </div>

          <div className="intro-wrapper">
            <IntroParagraph profile={attr} />
          </div>

        </div>

        <TopicTitle slug="agriculture">
          <div className="icon" style={{backgroundImage: "url('/images/topics/agriculture.svg')"}}></div>
          Agriculture
        </TopicTitle>
        <CropsByHarvest profile={attr} />
        <CropsByProduction profile={attr} />
        <CropsAreaVsValue profile={attr} />

        <TopicTitle slug="climate">
          <div className="icon" style={{backgroundImage: "url('/images/topics/climate.svg')"}}></div>
          Climate
        </TopicTitle>
        <RainfallBars profile={attr} />

        <TopicTitle slug="health">
          <div className="icon" style={{backgroundImage: "url('/images/topics/health.svg')"}}></div>
          Health
        </TopicTitle>
        <Conditions profile={attr} />
        <ConditionsByGender profile={attr} />
        <ConditionsByResidence profile={attr} />

        <TopicTitle slug="poverty">
          <div className="icon" style={{backgroundImage: "url('/images/topics/poverty.svg')"}}></div>
          Poverty
        </TopicTitle>
        <Poverty profile={attr} />
        <PovertyByGender profile={attr} />
        <PovertyByResidence profile={attr} />

      </div>
    );
  }
}

GeoProfile.defaultProps = {d3plus};

GeoProfile.need = [
  fetchStats,
  IntroParagraph,
  Conditions,
  ConditionsByGender,
  ConditionsByResidence,
  CropsByHarvest,
  CropsByProduction,
  CropsAreaVsValue,
  Poverty,
  PovertyByGender,
  PovertyByResidence,
  RainfallBars
];

export default connect(state => ({
  attrs: state.attrs,
  data: state.profile.data,
  focus: state.focus,
  stats: state.profile.stats
}), {})(GeoProfile);
