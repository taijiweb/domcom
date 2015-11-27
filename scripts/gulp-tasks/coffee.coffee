{task, from, dest, CombineStream, logTime} = require("gulp-task-helper")

coffee = require ('gulp-coffee')

compileCoffee  = (fromFiles, toFolder) ->
  from(fromFiles, {cache:'coffee'}).pipelog(coffee({bare: true})).pipe(dest(toFolder))

task 'coffee', (cb) ->
  streamList = []

  streamList.push compileCoffee('./src/**/*.coffee', './lib')
  # below is just for who prefer to reading javascript
  streamList.push compileCoffee('./test/**/*.coffee', './dist/test')
  streamList.push compileCoffee('./demo/**/*.coffee', './dist/demo')

  combineStream = new CombineStream(streamList)
  #combineStream.end -> logTime('finish coffee')

  combineStream
