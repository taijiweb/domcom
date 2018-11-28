{task, from, dest, CombineStream, logTime} = require "gulp-task-helper"

shell = require 'shelljs'

typescript = require ('gulp-typescript')
compileTypescript  = (fromFiles, toFolder) ->
  from(fromFiles, {cache:'coffee'}).pipelog(typescript({bare: true})).pipe(dest(toFolder))

task 'typescript', (cb) ->
#  streamList = []

#  streamList.push compileTypescript('./src/**/*.coffee', './lib')
#  below is just for who prefer to reading javascript
#  streamList.push compileTypescript('./test/**/*.coffee', './dist/test')
#  streamList.push compileTypescript('./demo/**/*.coffee', './dist/demo')

#  combineStream = new CombineStream(streamList)
#  combineStream.end -> logTime('finish compiling typescript')

#  combineStream
  if (shell.exec('tsc ./**/*.ts').code != 0)
    shell.echo('Error: typescript compile failed')
    shell.exit(1)
  else
    console.log('finish typescript')