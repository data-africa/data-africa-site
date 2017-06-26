import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {COLORS_RESIDENCE} from "helpers/colors";
import {tooltipBody, yearControls} from "helpers/d3plus";
import {formatPlaceName, FORMATTERS} from "helpers/formatters";
import {childHealthByMode} from "pages/Profile/health/shared";
import {fetchData} from "datawheel-canon";
import Download from "components/Download";

const url = "api/join/?geo=<geoid>&show=year,condition,residence&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&sumlevel=all,all,all";

class ConditionsByResidence extends SectionColumns {

  render() {
    const {embed, profile} = this.props;
    const {healthByResidence} = this.context.data;
    const level = healthByResidence[0].geo && healthByResidence[0].geo !== profile.geo ? "adm0" : profile.level;

    return (
      <SectionColumns>
        <article className="section-text">
        <SectionTitle>Health Conditions Among Children by Residence</SectionTitle>
          {childHealthByMode(profile, healthByResidence, "residence")}
          <Download component={ this }
            title={ `Health Conditions Among Children by Residence in ${ profile.name }` }
            url={ url.replace("<geoid>", healthByResidence[0].geo).replace("join/", "join/csv/") } />
          <div className="data-source">Data provided by <a href="http://dhsprogram.com/" target="_blank">DHS Program</a></div>
        </article>
        <BarChart ref={ comp => this.viz = comp } config={{
          controls: yearControls(healthByResidence),
          data: healthByResidence,
          discrete: "y",
          groupBy: ["residence", "severity"],
          groupPadding: 32,
          height: embed ? undefined : 500,
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
            body: d => `${ d.dhs_geo_name !== profile.name ? `<span class="d3plus-body-sub">Based on data from ${formatPlaceName(d, "health", level)}</span>` : "" }${tooltipBody.bind(["year", "proportion_of_children"])(d)}`
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
  fetchData("healthByResidence", url)
];

export default ConditionsByResidence;
