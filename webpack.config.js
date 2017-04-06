const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

const dist = {
  entry: './src/index.js',
  target: 'web',
  devtool: 'cheap-source-map',
  output: {
    filename: 'flowai-js.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: "Flowai"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  ],
  node: {
    fs: 'empty'
  }
}

module.exports = [dist]
