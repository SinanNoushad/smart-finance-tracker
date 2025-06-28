// client/webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'), // or 'dist'
    filename: 'bundle.js',
    publicPath: '/',
  },

  // tell webpack how to process JS / JSX
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,          // .js and .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'),
    }),
  ],

  devServer: {
    static: path.join(__dirname, 'public'),
    historyApiFallback: true,
    port: 3000,
    hot: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    ],
  },
};