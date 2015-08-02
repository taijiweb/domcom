path = require('path')
gulp = require('gulp')
gutil = require 'gulp-util'

runSequence = require('run-sequence')

changed = require('gulp-changed')
cache = require('gulp-cached')
plumber = require('gulp-plumber')

del = require('del')

mocha = require('gulp-mocha')
mochaPhantomJS = require('gulp-mocha-phantomjs')

xtask = ->

task = gulp.task.bind(gulp)

src = gulp.src.bind(gulp)
from = (source, options={dest:'app', cache:'cache'}) ->
  options.dest ?= 'app'
  options.cache ?= 'cache'
  src(source).pipe(changed(options.dest)).pipe(cache(options.cache)).pipe(plumber())

dest = gulp.dest.bind(gulp)

FromStream = from('').constructor
FromStream::to = (dst) -> @pipe(dest(dst))
FromStream::pipelog = (obj, log=gutil.log) -> @pipe(obj).on('error', log)

task 'clean', (cb) ->
  delFiles = ['dist']
  del(delFiles, cb)

logTime = (msg) ->
  t = new Date()
  console.log("[#{t.getHours()}:#{t.getMinutes()}:#{t.getSeconds()}]: "+msg)

webpack = require 'webpack'
{makeConfig, makeWebpackDevServer} = require './webpack.config'

onTaskDone = (done) -> (err, stats) ->
  if err then console.log('Error', err)
  #else  console.log(stats.toString())
  logTime("finished 'webpack'")
  #done and done()
  return

webpack = require("webpack")
ClosureCompilerPlugin = require('webpack-closure-compiler')

# need live reload , so does not use webpack-dev-server
task 'webpack-dist', (done) ->
  env = process.env.NODE_ENV
  entry = './src/index'
  config = makeConfig(entry, 'domcom.js', {path:'dist', libraryTarget:'umd', library:'dc'})
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone(done)
  process.env.NODE_ENV = 'production'
  #plugins = [new webpack.optimize.UglifyJsPlugin({minimize: true})]
  plugins = [new ClosureCompilerPlugin()]
  config = makeConfig(entry, 'domcom.min.js', {path:'dist', pathinfo:false, libraryTarget:'umd', library:'dc', plugins})
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone(done)
  process.env.NODE_ENV = env

webServerPlugins = [
  new webpack.HotModuleReplacementPlugin()
  new webpack.NoErrorsPlugin()
]

task 'webpack-server-test', (done) ->
  entry = ["webpack/hot/dev-server", './test/mocha-phantomjs-index']
  makeWebpackDevServer(entry, 'mocha-phantomjs-index.js', {port:8080, plugins:webServerPlugins})

task 'webpack-server-demo', (done) ->
  entry = ["webpack/hot/dev-server", './demo/index']
  makeWebpackDevServer(entry, 'demo-index.js', {port:8082, plugins:webServerPlugins})

task 'webpack-server-todomvc', (done) ->
  entry = ["webpack/hot/dev-server", './demo/todomvc/app']
  makeWebpackDevServer(entry, 'todomvc.js', {port:8086, plugins:webServerPlugins})

task 'build', (callback) ->
  runSequence 'clean', 'webpack-dist', callback
  return

task 'build-watch', (callback) ->
  runSequence 'clean', ['webpack-server-test', 'webpack-server-demo', 'webpack-server-todomvc'], callback
  return

task 'default', ['build-watch']