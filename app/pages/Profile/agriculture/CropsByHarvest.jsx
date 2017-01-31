import React, {Component} from "react";
import {connect} from "react-redux";

import Viz from "../../../canon/Viz.jsx";
import "../../../canon/Topic.css";

import {API} from "../../../../.env";

class Topic extends Component {

  render() {
    const {attrs, id} = this.props;
    const attrLookup = attrs.reduce((obj, d) => (obj[d.id] = d, obj), {});
    return (
      <div className="topic">
        <h3>Crops by Harvested Area</h3>
        <Viz type="Treemap" config={{
          data: `${API}api/join/?show=crop&geo=${id}&sumlevel=lowest&required=harvested_area`,
          groupBy: "crop",
          label: d => attrLookup[d.crop] ? attrLookup[d.crop].name : d.crop,
          legend: false,
          sum: d => d.harvested_area
        }} />
      </div>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.crop
}), {})(Topic);
