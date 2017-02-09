#! /usr/bin/env node

const nodemon = require("nodemon");

process.env.NODE_ENV = "development";
process.env.DIR = __dirname;

nodemon({
  watch: [
    "app/actions",
    "app/reducers",
    "app/*.js",
    "app/*.jsx"
  ],
  exec: "webpack --colors --config $DIR/../webpack/webpack.config.dev-server.js && babel-node --presets es2015,stage-0 --ignore node_modules,static -- $DIR/server.js"
});
