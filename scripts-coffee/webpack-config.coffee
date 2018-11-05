_ = require('lodash')
path = require('path')
webpack = require("webpack")

exports.makeConfig = makeConfig = (entry, filename, options={}, makingServer) ->
  plugins = options.plugins || [ new webpack.NoEmitOnErrorsPlugin() ]

  config =
    mode: options.mode || 'development'
    entry: entry

    output:
      path: path.join(__dirname, options.path || '../public'),
      filename: filename
      pathinfo: if options.pathinfo? then options.pathinfo else true
      publicPath: options.publicPath || "/assets/",

    resolve: {extensions: ['.js', '.coffee']}

    externals: { chai: "chai"}

    node: {fs: "empty"}

    cache:true

    module:
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {presets: ['env']}
        },
        {
          test: /\.coffee$/,
          use: [{
            loader:'coffee-loader',
            options:{ 
              sourceMap: false, 
              transpile: {
                    presets: ['@babel/env']
                  }
              } 
          }]
        }
      ]

    plugins: plugins
 
  if makingServer
    config.devServer =
      contentBase: "http://localhost/",
      noInfo: false,
      hot: true,
      inline: true
  config

WebpackDevServer = require("webpack-dev-server")
exports.makeWebpackDevServer = (entry, filename, options={}) ->

  options.plugins = options.plugins || [
    new webpack.HotModuleReplacementPlugin()
    new webpack.NoEmitOnErrorsPlugin()
  ]

  compilerConfig = makeConfig(entry, filename, options)
  webpackCompiler = webpack(compilerConfig)

  serverConfig =
    proxy: {'*': "http://localhost/"},
    publicPath: options.publicPath || "/assets/",

    hot: true,

    quiet: false,
    noInfo: false,

    lazy: false,
    filename: filename

    watchOptions:
      aggregateTimeout: 300,
      poll: 1000

    headers: { "X-Custom-Header": "yes" }
    inline:options.inline

  webpackDevServer = new WebpackDevServer(webpackCompiler, serverConfig)
  webpackDevServer.listen options.port || 8080, "localhost", ->