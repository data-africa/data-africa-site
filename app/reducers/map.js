import {combineReducers} from "redux";

const vars = (state = [], action) => {
  switch (action.type) {
    case "GET_VARS_SUCCESS":
      return action.res.data.metadata;
    default:
      return state;
  }
};

export default combineReducers({vars});
