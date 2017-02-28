import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {COLORS_GENDER} from "helpers/colors";
import {FORMATTERS} from "helpers/formatters";
import {fetchData} from "actions/profile";
import {childHealthByMode} from "pages/Profile/health/shared";

class ConditionsByGender extends SectionColumns {

  render() {
    const {profile} = this.props;
    const {healthByGender} = this.context.data;

    return (
      <SectionColumns>
        <SectionTitle>Health Conditions Among Children by Gender</SectionTitle>
        <article>
          {childHealthByMode(profile, healthByGender, "gender")}
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
