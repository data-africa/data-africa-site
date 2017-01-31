import React, {Component} from "react";
import {connect} from "react-redux";
import {titleCase} from "d3plus-text";

import Viz from "../../../canon/Viz.jsx";
import "../../../canon/Topic.css";

import {API} from "../../../../.env";

class Topic extends Component {

  render() {
    const {id} = this.props;
    return (
      <div className="topic">
        <h3>Health Condition Severity</h3>
        <Viz type="BarChart" config={{
          data: `${API}api/join/?show=condition&geo=${ id }&required=condition,severity,proportion_of_children`,
          discrete: "y",
          groupBy: "severity",
          label: d => `${titleCase(d.severity)} ${titleCase(d.condition)}`,
          legend: false,
          shapeConfig: {
            fill: d => d.severity === "severe" ? "rgb(120, 0, 0)" : d.severity === "moderate" ? "yellow" : "#ccc",
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
            title: "Proportion of Children"
          },
          y: "condition",
          yConfig: {
            title: "Condition"
          }
        }} />
      </div>
    );
  }
}

export default connect(() => ({}), {})(Topic);
