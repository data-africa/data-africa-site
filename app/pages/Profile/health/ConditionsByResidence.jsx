import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {COLORS_RESIDENCE} from "helpers/colors";
import {yearControls} from "helpers/d3plus";
import {FORMATTERS} from "helpers/formatters";
import {childHealthByMode} from "pages/Profile/health/shared";
import {fetchData} from "actions/profile";

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
            fill: d => COLORS_RESIDENCE[d.residence],
            label: false,
            opacity: d => d.severity === "severe" ? 1 : 0.4
          },
          stacked: true,
          stackOrder: ["urban_severe", "urban_moderate", "rural_severe", "rural_moderate"],
          time: "year",
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
