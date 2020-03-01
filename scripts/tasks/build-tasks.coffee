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

gulp.task 'dev', (callback) -> runSequence 'clean', 'wpserver', watchcb

gulp.task 'dist', (callback) -> runSequence 'clean','webpack-dist', callback
