const { resolve } = require('path')
const { HotModuleReplacementPlugin } = require('webpack')
const {merge} = require('webpack-merge')
const path = require('path');

const { config } = require('./common')

const DEV_DIST = resolve(__dirname, '..', 'dist')

module.exports = merge(config, {
  profile: false,
  devtool: 'inline-source-map',
  mode: 'development',

  output: {
    path: DEV_DIST,
    pathinfo: true,
    filename: '[name].dev.js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../postcss.config.js'),
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new HotModuleReplacementPlugin(),
  ],

  devServer: {
    static: {
      directory: resolve(__dirname, '..', 'public')
    },
    compress: true,
    historyApiFallback: {
        disableDotRule: true
    },
    client: {
      overlay: {
        warnings: false,
        errors: true,
      }
    }
  },
})
