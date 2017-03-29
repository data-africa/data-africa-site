import React, {Component} from "react";
import {connect} from "react-redux";
import {toggleSearch} from "actions/index";
import "./Search.css";

import {API} from ".env";
import axios from "axios";

import {strip} from "d3plus-text";
import {dataFold} from "d3plus-viz";

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  onChange(e) {

    const userQuery = e.target.value;

    if (userQuery.length === 0) this.setState({results: []});
    // else if (userQuery.length < 3) return;
    else {
      axios.get(`${API}attrs/search/?q=${strip(userQuery)}`)
        .then(res => this.setState({results: dataFold(res.data)}));
    }

  }

  componentDidMount() {

    document.addEventListener("keydown", () => {

      const {active, toggleSearch} = this.props;
      const key = event.keyCode;
      const DOWN = 40,
            ENTER = 13,
            ESC = 27,
            S = 83,
            UP = 38;

      if (!active && key === S) {
        event.preventDefault();
        toggleSearch();
      }
      else if (active && key === ESC) {
        event.preventDefault();
        toggleSearch();
      }
      else if (active) {

        const highlighted = document.querySelector(".highlighted");

        if (key === ENTER && highlighted) {
          this.refs.input.value = highlighted.querySelector("a").innerHTML;
          toggleSearch();
          setTimeout(() => {
            window.location = highlighted.querySelector("a").href;
          }, 500);
        }
        else if (key === DOWN || key === UP) {

          if (!highlighted) {
            if (key === DOWN) document.querySelector(".results > li:first-child").classList.add("highlighted");
          }
          else {

            const results = document.querySelectorAll(".results > li");

            const currentIndex = [].indexOf.call(results, highlighted);

            if (key === DOWN && currentIndex < results.length - 1) {
              results[currentIndex + 1].classList.add("highlighted");
              highlighted.classList.remove("highlighted");
            }
            else if (key === UP) {
              if (currentIndex > 0) results[currentIndex - 1].classList.add("highlighted");
              highlighted.classList.remove("highlighted");
            }
          }
        }

      }

    }, false);

  }

  render() {

    const {active, className} = this.props;
    const {results} = this.state;

    if (active) this.refs.input.focus();

    return (
      <div className={ `${className} ${ active ? "active" : "" }` }>
        <div className="input">
          <img className="icon" src="/images/nav/search.svg" />
          <input type="text" ref="input" onChange={ this.onChange.bind(this) } placeholder="Enter a location" />
        </div>
        <ul className="results">
          { results.map(result =>
            <li key={ result.id } className="result">
              <a href={ `/profile/${result.id}` }>{ result.name }</a>
            </li>
          )}
        </ul>
      </div>
    );

  }
}

Search.defaultProps = {
  className: "search-nav"
};

export default connect(state => ({
  active: state.search.searchActive
}), {toggleSearch})(Search);
