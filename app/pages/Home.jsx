import React, {Component} from "react";
import {connect} from "react-redux";
import {toggleSearch} from "actions/index";
import "./Home.css";

import {Geomap} from "d3plus-react";

class Home extends Component {

  render() {

    const {attrs, focus, message} = this.props;
    const focusISO = focus.map(f => attrs[f].iso3);

    return (
      <div className="home">
        <div className="splash">
          <div className="image"></div>
          <div className="gradient"></div>
        </div>
        <div className="intro">
          <div className="text">
            <h2 className="title">{ message }</h2>
            <div className="search-start" onClick={ this.props.toggleSearch }>Start A Search</div>
          </div>
          <Geomap config={{
            height: 500,
            ocean: "transparent",
            padding: 24,
            shapeConfig: {Path: {
              fill: d => focusISO.includes(d.feature.properties.iso_a3) ? "#74E19A" : "rgba(255, 255, 255, 0.35)",
              stroke: "rgba(255, 255, 255, 0.75)"
            }},
            tiles: false,
            topojson: "/topojson/continent.json",
            topojsonKey: "collection",
            width: 400,
            zoom: false
          }} />
        </div>
        <div className="tiles">
          <h3 className="title">Explore Countries</h3>
          {
            focus.map(f =>
              <a key={f} className="tile" href={ `/profile/${f}` } style={{backgroundImage: `url('/images/geo/${f}.jpg')`}}>
                <span className="name">{ attrs[f].name }</span>
              </a>
            )
          }
          <div className="spacer"></div>
          <div className="spacer"></div>
          <div className="spacer"></div>
        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  message: "Data Africa is an open source agriculture, climate, poverty, and health dataset"
}

export default connect(state => ({
  attrs: state.attrs.geo,
  focus: state.focus
}), {toggleSearch})(Home);
