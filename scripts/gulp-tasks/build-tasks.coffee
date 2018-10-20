gulp = require 'gulp'

runSequence = require('run-sequence')

gulp.task 'dev', (callback) -> runSequence 'clean', 'webpack-dev', callback

gulp.task 'dist', (callback) -> runSequence 'clean', 'webpack-dist', 'coffee', callback
