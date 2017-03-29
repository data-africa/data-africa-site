import React from "react";
import {connect} from "react-redux";
import {fetchStats} from "actions/profile";
import {Profile, TopicTitle} from "datawheel-canon";
import d3plus from "helpers/d3plus";
import "./intro.css";
import "./topics.css";
import "./sections.css";
import Nav from "components/Nav";

import {Geomap} from "d3plus-react";
import IntroParagraph from "./splash/IntroParagraph";

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

const topics = [
  {
    slug: "introduction",
    title: "Introduction"
  },
  {
    slug: "agriculture",
    title: "Agriculture"
  },
  {
    slug: "climate",
    title: "Climate"
  },
  {
    slug: "health",
    title: "Health"
  },
  {
    slug: "poverty",
    title: "Poverty"
  }
];

class GeoProfile extends Profile {

  constructor() {
    super();
    this.state = {
      activeSub: false,
      subnav: false
    };
  }

  componentDidMount() {
    const {id} = this.props.params;
    const {attrs} = this.props;
    const attr = attrs.geo[id];
    const data = [attr];
    if (attr.level !== "adm0") data.unshift(attrs.geo[`040${id.slice(3, 10)}`]);
    this.props.dispatch({type: "UPDATE_BREADCRUMB", data});
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const {activeSub, subnav} = this.state;
    const newSub = this.refs.sublinks.getBoundingClientRect().top <= 0;
    let newActive = false;
    for (let i = 0; i < topics.length; i++) {
      const top = document.getElementById(topics[i].slug).getBoundingClientRect().top;
      if (top <= 0) newActive = topics[i].slug;
    }
    if (subnav !== newSub || newActive !== activeSub) {
      this.setState({activeSub: newActive, subnav: newSub});
    }
  }

  urlPath(attr) {
    const adm0 = String(`00000${attr.adm0_id}`).slice(-5);
    const targetId = `040AF${adm0}`;
    return `url('/images/geo/${targetId}.jpg')`;
  }

  render() {

    const {id} = this.props.params;
    const {attrs, focus, stats} = this.props;
    const {activeSub, subnav} = this.state;

    const attr = attrs.geo[id];

    const focusISO = focus.map(f => attrs.geo[f].iso3);
    const isAdm0 = attr.level === "adm0";
    const adm0 = id.slice(5, 10);

    const fill = isAdm0
               ? d => d.feature.properties.iso_a3 === attr.iso3 ? "white" : focusISO.includes(d.feature.properties.iso_a3) ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.1)"
               : d => d.feature.properties.geo === id ? "white" : focusISO.includes(d.feature.properties.iso_a3) ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.1)";
    const topoFilt = isAdm0 ? d => d : d => adm0 === d.properties.geo.slice(5, 10);
    const topoPath = isAdm0 ? "/topojson/continent.json" : "/topojson/cell5m/adm1.json";

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
              {
                stats.filter(stat => stat).map(stat => {
                  let label = stat.label;
                  const word = label.includes("from") ? "from" : "in";
                  const re = new RegExp(`${word}[A-z0-9\\s]*`, "g");
                  const phrase = label.match(re)[0];
                  label = label.replace(phrase, "");
                  return (
                    <div className="stat">
                      <div className="label">
                        { label }
                        <span className="time">{ phrase }</span>
                      </div>
                      <div className="value">{ stat.attr ? attrs[stat.attr][stat.value].name : stat.value }</div>
                    </div>
                  );
                })
              }
            </div>
          </div>

          <div ref="sublinks" className="sublinks">
            {
              topics.map(topic =>
                <a key={ topic.slug } className="sublink" href={ `#${topic.slug}` }>
                  <img className="icon" src={ `/images/topics/${topic.slug}.svg` } />
                  { topic.title }
                </a>
              )
            }
          </div>

          <IntroParagraph profile={attr} />

        </div>

        <Nav visible={ subnav }>
          {
            topics.map(topic =>
              <a key={ topic.slug } className={activeSub === topic.slug ? "subnav-link active" : "subnav-link"} href={ `#${topic.slug}` }>
                { topic.title }
              </a>
            )
          }
        </Nav>
        <div className="section-container">
          <TopicTitle slug="agriculture">
            <div className="icon" style={{backgroundImage: "url('/images/topics/agriculture.svg')"}}></div>
            Agriculture
          </TopicTitle>
          <CropsByHarvest profile={attr} />
          <CropsByProduction profile={attr} />
          <CropsAreaVsValue profile={attr} />
          <CropsBySupply profile={attr} />

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
  focus: state.focus,
  stats: state.profile.stats
}))(GeoProfile);
