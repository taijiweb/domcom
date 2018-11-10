path = require('path')
gulp = require('gulp')
gutil = require('gulp-util')

changed = require('gulp-changed')
cache = require('gulp-cached')
plumber = require('gulp-plumber')

del = require('del')

mocha = require('gulp-mocha')

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

coffee = require('gulp-coffee')

task 'coffee', (cb) ->
  from(['index.coffee', 'test-util.coffee'], {cache:'coffee'}).pipelog(coffee({bare: true})).pipe(dest('./'))

onErrorContinue = (err) -> console.log(err.stack); @emit 'end'
task 'mocha', ->  src('test-*.js').pipe(mocha({reporter: 'spec'})).on("error", onErrorContinue)

task 'default', ['coffee', 'mocha']