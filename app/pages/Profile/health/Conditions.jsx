import React from "react";
import {fetchData} from "datawheel-canon";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";
import {childHealth} from "pages/Profile/health/shared";

import {API} from "helpers/consts.js";
import {COLORS_CONDITION} from "helpers/colors";
import {tooltipBody} from "helpers/d3plus";
import {formatPlaceName, FORMATTERS} from "helpers/formatters";

class Conditions extends SectionColumns {

  render() {
    const {embed, profile} = this.props;
    const {dhsHealth} = this.context.data;

    return (
      <SectionColumns>
        <article className="section-text">
        <SectionTitle>Health Conditions Among Children</SectionTitle>
          {childHealth(profile, dhsHealth)}
        </article>
        <BarChart config={{
          data: `${API}api/join/?show=condition&geo=${ profile.id }&required=dhs_geo_name,dhs_geo_parent_name,condition,severity,proportion_of_children`,
          groupBy: ["condition", "severity"],
          groupPadding: 64,
          height: embed ? undefined : 500,
          label: d => d.condition instanceof Array ? titleCase(d.severity) : `${titleCase(d.severity)}ly ${titleCase(d.condition)}`,
          shapeConfig: {
            fill: d => COLORS_CONDITION[`${d.condition}_${d.severity}`],
            hoverOpacity: 0.25,
            label: false
          },
          stacked: true,
          stackOrder: ["wasted_severe", "wasted_moderate", "stunted_severe", "stunted_moderate", "underweight_severe", "underweight_moderate"],
          tooltipConfig: {
            body: d => `${ d.dhs_geo_name !== profile.name ? `<span class="d3plus-body-sub">Based on data from ${formatPlaceName(d, "health", profile.level)}</span>` : "" }${tooltipBody.bind(["year", "proportion_of_children"])(d)}`
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
      </SectionColumns>
    );
  }
}

Conditions.need = [
  fetchData("dhsHealth", "api/join/?geo=<geoid>&show=year,condition&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&order=proportion_of_children&sort=desc&severity=severe&sumlevel=latest_by_geo,all")
];

export default Conditions;
