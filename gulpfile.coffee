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

do ->
  # set gulp target
  #argv.target = 'web'
  #argv.target = 'nw'
  if argv.d then argv.debug = true
  if argv.p then argv.production = true
  if argv.debug then argv.env = 'debug'
  if argv.stage then argv.env = 'stage'
  if argv.production then argv.env = 'production'
  if argv.w then argv.web = true
  if argv.n then argv.nw = true
  if argv.t then argv.test = true
  if argv.web and argv.nw and not argv.target then argv.target = 'web'
  else if not argv.web and not argv.nw and not argv.target then argv.target = 'web'
  console.log 'gulp target: '+argv.target

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
  done and done()
  return

# need live reload , so does not use webpack-dev-server
task 'webpack-dist', (done) ->
  entry = './src/client/web-app'
  config = makeConfig(entry, 'app.js')
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone(done)

task 'webpack-server-test', (done) ->
  entry = ["webpack/hot/dev-server", './test/mocha-phantomjs-index']
  makeWebpackDevServer(entry, 'mocha-phantomjs-index.js')

task 'webpack-server-demo', (done) ->
  entry = ["webpack/hot/dev-server", './demo/index']
  makeWebpackDevServer(entry, 'demo-index.js', {port:8082})

task 'webpack-server-todomvc', (done) ->
  entry = ["webpack/hot/dev-server", 'domcom/demo/todomvc/app']
  makeWebpackDevServer(entry, 'todomvc.js', {port:8086})

task 'build', (callback) ->
  runSequence 'clean', 'webpack-dist', callback
  return

task 'build-watch', (callback) ->
  runSequence 'clean', ['webpack-server-test', 'webpack-server-demo', 'webpack-server-todomvc'], callback
  return

task 'default', ['build-watch']