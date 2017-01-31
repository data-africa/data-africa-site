import React, {Component} from "react";

import {Geomap} from "d3plus-geomap";
import {Treemap} from "d3plus-hierarchy";
import {BarChart} from "d3plus-plot";
const types = {BarChart, Geomap, Treemap};

import {dataFold} from "d3plus-viz";
import {default as globalConfig} from "./Viz.js";

class Viz extends Component {

  componentDidMount() {

    const {type} = this.props;

    const viz = new types[type]()
      .select(this.refs.container);

    this.setState({viz});
  }

  componentDidUpdate() {

    const {config, dataFormat} = this.props;

    const viz = this.state.viz
      .config(globalConfig)
      .config(Object.assign({}, config, {data: []}));

    if (config.data) viz.data(config.data, dataFormat);

    viz.render();

  }

  render() {
    return <div className="viz" ref="container"></div>;
  }

}

Viz.defaultProps = {
  config: {},
  dataFormat: d => dataFold(d),
  type: "Treemap"
};

export default Viz;
