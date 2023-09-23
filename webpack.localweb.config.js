const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const viewLocalConfig = {
  target: 'web',
  mode: 'none',
  entry: './src-view/index.tsx',
  devServer: {
    port: 8080,
    open: true,
    hot: true,
  },

  output: {
    path: path.resolve(__dirname, 'local-dist'),
    filename: 'viewBundle.js',
    libraryTarget: 'umd',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into a separate file
          'css-loader',
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'viewStyles.css' }),
    new HtmlWebpackPlugin({
      template: './src-view/index.html',
      filename: 'index.html',
    }),
  ],
};

module.exports = [viewLocalConfig];
