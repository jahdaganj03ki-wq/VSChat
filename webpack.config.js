const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const config = {
  target: 'node',
  entry: {
    extension: './src/extension/activation.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@extension': path.resolve(__dirname, 'src/extension'),
      '@webview': path.resolve(__dirname, 'src/webview'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@storage': path.resolve(__dirname, 'src/storage'),
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
  externals: {
    vscode: 'commonjs vscode',
    'better-sqlite3': 'commonjs better-sqlite3',
  },
  devtool: 'source-map',
};

const webviewConfig = {
  target: 'web',
  entry: {
    webview: './src/webview/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    alias: {
      '@webview': path.resolve(__dirname, 'src/webview'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
    fallback: {
      path: false,
      fs: false,
      os: false,
      crypto: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  devtool: 'source-map',
};

module.exports = [config, webviewConfig];
