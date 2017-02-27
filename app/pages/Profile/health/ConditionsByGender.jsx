import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {COLORS_GENDER} from "helpers/colors";
import {FORMATTERS, formatPlaceName} from "helpers/formatters";
import {fetchData} from "actions/profile";

class ConditionsByGender extends SectionColumns {
  healthByGender(profile, healthData) {
    if (!healthData || healthData.length === 0) {
      return <p>No Data</p>;
    }
    else {
      const first = healthData[0];
      const maleData = healthData.filter(x => x.gender === "male" && x.severity === "severe");
      const femaleData = healthData.filter(x => x.gender === "female" && x.severity === "severe");
      const mostSevereSort = (a, b) => b.proportion_of_children - a.proportion_of_children;
      maleData.sort(mostSevereSort);
      femaleData.sort(mostSevereSort);
      const sevMaleCond = maleData[0];
      const sevFemaleCond = femaleData[0];
      const areSame = sevFemaleCond.condition === sevMaleCond.condition;
      const place = formatPlaceName(first, "health", profile.level);

      if (areSame) {
        return <p>The most severe health condition afflicting male and
        female children in {place} is severely {sevMaleCond.condition} children with {FORMATTERS.shareWhole(sevMaleCond.proportion_of_children)} of male children affected
        and {FORMATTERS.shareWhole(sevFemaleCond.proportion_of_children)} of female children affected.</p>;
      }
      else {
        return <p>TODO!</p>;
      }
    }
  }

  render() {
    const {profile} = this.props;
    const {healthByGender} = this.context.data;

    return (
      <SectionColumns>
        <SectionTitle>Health Conditions Among Children by Gender</SectionTitle>
        <article>
          {this.healthByGender(profile, healthByGender)}
        </article>
        <BarChart config={{
          data: `${API}api/join/?show=condition,gender&geo=${ profile.id }&required=condition,severity,proportion_of_children`,
          discrete: "y",
          groupBy: ["gender", "severity"],
          label: d => d.condition instanceof Array ? titleCase(d.gender) : `${titleCase(d.severity)}ly ${titleCase(d.condition)} ${titleCase(d.gender)}s`,
          shapeConfig: {
            fill: d => COLORS_GENDER[d.gender],
            label: false,
            opacity: d => d.severity === "severe" ? 1 : 0.4
          },
          stacked: true,
          time: "year",
          timelineConfig: {
            brushing: false
          },
          x: "proportion_of_children",
          xConfig: {
            domain: [0, 1],
            tickFormat: FORMATTERS.shareWhole,
            title: "Proportion of Children"
          },
          y: "condition",
          yConfig: {
            gridSize: 0,
            tickFormat: d => titleCase(d),
            title: "Condition"
          }
        }} />
    </SectionColumns>
    );
  }
}

ConditionsByGender.need = [
  fetchData("healthByGender", "api/join/?geo=<id>&show=year,condition,gender&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&severity=severe&sumlevel=latest_by_geo,all,all")
];

export default ConditionsByGender;
