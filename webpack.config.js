const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

const dist = {
  mode: 'production',
  entry: './src/index.js',
  target: 'web',
  output: {
    filename: 'flowai-js.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: "Flowai"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  },
  node: {
    fs: 'empty'
  }
}

module.exports = [dist]
