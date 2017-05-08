import React from "react";
import {Link} from "react-router";

import {Section} from "datawheel-canon";

import {fetchData} from "datawheel-canon";
import {childHealth} from "pages/Profile/health/shared";
import {povertyContent} from "pages/Profile/poverty/shared";

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

    const country = "country located in Sub-Saharan Africa";
    const parentId = `040${profile.id.slice(3, 10)}`;
    const province = <span>province in <Link className="link" to={`/profile/${parentId}`}>{profile.parent_name}</Link></span>;
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
    return <p>The most widely harvested crop in {profile.name} by area was {top.crop_name} with {VARIABLES.harvested_area(top.harvested_area)} harvested for a total production value of {VARIABLES.value_of_production(top.value_of_production)}.</p>;
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
      </div>
    );
  }
}

IntroParagraph.need = [
  fetchData("povertyData", "api/join/?geo=<id>&show=year,poverty_level&sumlevel=latest_by_geo,all&required=num,poverty_geo_name,poverty_geo_parent_name&limit=2"),
  fetchData("dhsHealth", "api/join/?geo=<id>&show=year,condition&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&order=proportion_of_children&sort=desc&severity=severe&sumlevel=latest_by_geo,all"),
  fetchData("crops", "api/join/?geo=<id>&show=crop&required=harvested_area,value_of_production&display_names=true&order=harvested_area&sort=desc&year=latest"),
  fetchData("popData", "api/join/?geo=<id>&show=year&required=totpop&sumlevel=all&order=year&sort=desc&display_names=true")
];

export default IntroParagraph;
