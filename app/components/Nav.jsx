import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import "./Nav.css";

class Nav extends Component {

  render() {
    return (
      <nav className="nav">
        <Link className="logo" to="/">
          <span className="data">Data</span>
          <span className="africa">Africa</span>
        </Link>
        <Link className="link" to="/profile">Locations</Link>
        <Link className="link" to="/">Map</Link>
        <Link className="link" to="/">About</Link>
      </nav>
    );
  }
}

export default connect(() => ({}), {})(Nav);
