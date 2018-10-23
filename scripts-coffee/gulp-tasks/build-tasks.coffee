gulp = require 'gulp'

runSequence = require('run-sequence')

gulp.task 'js', (callback) -> runSequence 'clean', 'coffee', callback

gulp.task 'dev', (callback) -> runSequence 'clean', 'remove', 'coffee', 'webpack-server', callback

gulp.task 'dist', (callback) -> runSequence 'clean', 'remove', 'coffee', 'remove', 'webpack-dist', callback
