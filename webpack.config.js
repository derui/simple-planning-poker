const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? null : 'inline-source-map',
  entry: './src/ts/index.tsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.wasm'],
    modules: [path.join(__dirname, 'src', 'ts'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
      "@": path.join(__dirname, 'src', 'ts'),
      "firebase.config": path.join(__dirname, 'src', 'ts', isProduction ? 'firebase.config.prod' : 'firebase.config')
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      publicPath: '/'
    }),
  ],
};
