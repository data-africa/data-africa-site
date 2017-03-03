import React from "react";
import {SectionColumns, SectionTitle} from "datawheel-canon";
import {DICTIONARY} from "helpers/dictionary";

import {fetchData} from "actions/profile";
import {povertyVizByMode, povertyTextByMode} from "pages/Profile/poverty/shared";
import Selector from "pages/Profile/ui/Selector";

class PovertyByResidence extends SectionColumns {
  constructor(props) {
    super(props);
    this.state = {povertyLevel: "ppp1"};
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({povertyLevel: event.target.value});
  }

  render() {
    const {povertyByResidence} = this.context.data;
    const {profile} = this.props;
    const povertyLevel = this.state.povertyLevel;
    const viz = povertyVizByMode(profile, povertyByResidence, povertyLevel, "residence");
    const opts = ["ppp1", "ppp2"];
    return <SectionColumns>
            <SectionTitle>{ `Poverty Measures by Residence ${ DICTIONARY[povertyLevel] }` }</SectionTitle>
            <article>
              <Selector options={opts} callback={this.onChange}/>
              {povertyTextByMode(profile, povertyByResidence, povertyLevel, "residence")}
            </article>
            {viz}
        </SectionColumns>;
  }
}

PovertyByResidence.need = [
  fetchData("povertyByResidence", "api/join/?show=year,residence&geo=<id>&required=poverty_geo_name,poverty_geo_parent_name,poverty_level,hc&sumlevel=latest_by_geo,all")
];

export default PovertyByResidence;
