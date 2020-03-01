gulp = require 'gulp'
task = require("gulp-task-helper").task

rimraf = require 'rimraf'

gulp.task 'remove', (cb) ->
  rimraf('./src/**/*.js', ->)
  rimraf('./src/**/*.ts', ->)
  rimraf('./test/**/*.js', ->)
  rimraf('./test/**/*.ts', ->)
  rimraf('./demo/**/*.js', ->)
  rimraf('./demo/**/*.ts', ->)
  rimraf('./scripts/**/*.js', ->)
  rimraf('./scripts/**/*.ts', ->)
  cb()
