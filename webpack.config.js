const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  //entry: include all the files that you want to be injected
  entry: ['./src/app.ts', './app.css'],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    //this is the problematic setting, which gave error on live-reload, with dev-mode
    publicPath: '/',
  },

  devServer: {
    static: {
      directory: './dist',
    },
    liveReload: true,
  },

  devtool: 'inline-source-map',
  module: {
    rules: [
      //rules for compiling TS and CSS
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  //where to find the index.html
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'index.html'),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.css'],
  },
};
