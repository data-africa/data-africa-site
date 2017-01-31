import React from "react";
import {Route, IndexRoute} from "react-router";

import App from "components/App";
import Home from "pages/Home";
import Profile from "pages/Profile";
import NotFound from "pages/NotFound";

export default function RouteCreate() {

  function genRandId() {
    const candidates = ["040AF00094", "040AF00253", "040AF00170", "040AF00217", "040AF00042", "040AF00152", "040AF00270", "040AF00257", "040AF00079", "040AF00205", "040AF00182", "040AF00133"];
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

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
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
}
