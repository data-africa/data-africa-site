import React, {Component} from "react";
import PropTypes from "prop-types";
import "./Download.css";
import {API} from "helpers/consts.js";

import {saveAs} from "file-saver";
import {text} from "d3-request";
import {saveElement} from "d3plus-export";

class Download extends Component {

  onCSV() {
    const {title} = this.props;
    let {url} = this.props;
    if (!url.includes(API)) url = `${API}${url}`;
    text(url, (err, data) => {
      if (!err) saveAs(new Blob([data], {type: "text/plain;charset=utf-8"}), `${title}.csv`);
    });
  }

  onImage() {
    const {component, title} = this.props;
    if (component.viz) {
      const elem = component.viz.container || component.viz._reactInternalInstance._renderedComponent._hostNode;
      saveElement(elem, {filename: title, type: "png"});
    }
  }

  onBlur() {
    this.input.blur();
  }

  onFocus() {
    this.input.select();
  }

  render() {
    const slug = this.props.component._reactInternalInstance._currentElement.type.name;
    const profile = this.props.component.props.profile.url_name;
    const url = `https://dataafrica.io/profile/${profile}/${slug}`;

    return <div>
      <div className="download-btn" onClick={this.onImage.bind(this)}>
        <img src="/images/sections/icon-save.svg" />Save Image
      </div>
      <div className="download-btn" onClick={this.onCSV.bind(this)}>
        <img src="/images/sections/icon-data.svg" />Download Data
      </div>
      <div className="download-btn" onClick={this.onFocus.bind(this)} onMouseLeave={this.onBlur.bind(this)}>
        <img src="/images/sections/icon-embed.svg" />
        <input type="text" value={url} ref={input => this.input = input} readOnly="readonly" />
      </div>
    </div>;

  }
}

Download.contextTypes = {
  slug: PropTypes.string
};

export default Download;
