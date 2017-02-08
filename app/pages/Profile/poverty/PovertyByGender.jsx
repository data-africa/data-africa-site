import React, {Component} from "react";
import {connect} from "react-redux";
import {dataFold} from "d3plus-viz";
import {titleCase} from "d3plus-text";

import Viz from "../../../canon/Viz.jsx";
import "../../../canon/Topic.css";

import {API} from "../../../../.env";
import {DICTIONARY} from "../../../helpers/dictionary";
import {FORMATTERS} from "../../../helpers/formatters";

class Topic extends Component {

  render() {
    const {id} = this.props;
    const povertyLevel = this.props.povertyLevel;
    return (
      <div className="topic">
        <h3>Poverty Measures by Gender {DICTIONARY[povertyLevel]}</h3>
        <Viz type="BarChart" config={{
          data: `${API}api/join/?show=year,gender&geo=${id}&required=poverty_level,hc,povgap,sevpov&sumlevel=latest_by_geo,all&poverty_level=${povertyLevel}`,
          discrete: "y",
          groupBy: ["gender", "poverty_level"],
          label: d => `${titleCase(d.gender)} ${DICTIONARY[d.measure]}`,
          legend: false,
          shapeConfig: {
            fill: "rgb(61, 71, 55)"
          },
          x: "value",
          xConfig: {
            domain: [0, 1],
            tickFormat: FORMATTERS.shareWhole,
            title: "Proportion of Poverty"
          },
          y: "measure",
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
            year: d.year,
            gender: d.gender
          });
          arr.push({
            geo: d.geo,
            measure: "povgap",
            poverty_geo: d.poverty_geo,
            poverty_level: d.poverty_level,
            value: d.povgap,
            year: d.year,
            gender: d.gender
          });
          arr.push({
            geo: d.geo,
            measure: "sevpov",
            poverty_geo: d.poverty_geo,
            poverty_level: d.poverty_level,
            value: d.sevpov,
            year: d.year,
            gender: d.gender
          });
          return arr;
        }, [])} />
      </div>
    );
  }
}

export default connect(() => ({}), {})(Topic);
