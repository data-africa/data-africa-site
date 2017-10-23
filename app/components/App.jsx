import React, {Component} from "react";
import Helmet from "react-helmet";
import Nav from "components/Nav";
import Footer from "components/Footer";
import "normalize.css/normalize.css";
import "helpers/d3plus.css";
import "./App.css";

import header from "../helmet.js";

import yn from "yn";

export default class App extends Component {

  render() {

    const {slug} = this.props.params;

    const dark = ["/map"].includes(this.props.location.pathname);

    const {text} = this.props.location.query;

    return (
      <div className={ slug ? `container embed ${ yn(text) === false ? "noText" : "" }` : "container" }>
        <Helmet title={ header.title } link={ header.link } meta={ header.meta } />
        { slug ? null : <Nav dark={ dark } /> }
        { this.props.children }
        { slug || dark ? null : <Footer dark={ this.props.location.pathname === "/" } /> }
      </div>
    );

  }

}
