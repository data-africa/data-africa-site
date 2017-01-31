const path = require("path");
const webpack = require("webpack");

const assetsPath = path.join(__dirname, "..", "static", "assets");
const publicPath = "/assets/";

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const InlineEnviromentVariablesPlugin = require("inline-environment-variables-webpack-plugin");

const commonLoaders = [
  {
    test: /\.js$|\.jsx$/,
    loader: "babel-loader",
    query: {
      presets: ["es2015", "react", "stage-0"],
      plugins: [
        "transform-decorators-legacy",
        "transform-react-remove-prop-types",
        "transform-react-constant-elements",
        "transform-react-inline-elements"
      ]
    },
    include: path.join(__dirname, "..", "app"),
    exclude: path.join(__dirname, "..", "node_modules")
  },
  {
    test: /\.json$/, loader: "json-loader"
  },
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
  }
];

function postCSSConfig() {
  return [
    require("postcss-import")({path: path.join(__dirname, "..", "app")}),
    require("postcss-simple-vars")(),
    require("postcss-nesting")(),
    require("postcss-cssnext")({browsers: ["> 1%", "last 2 versions"]}),
    require("postcss-reporter")({clearMessages: true, filter: msg => msg.type === "warning" || msg.type !== "dependency"})
  ];
}

module.exports = [
  {
    name: "browser",
    devtool: "cheap-module-source-map",
    context: path.join(__dirname, "..", "app"),
    entry: {app: "./client"},
    output: {
      path: assetsPath,
      filename: "[name].js",
      publicPath
    },
    module: {
      loaders: commonLoaders
    },
    resolve: {
      root: [path.join(__dirname, "..", "app")],
      extensions: ["", ".js", ".jsx", ".css"]
    },
    plugins: [
      new ExtractTextPlugin("styles.css", {allChunks: true}),
      new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
      new webpack.DefinePlugin({__DEVCLIENT__: false, __DEVSERVER__: false}),
      new InlineEnviromentVariablesPlugin({NODE_ENV: "production"})
    ],
    postcss: postCSSConfig
  },
  {
    // The configuration for the server-side rendering
    name: "server-side rendering",
    context: path.join(__dirname, "..", "app"),
    entry: {server: "./server"},
    target: "node",
    output: {
      path: assetsPath,
      filename: "server.js",
      publicPath,
      libraryTarget: "commonjs2"
    },
    module: {
      loaders: commonLoaders
    },
    resolve: {
      root: [path.join(__dirname, "..", "app")],
      extensions: ["", ".js", ".jsx", ".css"]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new ExtractTextPlugin("styles.css", {allChunks: true}),
      new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
      new webpack.DefinePlugin({__DEVCLIENT__: false, __DEVSERVER__: false}),
      new webpack.IgnorePlugin(/vertx/),
      new InlineEnviromentVariablesPlugin({NODE_ENV: "production"})
    ],
    postcss: postCSSConfig
  }
];
