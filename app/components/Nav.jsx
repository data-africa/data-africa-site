import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {activateSearch} from "actions/users";
import "./Nav.css";

class Nav extends Component {

  render() {
    const {searchActive} = this.props;
    return (
      <nav className="nav">
        <Link className="logo" to="/">
          <span className="data">Data</span> <span className="africa">Africa</span>
        </Link>
        <span className={searchActive ? "link active" : "link"} onClick={ this.props.activateSearch }>Locations</span>
        <Link className="link" to="/">Map</Link>
        <Link className="link" to="/">About</Link>
      </nav>
    );
  }
}

export default connect(state => ({
  searchActive: state.search.searchActive
}), {activateSearch})(Nav);
