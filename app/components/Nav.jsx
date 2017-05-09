import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {toggleSearch} from "actions/index";
import "./Nav.css";

class Nav extends Component {

  render() {
    const {breadcrumb, dark, children, searchActive, visible} = this.props;
    return (
      <nav className={ `nav-container${ children ? " subnav" : "" }${ visible ? "" : " hidden" }${ dark ? " dark" : "" }` }>
        <div className="nav">
          <div>
            <Link className="logo" to="/">
              <span className="data">Data</span> <span className="africa">Africa</span>
            </Link>
            {
              breadcrumb && breadcrumb.length ? breadcrumb.map((crumb, i) =>
                i < breadcrumb.length - 1
                ? <span key={ crumb.id }><Link className="link" to={`/profile/${crumb.id}`}>{ crumb.name }</Link><span className="divider">/</span></span>
                : <span key={ crumb.id } className="profile link" onClick={ this.props.toggleSearch }>{ crumb.name }</span>
              ) : null
            }
            { children }
          </div>
          <div>
            <span className={searchActive ? "link hidden active" : "link"} onClick={ this.props.toggleSearch }><img className="icon" src="/images/nav/search.svg"/>Search</span>
            <Link className="link" to="/map"><img className="icon" src="/images/nav/map.svg" />Map</Link>
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
}), {toggleSearch})(Nav);
