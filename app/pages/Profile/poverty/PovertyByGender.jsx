import React from "react";
import {SectionColumns, SectionTitle} from "datawheel-canon";
import {DICTIONARY} from "helpers/dictionary";

import {fetchData} from "actions/profile";
import {povertyVizByMode, povertyTextByMode, makeGeoSelector} from "pages/Profile/poverty/shared";
import Selector from "pages/Profile/ui/Selector";


class PovertyByGender extends SectionColumns {
  constructor(props) {
    super(props);
    this.state = {povertyLevel: "ppp1", targetGeo: null};
    this.onChange = this.onChange.bind(this);
    this.onChangeGeo = this.onChangeGeo.bind(this);
  }

  onChangeGeo(event) {
    this.setState({targetGeo: event.target.value});
  }

  onChange(event) {
    this.setState({povertyLevel: event.target.value});
  }

  render() {
    const {povertyByGender} = this.context.data;
    const {profile} = this.props;
    const povertyLevel = this.state.povertyLevel;
    const targetGeo = this.state.targetGeo;
    const {filteredData, vizData, selector} = makeGeoSelector(profile, povertyByGender.filter(x => x.poverty_level === povertyLevel),
                                                          targetGeo, this.onChangeGeo);
    const viz = povertyVizByMode(profile, vizData, povertyLevel, "gender");
    const opts = ["ppp1", "ppp2"];
    return <SectionColumns>   
            <article className="section-text">
            <SectionTitle>{ `Poverty Measures by Head of Household Gender ${ DICTIONARY[povertyLevel] }` }</SectionTitle>
              <span>Wages</span>
              {selector}
              <Selector options={opts} callback={this.onChange}/>
              {povertyTextByMode(profile, filteredData, povertyLevel, "gender")}
            </article>
            {viz}
        </SectionColumns>;
  }
}

PovertyByGender.need = [
  fetchData("povertyByGender", "api/join/?show=year,gender&geo=<id>&required=poverty_geo_name,poverty_geo_parent_name,poverty_level,hc,sevpov,povgap&sumlevel=latest_by_geo,all")
];

export default PovertyByGender;
