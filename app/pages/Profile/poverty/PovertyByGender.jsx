import React, {Component} from "react";
import {connect} from "react-redux";
import {dataFold} from "d3plus-viz";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import Section from "src/components/Section";

import {API} from ".env";
import {DICTIONARY} from "helpers/dictionary";
import {FORMATTERS} from "helpers/formatters";

class PovertyByGender extends Component {

  render() {
    const {profile} = this.props;
    const povertyLevel = this.props.povertyLevel;
    return (
      <Section title={ `Poverty Measures by Gender ${ DICTIONARY[povertyLevel] }` }>
        <BarChart config={{
          data: `${API}api/join/?show=year,gender&geo=${profile.id}&required=poverty_level,hc,povgap,sevpov&sumlevel=latest_by_geo,all&poverty_level=${povertyLevel}`,
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
        }}
        dataFormat={d => dataFold(d).reduce((arr, d) => {
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
    </Section>
    );
  }
}

export default connect(() => ({}), {})(PovertyByGender);
