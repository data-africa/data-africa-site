import React, {Component} from "react";
import Nav from "components/Nav";
import Footer from "components/Footer";
import Search from "components/Search";
import "normalize.css/normalize.css";
import "components/d3plus.css";

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="container">
        <Nav />
        { this.props.children }
        <Footer dark={ this.props.params.id === undefined } />
        <Search />
      </div>
    );

  }

}
