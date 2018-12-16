gulp = require 'gulp'

watchcb = ->
    gulp.watch([
        './src/**/*.coffee',
        './scripts-coffee/**/*.coffee', 
        './test/coffee/**/*.coffee', 
        './demo/coffee/**/*.coffee'
        ],
        ['coffee'])
runSequence  = require 'run-sequence'

gulp.task 'js', (callback) -> runSequence 'clean', 'coffee', callback

gulp.task 'dev', (callback) -> runSequence 'clean', 'webpack-server', watchcb

gulp.task 'dist', (callback) -> runSequence 'clean', 'coffee','webpack-dist', callback
