const {resolve} = require('path');
const {ProvidePlugin, ProgressPlugin, DefinePlugin} = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const getClientEnvironment = require('./env');

const SOURCES = resolve(__dirname, '..', 'src');
const DIST = resolve(__dirname, '..', 'dist');

const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

const config = {

    context: SOURCES,
    target: 'web',

    entry: {
        app: ['react-hot-loader/patch', 'whatwg-fetch', './index.js'],
    },

    output: {
        path: DIST,
        filename: '[name][contenthash].js',
        publicPath: '/',
    },

    resolve: {
        modules: [
            'node_modules',
            SOURCES,
        ],
        fallback: {
          fs: false,
          util: require.resolve("util/"),
          stream: require.resolve("stream-browserify"),
          path: require.resolve("path-browserify")
        }
    },

    module: {
        rules: [
            {
                test: /\.json$/,
                exclude: /node_modules/,
                use: ['json-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: ['html-loader'],
            },
            {
                test: /\.svg$/i,
                exclude: /node_modules/,
                include: /svg/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: '@svgr/webpack',
                        options: {
                            native: true,
                        },
                    }
                ]
            },
            // {
            //     test: /\.(png|jpe?g|gif|svg)$/i,
            //     exclude: /node_modules/,
            //     include: /images/,
            //     use:
            //         [
            //             'file-loader',
            //             {
            //                 loader: 'img-loader',
            //                 options: {
            //                     mozjpeg: {
            //                         quality: 75
            //                     },
            //                     pngquant: {
            //                         quality: "60-70",
            //                         speed: 4
            //                     },
            //                     svgo: {
            //                         plugins: [
            //                             {
            //                                 removeViewBox: false
            //                             },
            //                             {
            //                                 removeEmptyAttrs: false
            //                             },
            //                             {
            //                                 cleanupIDs: false
            //                             }
            //                         ]
            //                     },
            //                     gifsicle: {
            //                         optimizationLevel: 7,
            //                         interlaced: false
            //                     },
            //                     optipng: {
            //                         enabled: false
            //                     }
            //                 }
            //             }
            //         ]
            // },
            {
              test: /\.(woff2?|svg)$/,
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    limit: 10000,
                  },
                },
              ],
              include: /fonts/,
            },
            { test: /\.(ttf|eot)$/, loader: "file-loader", include: /fonts/, },
        ],
    },

    plugins: [
        new DefinePlugin(env.stringified),
        new HtmlPlugin({
            title: 'Peerplays DEX',
            template: 'index.html',
            hash: true,
            cache: true
        }),
        new ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
        new ProgressPlugin({
          activeModules: false,
          entries: true,
          handler(percentage, message, ...args) {
            console.info(`${Math.round(percentage * 100, 1)}%`, message, ...args);
          },
          modules: true,
          modulesCount: 5000,
          profile: false,
          dependencies: true,
          dependenciesCount: 10000,
          percentBy: null,
        }),
    ]
};

module.exports = {
    config,
    DIST,
    SOURCES,
};
