import React, {Component} from "react";
import Nav from "components/Nav";
import Footer from "components/Footer";
import "normalize.css/normalize.css";
import "helpers/d3plus.css";
import "./App.css";

import yn from "yn";

export default class App extends Component {

  render() {

    const {slug} = this.props.params;

    const dark = ["/map"].includes(this.props.location.pathname);

    const {text} = this.props.location.query;

    return (
      <div className={ slug ? `container embed ${ yn(text) === false ? "noText" : "" }` : "container" }>
        { slug ? null : <Nav dark={ dark } /> }
        { this.props.children }
        { slug || dark ? null : <Footer dark={ this.props.location.pathname === "/" } /> }
      </div>
    );

  }

}
