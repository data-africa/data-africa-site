import React, {Component} from "react";
import {connect} from "react-redux";
import {activateSearch} from "actions/users";
import "./Nav.css";

class Nav extends Component {

  render() {
    const {breadcrumb, children, searchActive, visible} = this.props;
    return (
      <nav className={ children ? visible ? "nav-container subnav" : "nav-container subnav hidden" : "nav-container" }>
        <div className="nav">
          <div>
            <a className="logo" href="/">
              <span className="data">Data</span> <span className="africa">Africa</span>
            </a>
            {
              breadcrumb && breadcrumb.length ? breadcrumb.map((crumb, i) =>
                i < breadcrumb.length - 1
                ? <span key={ crumb.id }><a className="link" href={`/profile/${crumb.id}`}>{ crumb.name }</a><span className="divider">/</span></span>
                : <span key={ crumb.id } className={searchActive ? "profile link active" : "profile link"} onClick={ this.props.activateSearch }>{ crumb.name }</span>
              ) : null
            }
            { children }
          </div>
          <div>
            <span className={searchActive ? "link active" : "link"} onClick={ this.props.activateSearch }><img className="icon" src="/images/nav/icon-search.svg"/>Search</span>
            <a className="link" href="/map"><img className="icon" src="/images/nav/icon-map.svg" />Map</a>
          </div>
        </div>
      </nav>
    );
  }
}

Nav.defaultProps = {visible: true};

export default connect(state => ({
  attrs: state.attrs.geo,
  breadcrumb: state.breadcrumb,
  searchActive: state.search.searchActive
}), {activateSearch})(Nav);
