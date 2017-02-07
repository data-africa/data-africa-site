import React, {Component} from "react";
import {connect} from "react-redux";
import {dataFold} from "d3plus-viz";

import Viz from "../../../canon/Viz.jsx";
import "../../../canon/Topic.css";

import {API} from "../../../../.env";
import {DICTIONARY} from "../../../helpers/dictionary";
import {FORMATTERS} from "../../../helpers/formatters";

class Topic extends Component {

  render() {
    const {id} = this.props;
    return (
      <div className="topic">
        <h3>Poverty Level by Measure</h3>
        <Viz type="BarChart" config={{
          data: `${API}api/join/?show=year&geo=${id}&required=poverty_level,hc,povgap,sevpov&sumlevel=latest_by_geo`,
          discrete: "y",
          groupBy: "measure",
          label: d => `${DICTIONARY[d.measure]}`,
          legend: false,
          shapeConfig: {
            fill: "rgb(61, 71, 55)",
            label: false
          },
          x: "value",
          xConfig: {
            domain: [0, 1],
            tickFormat: FORMATTERS.shareWhole,
            title: "Proportion of Poverty"
          },
          y: "poverty_level",
          yConfig: {
            tickFormat: d => DICTIONARY[d],
            title: "Poverty Level"
          }
        }} dataFormat={d => dataFold(d).reduce((arr, d) => {
          arr.push({
            geo: d.geo,
            measure: "hc",
            poverty_geo: d.poverty_geo,
            poverty_level: d.poverty_level,
            value: d.hc,
            year: d.year
          });
          arr.push({
            geo: d.geo,
            measure: "povgap",
            poverty_geo: d.poverty_geo,
            poverty_level: d.poverty_level,
            value: d.povgap,
            year: d.year
          });
          arr.push({
            geo: d.geo,
            measure: "sevpov",
            poverty_geo: d.poverty_geo,
            poverty_level: d.poverty_level,
            value: d.sevpov,
            year: d.year
          });
          return arr;
        }, [])} />
      </div>
    );
  }
}

export default connect(() => ({}), {})(Topic);
