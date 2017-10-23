import {titleCase} from "d3plus-text";
import {dataFold} from "d3plus-viz";

import profile from "./profile";
import map from "./map";

export default {
  attrs: (state = {}) => {
    const lookup = {};
    for (const key in state) {
      if ({}.hasOwnProperty.call(state, key)) {
        if (state[key].data && state[key].headers) {
          lookup[key] = dataFold(state[key]).reduce((obj, d) => (d.name = titleCase(d.name), obj[d.id] = d, obj), {});
        }
        else lookup[key] = state[key];
      }
    }
    return lookup;
  },
  breadcrumb: (state = false, action) => {
    switch (action.type) {
      case "UPDATE_BREADCRUMB":
        return action.data;
      default:
        return state;
    }
  },
  focus: (state = {}) => state,
  map,
  profile
};
