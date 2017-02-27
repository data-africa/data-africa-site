import React from "react";
import {fetchData} from "actions/profile";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {FORMATTERS, formatPlaceName} from "helpers/formatters";

class Conditions extends SectionColumns {

  health(profile, health) {
    const first = health && health.length > 0 ? health[0] : null;
    const place = formatPlaceName(first, "health", profile.level);
    const items = health.map(
      (row, idx) => `${idx === health.length - 1 ? "and " : ""}${FORMATTERS.shareWhole(row.proportion_of_children)} are severely ${row.condition}`);
    if (first) {
      return <p>Among children in {place}, {items.join(", ")}.</p>;
    }
    else {
      return <p></p>;
    }
  }

  render() {
    const {profile} = this.props;
    const {dhs_health} = this.context.data;

    return (
      <SectionColumns>
        <SectionTitle>Health Conditions Among Children</SectionTitle>
        <article>
          {this.health(profile, dhs_health)}
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
  fetchData("dhs_health", "api/join/?geo=<id>&show=year,condition&required=dhs_geo_name,dhs_geo_parent_name,proportion_of_children&order=proportion_of_children&sort=desc&severity=severe&sumlevel=latest_by_geo,all")
];

export default Conditions;
