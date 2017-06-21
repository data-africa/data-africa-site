import React from "react";
import {Link} from "react-router";

import {Section} from "datawheel-canon";

import {fetchData} from "datawheel-canon";
import {childHealth} from "pages/Profile/health/shared";
import {povertyContent} from "pages/Profile/poverty/shared";
import {Geomap} from "d3plus-react";
import {selectAll} from "d3-selection";
import {browserHistory} from "react-router";
import {connect} from "react-redux";

import {VARIABLES, FORMATTERS} from "helpers/formatters";

class IntroParagraph extends Section {

  population(profile, popData) {
    const recentPop = popData[0];
    const hasMultipleYears = popData.length > 1;
    const oldPop = hasMultipleYears ? popData[popData.length - 1] : {};
    const growth = hasMultipleYears ? (recentPop.totpop - oldPop.totpop) / oldPop.totpop : 0;
    const direction = growth > 0 ? "increase" : "decrease";
    const growthSentence = hasMultipleYears ? ` This represents a ${FORMATTERS.shareWhole(growth)}
      ${direction} from ${oldPop.year} when the population of ${profile.name}
      was approximately ${VARIABLES.totpop(oldPop.totpop)}.` : "";

    const country = "country located in Africa south of the Sahara";
    const parentId = `040${profile.id.slice(3, 10)}`;
    const province = <span>province of <Link className="link" to={`/profile/${parentId}`}>{profile.parent_name}</Link></span>;
    const entity = profile.level === "adm0" ? country : province;
    if (!recentPop) {
      return <p></p>;
    }
    return <p>{profile.name} is a {entity}.
    As of {recentPop.year} {profile.name} had a total population of approximately {VARIABLES.totpop(recentPop.totpop)} people.
    {growthSentence}
    </p>;
  }

  crops(profile, crops) {
    const top = crops[0];
    return <p>The most widely harvested crop in {profile.name} by area was {top.crop_name} with {VARIABLES.harvested_area(top.harvested_area)} harvested with a total production value of {VARIABLES.value_of_production(top.value_of_production)}.</p>;
  }

  internalMap(profile) {
    const {attrs} = this.props;
    const adm0 = profile.id.slice(5, 10);
    const splashData = [];
    for (const key in attrs.geo) {
      if (key.slice(5, 10) === adm0) {
        const obj = attrs.geo[key];
        splashData.push(obj);
      }
    }
    return <Geomap config={{
      data: splashData,
      downloadButton: false,
      groupBy: "id",
      height: 400,
      label: d => d.name,
      legend: false,
      ocean: "transparent",
      on: {
        "click.shape": d => {
          if (d && d.id !== profile.id) {
            selectAll(".d3plus-tooltip").remove();
            browserHistory.push(`/profile/${d.url_name}`);
          }
        }
      },
      padding: 0,
      shapeConfig: {
        hoverOpacity: 1,
        Path: {
          fill: d => profile.iso3.includes(d.feature.properties.iso_a3) ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.1)",
          stroke: "rgba(255, 255, 255, 0.25)"
        }
      },
      tiles: false,
      tooltipConfig: {
        body: "",
        footer: "",
        footerStyle: {
          "margin-top": 0
        },
        padding: "12px",
        title: d => {
          while (d.data) d = d.data;
          return `${d.name}${ d.id === profile.id ? "" : "<img class='link-arrow' src='/images/nav/link-arrow.svg' />" }`;
        }
      },
      topojson: "/topojson/cell5m/adm1.json",
      topojsonFilter: d => adm0 === d.properties.geo.slice(5, 10),
      topojsonId: d => d.properties.geo,
      topojsonKey: "collection",
      zoom: false
    }} />;
  }

  render() {
    const {profile} = this.props;
    const {popData, crops, dhsHealth, povertyData} = this.context.data;
    return (
      <div id="introduction">
        {this.population(profile, popData)}
        {this.crops(profile, crops)}
        {childHealth(profile, dhsHealth, true)}
        {povertyContent(profile, povertyData)}
        {profile.level === "adm0" ? this.internalMap(profile) : null}
      </div>
    );
  }
}

IntroParagraph.need = [
  fetchData("povertyData", "api/join/?geo=<geoid>&show=year,poverty_level&sumlevel=latest_by_geo,all&required=num,poverty_geo_name,poverty_geo_parent_name&limit=2"),
  fetchData("dhsHealth", "api/join/?geo=<geoid>&show=year,condition&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&order=proportion_of_children&sort=desc&severity=severe&sumlevel=latest_by_geo,all"),
  fetchData("crops", "api/join/?geo=<geoid>&show=crop&required=harvested_area,value_of_production&display_names=true&order=harvested_area&sort=desc&year=latest"),
  fetchData("popData", "api/join/?geo=<geoid>&show=year&required=totpop&sumlevel=all&order=year&sort=desc&display_names=true")
];

export default connect(state => ({
  attrs: state.attrs
}))(IntroParagraph);
