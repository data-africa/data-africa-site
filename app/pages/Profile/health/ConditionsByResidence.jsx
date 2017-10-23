import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {COLORS_RESIDENCE} from "helpers/colors";
import {tooltipBody, yearControls} from "helpers/d3plus";
import {formatPlaceName, FORMATTERS} from "helpers/formatters";
import {childHealthByMode} from "pages/Profile/health/shared";
import {fetchData} from "datawheel-canon";

class ConditionsByResidence extends SectionColumns {

  render() {
    const {profile} = this.props;
    const {healthByResidence} = this.context.data;

    return (
      <SectionColumns>
        <article className="section-text">
        <SectionTitle>Health Conditions Among Children by Residence</SectionTitle>
          {childHealthByMode(profile, healthByResidence, "residence")}
        </article>
        <BarChart config={{
          controls: yearControls(healthByResidence),
          data: healthByResidence,
          discrete: "y",
          groupBy: ["residence", "severity"],
          groupPadding: 32,
          label: d => d.condition instanceof Array ? `${titleCase(d.severity)} ${titleCase(d.residence)}` : `${titleCase(d.severity)}ly ${titleCase(d.condition)} Children in ${titleCase(d.residence)} Areas`,
          shapeConfig: {
            fill: d => COLORS_RESIDENCE[`${d.residence}_${d.severity}`],
            hoverOpacity: 0.25,
            label: false
          },
          stacked: true,
          stackOrder: ["urban_severe", "urban_moderate", "rural_severe", "rural_moderate"],
          time: "year",
          tooltipConfig: {
            body: d => `${ d.dhs_geo_name !== profile.name ? `<span class="d3plus-body-sub">Based on data from ${formatPlaceName(d, "health", profile.level)}</span>` : "" }${tooltipBody.bind(["year", "proportion_of_children"])(d)}`
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

ConditionsByResidence.need = [
  fetchData("healthByResidence", "api/join/?geo=<id>&show=year,condition,residence&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&sumlevel=all,all,all")
];

export default ConditionsByResidence;
