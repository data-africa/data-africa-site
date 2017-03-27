import React, {Component} from "react";
import {DICTIONARY} from "helpers/dictionary";
import "./Radio.css";

class Radio extends Component {

  render() {
    const {callback, checked, options} = this.props;
    console.log(options, checked);
    return (
      <div className="radio-group">
        {options.map(opt =>
          <div className="radio-container" key={opt.value || opt}>
            <input type="radio" onChange={callback} className="radio" name={opt.value || opt} id={opt.value || opt} value={opt.value || opt} checked={ checked === (opt.value || opt) } />
            <label className={ `radio-label ${ checked === (opt.value || opt) ? "active" : "" }` } htmlFor={opt.value || opt}>{ DICTIONARY[opt.label || opt] || opt.label || opt }</label>
          </div>
        )}
      </div>
    );
  }

}

export default Radio;
