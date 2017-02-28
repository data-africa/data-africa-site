import React from "react";
import {fetchData} from "actions/profile";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";
import {childHealth} from "pages/Profile/health/shared";
import {FORMATTERS} from "helpers/formatters";

import {API} from ".env";

class Conditions extends SectionColumns {

  render() {
    const {profile} = this.props;
    const {dhsHealth} = this.context.data;

    return (
      <SectionColumns>
        <SectionTitle>Health Conditions Among Children</SectionTitle>
        <article>
          {childHealth(profile, dhsHealth)}
        </article>
        <BarChart config={{
          data: `${API}api/join/?show=condition&geo=${ profile.id }&required=condition,severity,proportion_of_children`,
          discrete: "y",
          groupBy: "severity",
          label: d => d.condition instanceof Array ? titleCase(d.severity) : `${titleCase(d.severity)}ly ${titleCase(d.condition)}`,
          shapeConfig: {
            fill: d => d.severity === "severe" ? "rgb(120, 0, 0)" : d.severity === "moderate" ? "#EDCB62" : "#ccc"
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
            tickFormat: d => titleCase(d),
            title: "Condition"
          }
        }} />
    </SectionColumns>
    );
  }
}

Conditions.need = [
  fetchData("dhsHealth", "api/join/?geo=<id>&show=year,condition&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&order=proportion_of_children&sort=desc&severity=severe&sumlevel=latest_by_geo,all")
];

export default Conditions;
