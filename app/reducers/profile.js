import {combineReducers} from "redux";

const stats = (state = [], action) => {
  switch (action.type) {
    case "GET_STATS_SUCCESS":
      return action.res;
    default:
      return state;
  }
};

const vars = (state = [], action) => {
  switch (action.type) {
    case "GET_VARS_SUCCESS":
      return action.res.reduce((obj, d) => {
        if (!obj[d.name]) obj[d.name] = {};
        obj[d.name][d.key] = d.data;
        return obj;
      }, {});
    default:
      return state;
  }
};

const profileReducer = combineReducers({
  stats, vars
});

export default profileReducer;
