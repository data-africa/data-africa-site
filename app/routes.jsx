import React from "react";
import {Route, IndexRoute} from "react-router";

import store from "store";

import App from "components/App";
import Home from "pages/Home";
import Profile from "pages/Profile";
import About from "pages/About";
import NotFound from "pages/NotFound";

export default function RouteCreate() {

  const genRandId = () => store.focus[Math.floor(Math.random() * store.focus.length)];

  function checkForId(nextState, replaceState) {

    if (!nextState.params.id) {
      const reqestedUrl = nextState.location.pathname;
      const randId = genRandId(reqestedUrl);
      const nextUrl = reqestedUrl.slice(-1) === "/" ? `${reqestedUrl}${randId}` : `${reqestedUrl}/${randId}`;
      replaceState({id: randId}, nextUrl);
      return void 0;
    }
    else {
      // make sure it's legal
      return NotFound;
    }

  }

  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="profile(/:id)" component={Profile} onEnter={checkForId} />
      <Route path="about" component={About} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
}
