import React, {Component} from "react";
import {DICTIONARY} from "helpers/dictionary";
import "./Selector.css";

class Selector extends Component {

  render() {
    const {callback, options, selected} = this.props;
    return (
      <select className="dropdown" onChange={ callback } defaultValue={ selected }>
        {options.map(opt =>
          <option className="option" key={opt.value || JSON.stringify(opt)} value={opt.value || opt}>
            {DICTIONARY[opt.label || opt] || opt.label}
          </option>
        )}
      </select>
    );
  }

}

export default Selector;
