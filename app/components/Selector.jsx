import React, {Component} from "react";
import {DICTIONARY} from "helpers/dictionary";
import "./Selector.css";

class Selector extends Component {

  render() {
    return (
      <select className="dropdown" onChange={this.props.callback}>
        {this.props.options.map(opt =>
          <option className="option" key={opt.value || opt} value={opt.value || opt}>{DICTIONARY[opt.label || opt] || opt.label}</option>
        )}
      </select>
    );
  }

}

export default Selector;
