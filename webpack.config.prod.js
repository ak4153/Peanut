const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: './src/app.ts',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    //this is the problematic settings, which gave error on live-reload
  },

  devServer: {
    static: {
      directory: './dist',
    },
  },

  // devtool: 'none',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
