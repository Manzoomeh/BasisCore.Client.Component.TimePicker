const path = require("path");
//const CircularDependencyPlugin = require("circular-dependency-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);


module.exports = (env, options) => {
  return {

    entry: {

      timepicker: {
        import: "./src/loader.ts",
        filename: "basiscore.timepicker.js",
        library: {
          name: "bc",
          type: "assign",
        },
      },
    },
    devtool: "source-map",
    output: {
      filename: "[name].js",
    },
    devServer: {
      static: path.resolve(__dirname, "wwwroot"),
      onBeforeSetupMiddleware: function (server) {

      },
      open: true,
      port: 3002,
    },
    module: options.mode,
    optimization: {
      minimize: options.mode === "production",
      minimizer: [
        new UglifyJsPlugin({
          include: /\.min\.js$/,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ["ts-loader"],
          exclude: /\.d\.ts$/,
        },
        {
          test: /\.d\.ts$/,
          use: ["ignore-loader"],
        },
        {
          test: /\.(png|html)$/,
          type: "asset/source",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        }
      ],
    },
    resolve: {
      extensions: [".ts", ".d.ts", ".tsx", ".js", ".jsx", ".css"],
    },
    plugins: [

      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(
              __dirname,
              "node_modules/alasql/dist/alasql.min.js"
            ),
          },
        ],
      }),
    ],
  };
};
