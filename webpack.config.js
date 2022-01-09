const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const modules = isProduction ?
      {
        rules: [
          {
            test: /index.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      } : {
        rules: [
          {
            test: /index.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.wasm$/,
            type: "asset/resource"
          }
        ],
      };

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? undefined : 'inline-source-map',
  entry: './src/ts/index.ts',
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
      "./firebase.config": path.join(__dirname, 'src', 'ts', isProduction ? 'firebase.config.prod' : 'firebase.config'),
      "./load-wasm": path.join(__dirname, 'src', 'ts', isProduction ? 'load-wasm.prod' : 'load-wasm')
    },
  },
  module: modules,

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      publicPath: '/'
    }),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "src/rust/planning_poker"),
      extraArgs: isProduction ? '--no-typescript --target bundler' : '--no-typescript --target web',
    }),
  ],
  experiments: {
    asyncWebAssembly: true
  }
};
