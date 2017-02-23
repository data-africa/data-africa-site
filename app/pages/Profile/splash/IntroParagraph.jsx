import React, {Component} from "react";
import {connect} from "react-redux";

import {Section} from "datawheel-canon";

import {fetchData} from "actions/profile";

import {VARIABLES, FORMATTERS} from "helpers/formatters";
import {DICTIONARY} from "helpers/dictionary";

class IntroParagraph extends Component {

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
    const province = `province in ${profile.parent_name}`;
    const entity = profile.level === "adm0" ? country : province;

    return <p>{profile.name} is a {entity}.
    As of {recentPop.year} {profile.name} had a total population of approximately {VARIABLES.totpop(recentPop.totpop)} people.
    {growthSentence}
    </p>;
  }

  crops(profile, crops) {
    const top = crops[0];
    return <p>The most widely harvested crop in {profile.name} by area was {top.crop_name} with {VARIABLES.harvested_area(top.harvested_area)} harvested for a total production value of {VARIABLES.value_of_production(top.value_of_production)}.</p>;
  }

  health(profile, health) {
    const items = health.map((row, idx) => `${idx === health.length - 1 ? "and " : ""}${FORMATTERS.shareWhole(row.proportion_of_children)} ${idx === 0 ? "of children are classified as" : "are"} severely ${row.condition}`);
    return <p>In terms of health conditions afflicting children in {profile.name}: {items.join(", ")}.</p>;
  }

  poverty(profile, poverty) {
    const first = poverty && poverty.length > 0 ? poverty[0] : null;
    const items = poverty.map(row => `${VARIABLES.totpop(row.num)} people living below ${DICTIONARY[row.poverty_level]}`);
    return <p>As of {first.year}, in {profile.name} there were {items.join(" and ")}.</p>;
  }

  render() {
    const {profile, popData, crops, health, poverty} = this.props;
    return (
      <Section>
        <article>
          {this.population(profile, popData)}
          {this.crops(profile, crops)}
          {this.health(profile, health)}
          {this.poverty(profile, poverty)}
        </article>
      </Section>
    );
  }
}

IntroParagraph.need = [
  fetchData("poverty", "api/join/?geo=<id>&show=year,poverty_level&sumlevel=latest_by_geo,all&required=num"),
  fetchData("health", "api/join/?geo=<id>&show=year,condition&required=proportion_of_children&display_names=true&order=proportion_of_children&sort=desc&severity=severe&sumlevel=latest_by_geo,all"),
  fetchData("crops", "api/join/?geo=<id>&show=crop&required=harvested_area,value_of_production&display_names=true&order=harvested_area&sort=desc&year=latest"),
  fetchData("popData", "api/join/?geo=<id>&show=year&required=totpop&sumlevel=all&order=year&sort=desc&display_names=true")
];

export default connect(state => ({
  crops: state.profile.data.crops,
  health: state.profile.data.health,
  popData: state.profile.data.popData,
  poverty: state.profile.data.poverty
}), {})(IntroParagraph);
