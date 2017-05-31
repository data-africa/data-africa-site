import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import Search from "components/Search";
import "./Nav.css";

class SearchButton extends Component {

  render() {
    const {active, toggle} = this.props;
    return (
      <span className={ active ? "link active hidden" : "link"} onClick={ toggle }>
        <img className="icon" src="/images/nav/search.svg"/>
        Search
      </span>
    );
  }

}

SearchButton.defaultProps = {
  active: false,
  toggle: false
};

class Nav extends Component {

  render() {
    const {breadcrumb, dark, children, visible} = this.props;
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
                : <span key={ crumb.id } className="profile link">{ crumb.name }</span>
              ) : null
            }
            { children }
          </div>
          <div>
            <Search className="search-nav" inactiveComponent={ SearchButton } />
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
  breadcrumb: state.breadcrumb
}))(Nav);
