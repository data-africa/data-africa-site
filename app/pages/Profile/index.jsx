import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchStats, fetchVars} from "../../actions/profile";
import "./intro.css";
import "./sections.css";

import {strip} from "d3plus-text";

import "../../canon/Section.css";
import Stat from "../../canon/Stat";
import Viz from "../../canon/Viz.jsx";

import CropsAreaVsValue from "./agriculture/CropsAreaVsValue";
import CropsByHarvest from "./agriculture/CropsByHarvest";
import CropsByProduction from "./agriculture/CropsByProduction";

import RainfallBars from "./climate/RainfallBars";

import Conditions from "./health/Conditions";
import ConditionsByGender from "./health/ConditionsByGender";

import Poverty from "./poverty/Poverty";

const sections = [
  {
    title: "Agriculture",
    topics: [
      CropsByHarvest,
      CropsByProduction,
      CropsAreaVsValue
    ]
  },
  {
    title: "Climate",
    topics: [
      RainfallBars
    ]
  },
  {
    title: "Health",
    topics: [
      Conditions,
      ConditionsByGender
    ]
  },
  {
    title: "Poverty",
    topics: [
      Poverty
    ]
  }
];

sections.forEach(s => {
  s.slug = strip(s.title).toLowerCase();
});

class Profile extends Component {

  render() {

    const {id} = this.props.params;
    const {attrs, focus, stats} = this.props;
    const geos = attrs.geo.reduce((obj, d) => (obj[d.id] = d, obj), {});
    const attr = geos[id];
    const focusISO = focus.map(f => geos[f].iso3);

    return (
      <div className="profile">

        <div className="intro">

          <div className="splash" style={{backgroundImage: `url('/images/geo/${id}.jpg')`}}>
            <div className="gradient"></div>
          </div>

          <div className="header">
            <Viz type="Geomap" config={{
              ocean: "transparent",
              padding: 0,
              shapeConfig: {Path: {
                fill: d => d.properties.iso_a3 === attr.iso3 ? "white" : focusISO.includes(d.properties.iso_a3) ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.1)",
                stroke: "rgba(255, 255, 255, 0.25)"
              }},
              tiles: false,
              topojson: "/topojson/continent.json",
              topojsonKey: "collection",
              zoom: false
            }} />
            <div className="meta">
              <div className="title">{ attr.name }</div>
              { stats.map(stat => <Stat key={ stat.key } label={ stat.label } value={ stat.attr ? attrs[stat.attr].find(d => d.id === stat.value).name : stat.value } />) }
            </div>
          </div>
          <div className="subnav">
            { sections.map(s =>
              <a className="sublink" href={ `#${s.slug}` } key={ s.slug }>
                <img className="icon" src={ `/images/sections/${s.slug}.svg` } />
                { s.title }
              </a>) }
          </div>
        </div>

        <div className="sections">

          {
            sections.map(s => <div className="section" key={ s.slug }>
              <h2><a name={ s.slug } href={ `#${ s.slug }`}>{ s.title }</a></h2>
              { s.topics.map((Comp, i) => <Comp id={ id } profile={ attr } key={ i } />)}
            </div>)
          }

        </div>

      </div>
    );
  }
}

Profile.need = [
  fetchStats,
  fetchVars
];

export default connect(state => ({
  attrs: state.attrs,
  focus: state.focus,
  stats: state.profile.stats
}), {})(Profile);
