import React from "react";
import {dataFold} from "d3plus-viz";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {COLORS_GENDER} from "helpers/colors";
import {DICTIONARY} from "helpers/dictionary";
import {FORMATTERS} from "helpers/formatters";

class PovertyByGender extends SectionColumns {

  render() {
    const {profile} = this.props;
    const povertyLevel = this.props.povertyLevel;
    return (
      <SectionColumns>
        <SectionTitle>{ `Poverty Measures by Gender ${ DICTIONARY[povertyLevel] }` }</SectionTitle>
        <BarChart config={{
          data: `${API}api/join/?show=year,gender&geo=${profile.id}&required=poverty_level,hc,povgap,sevpov&sumlevel=latest_by_geo,all&poverty_level=${povertyLevel}`,
          groupBy: ["gender", "poverty_level"],
          groupPadding: 100,
          label: d => d.measure instanceof Array ? titleCase(d.gender) : `${titleCase(d.gender)} ${DICTIONARY[d.measure]}`,
          shapeConfig: {
            fill: d => COLORS_GENDER[d.gender],
            label: false
          },
          x: "measure",
          xConfig: {
            tickFormat: d => DICTIONARY[d],
            title: "Poverty Measure"
          },
          y: "value",
          yConfig: {
            domain: [0, 1],
            tickFormat: FORMATTERS.shareWhole,
            title: "Proportion of Poverty"
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
    </SectionColumns>
    );
  }
}

export default PovertyByGender;
