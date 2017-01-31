import {combineReducers} from "redux";

const stats = (state = [], action) => {
  switch (action.type) {
    case "GET_STATS_SUCCESS":
      return action.res;
    default:
      return state;
  }
};

const profileReducer = combineReducers({
  stats
});

export default profileReducer;
