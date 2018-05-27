const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'BEMFavorites',
    libraryTarget: 'var',
  },
  externals: {
    jquery: '$',
    bem: 'Bem',
  },
  resolve: {
    mainFields: ['browser', 'es2015', 'module', 'main'],
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts$/,
        use: [ 
          { loader: 'babel-loader'},
          { loader: 'ts-loader' },
        ],
      },
    ],
  },
};
