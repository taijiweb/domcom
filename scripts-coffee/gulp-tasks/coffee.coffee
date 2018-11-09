gulp = require 'gulp'
{task, from, dest, CombineStream, logTime} = require "gulp-task-helper"

coffee = require ('gulp-coffee2')

compileCoffee  = (fromFiles, toFolder) ->
  from(fromFiles, {cache:'coffee'}).pipelog(coffee({bare: true})).pipe(dest(toFolder))

gulp.task 'coffee', (cb) ->
  streamList = []

  streamList.push compileCoffee('./src/**/*.coffee', './lib')
  # below is just for who prefer to reading javascript
  streamList.push compileCoffee('./scripts-coffee/**/*.coffee', './scripts-js')
  streamList.push compileCoffee('./test/coffee/**/*.coffee', './test/js')
  streamList.push compileCoffee('./demo/coffee/**/*.coffee', './demo/js')

  combineStream = new CombineStream(streamList)
  #combineStream.end -> logTime('finish coffee')

  combineStream



