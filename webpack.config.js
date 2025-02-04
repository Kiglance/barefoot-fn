const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

dotenv.config();

const envKeys = {
  'process.env.REACT_APP_BASE_URL': JSON.stringify(
    process.env.REACT_APP_BASE_URL,
  ),
  'process.env.REACT_APP_BACKEND_URL': JSON.stringify(
    process.env.REACT_APP_BACKEND_URL,
  ),
  'process.env.DEFAULT_EMAIL': JSON.stringify(process.env.DEFAULT_EMAIL),
  'process.env.DEFAULT_PASSWORD': JSON.stringify(process.env.DEFAULT_PASSWORD),
};

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/',
    environment: {
      module: true,
      dynamicImport: true, // Note you need to enable `dynamicImport ` here
    },
  },
  devtool: isDevelopment ? 'eval-source-map' : undefined,
  mode: process.env.NODE_ENV || 'development',
  resolve: { extensions: ['*', '.js', '.jsx'] },
  devServer: {
    port: process.env.PORT || '4000',
    historyApiFallback: true,
    // headers: { 'Access-Control-Allow-Origin': '*' },
    // open: true,
    compress: true,
    liveReload: false,
    // hot: true,/
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    isDevelopment && new ReactRefreshPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({ template: 'public/index.html' }),
    new webpack.DefinePlugin(envKeys),
    new CleanWebpackPlugin(),
  ],
};
