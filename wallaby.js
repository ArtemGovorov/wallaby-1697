// Wallaby.js configuration

var path = require('path');
var webpack = require('webpack');
var wallabyWebpack = require('wallaby-webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var wallabyPostprocessor = wallabyWebpack({
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader",
            options: {
              localIdentName: '[local]--[hash:5]',
              sourceMap: true
            }

          }, {
            loader: "less-loader",
            options: {
              sourceMap: true
            }
          }],
          fallback: "style-loader",
          publicPath: "../"
        }),
        exclude: "/node_modules/"
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/i,
        loader: "file-loader?name=assets/img/[name].[ext]"
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        use: "file-loader?name=assets/[name].[ext]"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
  ]
});

module.exports = function (wallaby) {
  return {
    files: [
      { pattern: 'src/**/*.ts', load: false },
    ],

    tests: [
      { pattern: 'tests/**/*Spec.ts', load: false }
    ],

    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
      })
    },

    postprocessor: wallabyPostprocessor,

    setup: function () {
      // required to trigger test loading
      window.__moduleBundler.loadTests();
    }
  };
};