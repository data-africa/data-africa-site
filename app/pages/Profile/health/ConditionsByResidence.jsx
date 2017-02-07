import React, {Component} from "react";
import {connect} from "react-redux";
import {titleCase} from "d3plus-text";

import Viz from "../../../canon/Viz.jsx";
import "../../../canon/Topic.css";

import {API} from "../../../../.env";
import {FORMATTERS} from "../../../helpers/formatters";

class Topic extends Component {

  render() {
    const {id} = this.props;
    return (
      <div className="topic">
        <h3>Health Condition Severity by Residence</h3>
        <Viz type="BarChart" config={{
          data: `${API}api/join/?show=condition,residence&geo=${ id }&required=condition,severity,proportion_of_children`,
          discrete: "y",
          groupBy: ["residence", "severity"],
          label: d => `${titleCase(d.severity)}ly ${titleCase(d.condition)} Children in ${titleCase(d.residence)} Areas`,
          legend: false,
          shapeConfig: {
            fill: d => d.severity === "severe" ? "rgb(120, 0, 0)" : d.severity === "moderate" ? "#EDCB62" : "#ccc",
            label: false
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

export default connect(() => ({}), {})(Topic);
