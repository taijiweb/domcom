path = require('path')
gulp = require('gulp')
gutil = require 'gulp-util'

minimist = require('minimist')
argv = minimist(process.argv.slice(2))

runSequence = require('run-sequence')

changed = require('gulp-changed')
cache = require('gulp-cached')
plumber = require('gulp-plumber')

del = require('del')

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

task 'clean', (cb) -> del(['dist', 'lib'], cb)

logTime = (msg) ->
  t = new Date()
  console.log("[#{t.getHours()}:#{t.getMinutes()}:#{t.getSeconds()}]: "+msg)

coffee = require 'gulp-coffee'

task 'coffee', (cb) ->
  from(['./src/**/*.coffee'], {cache:'coffee'}).pipelog(coffee({bare: true})).pipe(dest('./lib'))

webpack = require 'webpack'
{makeConfig, makeWebpackDevServer} = require './webpack.config'

onTaskDone = () -> (err, stats) ->
  if err then console.log('Error', err)
  #else  console.log(stats.toString())
  logTime("finished 'webpack'")
  #done and done()
  return

webpack = require("webpack")
ClosureCompilerPlugin = require('webpack-closure-compiler')

domcomEntry = {
  'domcom': './src/index',
  'domcom-addon': './src/domcom-addon'
  'domcom-full': './scr/domcom-full'
}

webpackDistribute = (mode) ->
  plugins = [new webpack.optimize.UglifyJsPlugin({minimize: true})]
  #plugins = [new ClosureCompilerPlugin()]
  config = makeConfig(domcomEntry, '[name].min.js', {path:'dist', pathinfo:false, libraryTarget:'umd', library:'dc', plugins})
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone()
  pathinfo = mode=='dev'
  if mode=='dev' then plugins = []
  config = makeConfig(domcomEntry, '[name].js', {path:'dist', pathinfo:pathinfo, libraryTarget:'umd', library:'dc', plugins})
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone()
  config = makeConfig('./test/mocha/index', 'mocha-index.js', {path:'dist', pathinfo:pathinfo, plugins})
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone()
  config = makeConfig('./demo/index', 'demo-index.js', {path:'dist', pathinfo:pathinfo, plugins})
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone()
  config = makeConfig('./demo/todomvc/todomvc', 'todomvc.js', {path:'dist', pathinfo:pathinfo, plugins})
  webpackCompiler = webpack(config)
  webpackCompiler.run onTaskDone()

task 'webpack-dist', () -> webpackDistribute('dist')
task 'webpack-dev', () -> webpackDistribute('dev')

task 'webpack-server', ->
  webServerPlugins = [
    new webpack.HotModuleReplacementPlugin()
    new webpack.NoErrorsPlugin()
  ]
  makeWebpackDevServer(["webpack/hot/dev-server", './src/index'], 'domcom.js', {port:8083, inline:true, plugins:webServerPlugins})
  makeWebpackDevServer(["webpack/hot/dev-server", './src/domcom-addon'], 'domcom-addon.js', {port:8084, inline:true, plugins:webServerPlugins})
  makeWebpackDevServer(["webpack/hot/dev-server", './src/domcom-full'], 'domcom-full.js', {port:8085, inline:true, plugins:webServerPlugins})
  makeWebpackDevServer(["webpack/hot/dev-server", './test/mocha/index'], 'mocha-index.js', {port:8088, plugins:webServerPlugins})
  makeWebpackDevServer(["webpack/hot/dev-server", './demo/index'], 'demo-index.js', {port:8089, plugins:webServerPlugins})
  makeWebpackDevServer(["webpack/hot/dev-server", './demo/todomvc/todomvc'], 'todomvc.js', {port:8087, plugins:webServerPlugins})

release = require('gulp-github-release');

release = require('gulp-github-release')
task 'release', ->
  src('./dist/*.*').pipe(release({
    token: '623bced92b33d0f08ebc9d54e041edd805183706',  # or you can set an env var called GITHUB_TOKEN instead
    owner: 'taijiweb',                    # if missing, it will be extracted from manifest (the repository.url field)
    repo: 'domcom',            # if missing, it will be extracted from manifest (the repository.url field)
    tag: 'v0.0.2',                      # if missing, the version will be extracted from manifest and prepended by a 'v'
    name: 'domcom v0.0.2',     # if missing, it will be the same as the tag
    notes: 'the web framework to provide dom component',                # if missing it will be left undefined
    draft: false,                       # if missing it's false
    prerelease: false,                  # if missing it's false
    manifest: require('./package.json') # package.json from which default values will be extracted if they're missing
  }))

task 'dev', (callback) -> runSequence 'clean', 'webpack-dev', callback
task 'dist', (callback) -> runSequence 'clean', 'webpack-dist', 'coffee', callback
task 'default', ['webpack-server']