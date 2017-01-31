import {combineReducers} from "redux";
import {routerReducer as routing} from "react-router-redux";

import {default as profile} from "./profile";

const searchActive = (state = false, action) => {
  switch (action.type) {
    case "ACTIVATE_SEARCH":
      return !state;
    default:
      return state;
  }
};

export default combineReducers({
  attrs: (state = {}) => state,
  focus: (state = {}) => state,
  profile,
  routing,
  search: combineReducers({searchActive})
});
