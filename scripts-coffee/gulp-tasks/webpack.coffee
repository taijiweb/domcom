gulp = require 'gulp'
{logTime}  = require "gulp-task-helper"

webpack = require 'webpack'

{makeConfig, makeWebpackDevServer} = require '../webpack-config'

onTaskDone = -> (err, stats) ->
  if err then console.log('Error', err)
  else console.log(stats.toString())
  logTime("finished 'webpack'")
  return

webpack = require "webpack"
#ClosureCompilerPlugin from 'webpack-closure-compiler'

domcomEntry = {
  'domcom': './src/domcom',
}
runWebPack = (entry, filename, options) ->
  config = makeConfig(entry, filename, options)
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone()

webpackDistribute = (mode) ->
  plugins = [new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
         options: {}
       })
  ]
  runWebPack(domcomEntry, '[name].js', {mode:'development',path:'../dist', pathinfo:true, libraryTarget:'umd', library:'dc', plugins})
  runWebPack('./test/coffee/index', 'test.js', {mode:'development',path:'../dist', pathinfo:true, plugins})
  runWebPack('./demo/coffee/index', 'demo.js', {mode:'development',path:'../dist', pathinfo:true, plugins})
  runWebPack('./demo/coffee/todomvc', 'todomvc.js', {mode:'development',path:'../dist', pathinfo:true, plugins})
  if mode=='production'
    # webpack.optimize.UglifyJsPlugin has been removed, please use config.optimization.minimize instead.
    # plugins.push new webpack.optimize.UglifyJsPlugin({minimize: true})
    runWebPack(domcomEntry, '[name].min.js', {mode,path:'../dist', pathinfo:false, libraryTarget:'umd', library:'dc', plugins})

gulp.task 'webpack-dist', () -> webpackDistribute('production')
gulp.task 'webpack-dev', () -> webpackDistribute('development')

gulp.task 'wpserver', ->
  webServerPlugins = [
    new webpack.HotModuleReplacementPlugin()
    new webpack.NoEmitOnErrorsPlugin()
  ]
  makeWebpackDevServer(["webpack/hot/dev-server", './src/domcom'], 'domcom.js', {port:8083, inline:true, plugins:webServerPlugins})
  makeWebpackDevServer(["webpack/hot/dev-server", './test/coffee/index'], 'test.js', {port:8088, plugins:webServerPlugins})
  makeWebpackDevServer(["webpack/hot/dev-server", './demo/coffee/index'], 'demo.js', {port:8089, plugins:webServerPlugins})
  makeWebpackDevServer(["webpack/hot/dev-server", './demo/coffee/todomvc'], 'todomvc.js', {port:8090, plugins:webServerPlugins})
