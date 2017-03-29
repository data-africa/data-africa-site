import React from "react";
import {fetchData} from "actions/profile";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionRows, SectionTitle} from "datawheel-canon";
import {childHealth} from "pages/Profile/health/shared";

import {API} from ".env";
import {COLORS_CONDITION} from "helpers/colors";
import {FORMATTERS} from "helpers/formatters";
import {formatPlaceName} from "helpers/formatters";

class Conditions extends SectionRows {

  render() {
    const {profile} = this.props;
    const {dhsHealth} = this.context.data;

    return (
      <SectionRows>
        <SectionTitle>Health Conditions Among Children</SectionTitle>
        <article className="section-text">
          {childHealth(profile, dhsHealth)}
        </article>
        <BarChart config={{
          data: `${API}api/join/?show=condition&geo=${ profile.id }&required=dhs_geo_name,dhs_geo_parent_name,condition,severity,proportion_of_children`,
          groupBy: ["condition", "severity"],
          groupPadding: 64,
          label: d => d.condition instanceof Array ? titleCase(d.severity) : `${titleCase(d.severity)}ly ${titleCase(d.condition)}`,
          shapeConfig: {
            fill: d => COLORS_CONDITION[d.condition],
            label: false,
            opacity: d => d.severity === "severe" ? 1 : 0.4
          },
          stacked: true,
          stackOrder: series => {
            const order = ["wasted_severe", "stunted_severe", "underweight_severe", "wasted_moderate", "stunted_moderate", "underweight_moderate"];
            return series.map(s => order.indexOf(s.key)).reverse();
          },
          tooltipConfig: {
            body: d => `Based on data from ${formatPlaceName(d, "health", profile.level)} in ${d.year}`
          },
          x: "year",
          xConfig: {
            gridConfig: {"stroke-width": 0},
            title: "Condition Over Time"
          },
          y: "proportion_of_children",
          yConfig: {
            domain: [0, 1],
            tickFormat: FORMATTERS.shareWhole,
            title: "Proportion of Children"
          }
        }} />
      </SectionRows>
    );
  }
}

Conditions.need = [
  fetchData("dhsHealth", "api/join/?geo=<id>&show=year,condition&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&order=proportion_of_children&sort=desc&severity=severe&sumlevel=latest_by_geo,all")
];

export default Conditions;
