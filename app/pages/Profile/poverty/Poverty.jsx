import React from "react";
import {connect} from "react-redux";
import {dataFold} from "d3plus-viz";

import {BarChart} from "d3plus-react";
import Topic from "src/components/Topic";

import {API} from ".env";
import {DICTIONARY} from "helpers/dictionary";
import {FORMATTERS} from "helpers/formatters";

class Poverty extends Topic {

  render() {
    const {profile} = this.props;
    return (
      <div className="topic">
        <h3>Poverty Level by Measure</h3>
        <BarChart config={{
          data: `${API}api/join/?show=year&geo=${profile.id}&required=poverty_level,hc,povgap,sevpov&sumlevel=latest_by_geo`,
          discrete: "y",
          groupBy: "measure",
          label: d => `${DICTIONARY[d.measure]}`,
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

export default connect(() => ({}), {})(Poverty);
