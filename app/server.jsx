import React from "react";
import {renderToString} from "react-dom/server";
import {createMemoryHistory, match, RouterContext} from "react-router";
import {Provider} from "react-redux";
import createRoutes from "routes";
import configureStore from "store/configureStore";
import preRenderMiddleware from "middlewares/preRenderMiddleware";
import header from "components/Meta";
import {NODE_ENV} from "../.env";

const analtyicsScript =
  typeof trackingID === "undefined" ? ""
  : `<script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', ${trackingID}, 'auto');
      ga('send', 'pageview');
    </script>`;

/*
 * To Enable Google analytics simply replace the hashes with your tracking ID and move the constant to above the analtyicsScript constant.
 */
const trackingID  = "'UA-########-#'";

export default function(defaultStore = {}) {

  return function(req, res) {

    const history = createMemoryHistory();
    const store = configureStore(defaultStore, history);
    const routes = createRoutes(store);

    match({routes, location: req.url}, (err, redirect, props) => {

      if (err) res.status(500).json(err);
      else if (redirect) res.redirect(302, redirect.pathname + redirect.search);
      else if (props) {
        // This method waits for all render component
        // promises to resolve before returning to browser
        preRenderMiddleware(
          store.dispatch,
          props.components,
          props.params
        )
        .then(() => {
          const initialState = store.getState();
          const componentHTML = renderToString(
            <Provider store={store}>
              <RouterContext {...props} />
            </Provider>
          );

          const css = NODE_ENV === "production" ? "<link rel='stylesheet' type='text/css' href='/assets/styles.css'>" : "";

          res.status(200).send(`
            <!doctype html>
            <html ${header.htmlAttributes.toString()}>
              <head>
                ${header.title.toString()}
                ${header.meta.toString()}
                ${header.link.toString()}
                ${css}
              </head>
              <body>
                <div id="app">${componentHTML}</div>
                <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
                ${analtyicsScript}
                <script type="text/javascript" charset="utf-8" src="/assets/app.js"></script>
              </body>
            </html>
          `);
        })
        .catch(err => res.status(500).json(err));
      }
      else res.sendStatus(404);

    });
  };

}
