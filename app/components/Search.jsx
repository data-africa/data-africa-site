import React, {Component} from "react";
import {connect} from "react-redux";
import {activateSearch} from "../actions/users";
// import {strip} from "d3plus-text";

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  onChange(e) {
    const userQuery = e.target.value;
    if (userQuery.length < 3) return;
    // if (userQuery.length === 0) this.setState({ professionResults:[], placeResults:[], personResults:[] });
    //
    // let userQueryCleaned = userQuery.split(" ");
    // userQueryCleaned = userQueryCleaned.map(strip);
    // const lastItem = userQueryCleaned[userQueryCleaned.length-1];
    // userQueryCleaned[userQueryCleaned.length-1] = `${lastItem}:*`;
    // userQueryCleaned = userQueryCleaned.join("%26");
    //
    // console.log("axios.defaults.baseURL--", apiClient.defaults.baseURL)
    //
    // apiClient.get(`/search?document=@@.${userQueryCleaned}&order=weight.desc.nullslast&limit=100`)
    //   .then((queryResults) => {
    //     const results = queryResults.data;
    //     if(results){
    //       this.setState({ results });
    //     }
    //   })
  }

  handleKeyDown(e) {
    console.log(e.keyCode);
    // const DOWN_ARROW = 40;
    // const UP_ARROW = 38;
    // const ENTER = 13;
    // const highlighted = document.querySelector('.highlighted');

    // if(e.keyCode == ENTER){
    //   if(highlighted){
    //     window.location = highlighted.querySelector('a').href;
    //   }
    // }
    //
    // if(e.keyCode == DOWN_ARROW || e.keyCode == UP_ARROW){
    //   if(!highlighted){
    //     if(e.keyCode == DOWN_ARROW)
    //       document.querySelector('.results-list > li:first-child').classList.add('highlighted');
    //   } else {
    //     const currentIndex = [].indexOf.call(document.querySelectorAll('.results-list > li'), highlighted);
    //     //Highlight the next thing
    //     if(e.keyCode == DOWN_ARROW && currentIndex < document.querySelectorAll('.results-list > li').length-1){
    //       document.querySelectorAll('.results-list > li')[currentIndex+1].classList.add('highlighted');
    //       highlighted.classList.remove('highlighted');
    //     }
    //     else if(e.keyCode == UP_ARROW) {
    //       if(currentIndex > 0) {
    //         document.querySelectorAll('.results-list > li')[currentIndex-1].classList.add('highlighted');
    //       }
    //       highlighted.classList.remove('highlighted');
    //     }
    //   }
    // }
  }

  componentDidMount() {
    this._searchInput.focus();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const {activateSearch} = this.props;
    return (
      <div>
        <i onClick={activateSearch}>✕</i>
        Search Window
      </div>
    );
  }
}

export default connect(state => ({
  placeProfile: state.placeProfile
}), {activateSearch})(Search);
