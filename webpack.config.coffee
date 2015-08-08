_ = require 'lodash'
path = require('path')
webpack = require("webpack")

exports.makeConfig = makeConfig = (entry, filename, options={}) ->
  #console.log JSON.stringify options
  config =
    entry: entry
    output:
      path: path.join(__dirname, options.path or 'app/public'),
      filename: filename
      pathinfo: if options.pathinfo? then options.pathinfo else true
      publicPath: options.publicPath or "/assets/"
      library: options.library
      libraryTarget:options.libraryTarget
    resolve: {extensions: ['', '.coffee', '.js']}
    externals: { chai: "chai"}
    node: {fs: "empty"}
    cache:true
    module:
      loaders: [
        { test: /\.sass$/, loader: "style!css!sass" },
        { test: /\.css$/, loader: "style!css" },
        { test: /\.coffee$/, loader: 'coffee' }
      ]
    plugins: options.plugins or []
    #devtool: '#eval-source-map'
    #debug: true
    quiet:true
    silent:true
    devServer:
      contentBase: "http://localhost/",
      noInfo: true,
      hot: true,
      inline: true

WebpackDevServer = require("webpack-dev-server")
exports.makeWebpackDevServer = (entry, filename, options={}) ->
  compilerConfig = makeConfig(entry, filename, options)
  webpackCompiler = webpack(compilerConfig)
  serverConfig =
    contentBase: "http://localhost/",
    hot: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    filename: filename
    watchOptions:
      aggregateTimeout: 300,
      poll: 1000
    publicPath: options.publicPath or "/assets/",
    headers: { "X-Custom-Header": "yes" }
    inline:options.inline
  webpackDevServer = new WebpackDevServer(webpackCompiler, serverConfig)
  webpackDevServer.listen options.port or 8080, "localhost", ->