"use strict";

var _env = require("./.env");

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _expressFlash = require("express-flash");

var _expressFlash2 = _interopRequireDefault(_expressFlash);

var _helmet = require("helmet");

var _helmet2 = _interopRequireDefault(_helmet);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _d3plusText = require("d3plus-text");

var _d3plusViz = require("d3plus-viz");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefix = _env.API + "attrs/";

_axios2.default.get(prefix + "list").then(function (res) {

  var attrs = {};

  // const promises = res.data.data.map(attr => axios.get(`${API}attrs/${attr}`)
  var promises = ["crop", "geo"].map(function (attr) {
    return _axios2.default.get(_env.API + "attrs/" + attr).then(function (res) {
      console.log("Cached " + attr + " attributes");
      var data = (0, _d3plusViz.dataFold)(res.data);
      data.forEach(function (d) {
        d.name = (0, _d3plusText.titleCase)(d.name);
      });
      attrs[attr] = data;
      return data;
    });
  });

  Promise.all(promises).then(function () {

    var App = require("./static/assets/server");
    var app = (0, _express2.default)();

    if (_env.NODE_ENV === "development") {
      var webpackDevConfig = require("./webpack/webpack.config.dev-client");
      var compiler = (0, _webpack2.default)(webpackDevConfig);
      app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackDevConfig.output.publicPath
      }));

      app.use(require("webpack-hot-middleware")(compiler));
    }

    app.set("port", _env.PORT);

    if (_env.NODE_ENV === "production") {
      app.use((0, _compression2.default)());
      app.use((0, _helmet2.default)());
    }

    app.use(_express2.default.static(_path2.default.join(__dirname, "static")));

    app.set("trust proxy", "loopback");

    console.log("--------------------------");
    console.log("===>  😊 Starting Server . . .");
    console.log("===>  Environment: " + _env.NODE_ENV);
    console.log("===>  Listening on port: " + _env.PORT);
    console.log("--------------------------");

    app.use((0, _expressFlash2.default)());

    app.get("*", App.default({
      attrs: attrs,
      focus: ["040AF00094", "040AF00253", "040AF00170", "040AF00217", "040AF00042", "040AF00152", "040AF00270", "040AF00257", "040AF00079", "040AF00205", "040AF00182", "040AF00133"]
    }));
    app.listen(_env.PORT);
  });
});