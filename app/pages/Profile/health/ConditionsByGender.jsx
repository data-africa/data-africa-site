import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {COLORS_GENDER} from "helpers/colors";
import {FORMATTERS} from "helpers/formatters";

class ConditionsByGender extends SectionColumns {

  render() {
    const {profile} = this.props;
    return (
      <SectionColumns>
        <SectionTitle>Severity by Gender</SectionTitle>
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
          stackOrder: series => {
            const order = ["male_severe", "male_moderate", "female_severe", "female_moderate"];
            return series.map(s => order.indexOf(s.key));
          },
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

export default ConditionsByGender;
