import React, {Component} from "react";
import {connect} from "react-redux";
import Home from "./Home";

class Search extends Component {

  render() {
    return <Home message="Page Not Found" />;
  }
}

export default connect(() => ({}), {})(Search);
