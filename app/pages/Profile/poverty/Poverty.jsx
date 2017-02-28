import React from "react";
import {dataFold} from "d3plus-viz";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {API} from ".env";
import {DICTIONARY} from "helpers/dictionary";
import {FORMATTERS} from "helpers/formatters";
import {fetchData} from "actions/profile";

import {povertyContent} from "pages/Profile/poverty/shared";

class Poverty extends SectionColumns {

  render() {
    const {profile} = this.props;
    const {povertyData} = this.context.data;

    return (
      <SectionColumns>
        <SectionTitle>Poverty Level by Measure</SectionTitle>
        <article>
          {povertyContent(profile, povertyData)}
        </article>
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
    </SectionColumns>
    );
  }
}

Poverty.need = [
  fetchData("povertyData", "api/join/?geo=<id>&show=year,poverty_level&sumlevel=latest_by_geo,all&required=num,poverty_geo_name,poverty_geo_parent_name&limit=2")
];

export default Poverty;
