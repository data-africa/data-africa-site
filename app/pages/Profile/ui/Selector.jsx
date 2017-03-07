import React from "react";
import {DICTIONARY} from "helpers/dictionary";

class Selector extends React.Component {
  render() {
    return <select onChange={this.props.callback}>
      {this.props.options.map(opt =>
        <option key={opt} value={opt}>{DICTIONARY[opt] || opt}</option>
      )}
    </select>;
  }
}

export default Selector;
