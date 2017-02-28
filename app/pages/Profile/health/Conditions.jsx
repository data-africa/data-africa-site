import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {COLORS_CONDITION} from "helpers/colors";
import {FORMATTERS} from "helpers/formatters";

class Conditions extends SectionColumns {

  render() {
    const {profile} = this.props;
    return (
      <SectionColumns>
        <SectionTitle>Severity</SectionTitle>
        <BarChart config={{
          data: `${API}api/join/?show=condition&geo=${ profile.id }&required=condition,severity,proportion_of_children`,
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
            return series.map(s => order.indexOf(s.key));
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

export default Conditions;
