import React from "react";
import {connect} from "react-redux";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import Topic from "canon/components/Topic";

import {API} from ".env";
import {FORMATTERS} from "helpers/formatters";

class ConditionsByResidence extends Topic {

  render() {
    const {profile} = this.props;
    return (
      <div className="topic">
        <h3>Health Condition Severity by Residence</h3>
        <BarChart config={{
          data: `${API}api/join/?show=condition,residence&geo=${ profile.id }&required=condition,severity,proportion_of_children`,
          discrete: "y",
          groupBy: ["residence", "severity"],
          label: d => d.condition instanceof Array ? titleCase(d.severity) : `${titleCase(d.severity)}ly ${titleCase(d.condition)} Children in ${titleCase(d.residence)} Areas`,
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
      </div>
    );
  }
}

export default connect(() => ({}), {})(ConditionsByResidence);
