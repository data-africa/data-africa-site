import axios from "axios";
import gzip from "compression";
import express from "express";
import flash from "express-flash";
import helmet from "helmet";
import path from "path";
import webpack from "webpack";

import {API, ATTRS, NODE_ENV, PORT} from "./app/.env";
import store from "./app/store";

function start() {

  const App = require("./static/assets/server");

  console.log("\n🌐  Starting Express Server\n");
  console.log(`   ⚙️  Environment: ${NODE_ENV}`);

  const app = express();

  if (NODE_ENV === "development") {
    const webpackDevConfig = require("./app/canon/webpack/webpack.config.dev-client");
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

  app.use(flash());

  app.get("*", App.default(store));
  app.listen(PORT);

  console.log(`   ⚙️  Port: ${PORT}`);
  console.log("\n");

}

if (ATTRS === void 0) start();
else {

  axios.get(ATTRS)
    .then(res => {

      store.attrs = {};

      console.log("\n📚  Caching Attributes\n");

      const promises = res.data.data.map(attr => axios.get(`${API}attrs/${attr}`)
        .then(res => {
          console.log(`   ✔️️  Cached ${attr} attributes`);
          store.attrs[attr] = res.data;
          return res;
        })
        .catch(err => {
          console.log(`   ❌  ${API}attrs/${attr} errored with code ${err.response.status}`);
          return Promise.reject(err);
        }));

      Promise.all(promises).then(start);

    });

}
