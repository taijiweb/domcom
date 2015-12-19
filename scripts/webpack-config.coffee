_ = require 'lodash'
path = require('path')
webpack = require("webpack")

exports.makeConfig = makeConfig = (entry, filename, options={}) ->
  plugins = options.plugins or [ new webpack.NoErrorsPlugin() ]

  config =
    entry: entry

    output:
      path: path.join(__dirname, options.path or '../public'),
      filename: filename
      pathinfo: options.pathinfo or true
      publicPath: options.publicPath or "/assets/",

    resolve: {extensions: ['', '.coffee', '.js']}

    externals: { chai: "chai"}

    node: {fs: "empty"}

    cache:true

    module:
      loaders: [
        { test: /\.css$/, loader: "style!css" },
        { test: /\.coffee$/, loader: 'coffee' }
      ]

    plugins: plugins

    #devtool: '#eval-source-map'
    #debug: true
    quiet:true
    silent:false

    devServer:
      contentBase: "http://localhost/",
      noInfo: false,
      hot: true,
      inline: true


WebpackDevServer = require("webpack-dev-server")
exports.makeWebpackDevServer = (entry, filename, options={}) ->

  options.plugins = options.plugins or [
    new webpack.HotModuleReplacementPlugin()
    new webpack.NoErrorsPlugin()
  ]

  compilerConfig = makeConfig(entry, filename, options)
  webpackCompiler = webpack(compilerConfig)

  serverConfig =
    contentBase: "http://localhost/",
    publicPath: options.publicPath or "/assets/",

    hot: true,

    quiet: false,
    #progress: false,
    #stats: false,
    #debug: false,
    silent:false,
    noInfo: false,

    lazy: false,
    filename: filename

    watchOptions:
      aggregateTimeout: 300,
      poll: 1000

    headers: { "X-Custom-Header": "yes" }
    inline:options.inline

  webpackDevServer = new WebpackDevServer(webpackCompiler, serverConfig)
  webpackDevServer.listen options.port or 8080, "localhost", ->