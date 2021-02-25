const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssPlug = require('mini-css-extract-plugin');
const Autoprefixer = require('autoprefixer');
const CopyPlug = require('copy-webpack-plugin');

module.exports = {
  entry: { app: './src/index.js' },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './public/html-5.png',
    }),
    new CopyPlug({
      patterns: [{
        from: './public',
        to: './',
      }],
    }),
    new MiniCssPlug(),
  ],
  devServer: {
    contentBase: './dist',
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    },
    {
      test: /\.(png|jpg|gif|svg|cur)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 65,
          },
          optipng: {
            enabled: true,
          },
          pngquant: {
            quality: '65-90',
            speed: 4,
          },
          gifsicle: {
            interlaced: false,
          },
        },
      },
      ],
    },
    {
      test: /\.(ttf|woff|woff2|eot)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      }],
    },

    {
      test: /\.(sa|sc|c)ss$/,
      use: [{
        loader: MiniCssPlug.loader,
        options: {
          publicPath: '../',
        },
      },
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              Autoprefixer,
            ],
          },
        },
      },
      'sass-loader',
      ],
    },
    ],
  },
};
