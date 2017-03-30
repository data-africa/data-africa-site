import React, {Component} from "react";
import Nav from "components/Nav";
import Footer from "components/Footer";
import Search from "components/Search";
import "normalize.css/normalize.css";
import "components/d3plus.css";
import "./App.css";

export default class App extends Component {

  render() {

    const {slug} = this.props.params;

    return (
      <div className={ slug ? "container embed" : "container" }>
        { slug ? null : <Nav /> }
        { this.props.children }
        { slug ? null : <Footer dark={ this.props.params.id === undefined } /> }
        <Search />
      </div>
    );

  }

}
