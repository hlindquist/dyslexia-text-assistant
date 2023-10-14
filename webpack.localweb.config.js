const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

const viewLocalConfig = {
  target: 'web',
  mode: 'development',
  entry: './src/src-view/index.tsx',
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'viewStyles.css' }),
    new HtmlWebpackPlugin({
      template: './src/src-view/index.html',
      filename: 'index.html',
    }),
    new DefinePlugin({
      OPENAI_TEST_KEY: JSON.stringify(process.env.OPENAI_API_KEY),
    }),
  ],

  devtool: 'source-map',
};

module.exports = [viewLocalConfig];
