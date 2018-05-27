let config = require('./webpack.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

config.output.filename = 'bem-favorites.min.js';
config.devtool = false;
config.mode = 'production';
config.plugins = config.plugins || [];
config.plugins.push(new UglifyJsPlugin({
  sourceMap: false,
  uglifyOptions: {
    output: {
      comments: false,
      beautify: false,
    }
  }
}));

module.exports = config;
