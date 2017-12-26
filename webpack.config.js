module.exports = {
  entry: './app/index.js',
  output: {
    filename: './public/javascripts/bundle.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  }
}
