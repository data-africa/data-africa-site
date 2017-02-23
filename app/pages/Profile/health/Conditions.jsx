import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {FORMATTERS} from "helpers/formatters";

class Conditions extends SectionColumns {

  render() {
    const {profile} = this.props;
    return (
      <SectionColumns>
        <SectionTitle>Health Condition Severity</SectionTitle>
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

export default Conditions;
