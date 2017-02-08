import {API, NODE_ENV, PORT} from "./app/.env";
import axios from "axios";
import gzip from "compression";
import express from "express";
import flash from "express-flash";
import helmet from "helmet";
import path from "path";
import webpack from "webpack";

import {titleCase} from "d3plus-text";
import {dataFold as fold} from "d3plus-viz";

const prefix = `${API}attrs/`;

axios.get(`${prefix}list`)
  .then(res => {

    const attrs = {};

    const promises = res.data.data.map(attr => axios.get(`${API}attrs/${attr}`)
      .then(res => {
        console.log(`Cached ${attr} attributes`);
        const data = fold(res.data);
        data.forEach(d => {
          d.name = titleCase(d.name);
        });
        attrs[attr] = data;
        return data;
      })
      .catch(err => {
        console.log(`${API}attrs/${attr} errored with code ${err.response.status}`);
        return Promise.reject(err);
      }));

    Promise.all(promises)
      .then(() => {

        console.log("\nInitializing Server");

        const App = require("./static/assets/server");
        const app = express();

        if (NODE_ENV === "development") {
          const webpackDevConfig = require("./webpack/webpack.config.dev-client");
          const compiler = webpack(webpackDevConfig);
          app.use(require("webpack-dev-middleware")(compiler, {
            noInfo: true,
            publicPath: webpackDevConfig.output.publicPath
          }));

          app.use(require("webpack-hot-middleware")(compiler));
        }

        app.set("port", PORT);

        if (NODE_ENV === "production") {
          app.use(gzip());
          app.use(helmet());
        }

        app.use(express.static(path.join(__dirname, "static")));

        app.set("trust proxy", "loopback");

        console.log("--------------------------");
        console.log("===>  😊 Starting Server . . .");
        console.log(`===>  Environment: ${NODE_ENV}`);
        console.log(`===>  Listening on port: ${PORT}`);
        console.log("--------------------------");

        app.use(flash());

        app.get("*", App.default({
          attrs,
          focus: ["040AF00094", "040AF00253", "040AF00170", "040AF00217", "040AF00042", "040AF00152", "040AF00270", "040AF00257", "040AF00079", "040AF00205", "040AF00182", "040AF00133"]
        }));
        app.listen(PORT);

      });

  });
