var path = require('path');
var minify = process.env.MINIFY || false;

module.exports = {
  entry: {
    'react-stampit': ['./src/index'],
    'react-stampit-with-addons': ['./src/addons'],
  },

  output: {
    path: path.resolve('./dist'),
    filename: minify ? '[name].min.js' : '[name].js',
    library: 'stampit',
    libraryTarget: 'umd',
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
    ],
  },
};
