import React from "react";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {COLORS_RESIDENCE} from "helpers/colors";
import {FORMATTERS} from "helpers/formatters";

class ConditionsByResidence extends SectionColumns {

  render() {
    const {profile} = this.props;
    return (
      <SectionColumns>
        <SectionTitle>Severity by Residence</SectionTitle>
        <BarChart config={{
          data: `${API}api/join/?show=condition,residence&geo=${ profile.id }&required=condition,severity,proportion_of_children`,
          discrete: "y",
          groupBy: ["residence", "severity"],
          groupPadding: 32,
          label: d => d.condition instanceof Array ? titleCase(d.residence) : `${titleCase(d.severity)}ly ${titleCase(d.condition)} Children in ${titleCase(d.residence)} Areas`,
          shapeConfig: {
            fill: d => COLORS_RESIDENCE[d.residence],
            label: false,
            opacity: d => d.severity === "severe" ? 1 : 0.4
          },
          stacked: true,
          stackOrder: series => {
            const order = ["urban_severe", "urban_moderate", "rural_severe", "rural_moderate"];
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

export default ConditionsByResidence;
