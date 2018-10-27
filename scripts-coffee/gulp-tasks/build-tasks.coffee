gulp = require 'gulp'

watchcb = ->
    console.log('gulp is watching coffee...')
    gulp.watch([
        './src/**/*.coffee',
        './scripts-coffee/**/*.coffee', 
        './test/coffee/**/*.coffee', 
        './demo/coffee/**/*.coffee'
        ],
        ['coffee'])
runSequence = require('run-sequence')

gulp.task 'js', (callback) -> runSequence 'clean', 'coffee', callback

gulp.task 'dev', (callback) -> runSequence 'clean', 'remove', 'coffee', 'webpack-server', watchcb

gulp.task 'dist', (callback) -> runSequence 'clean', 'remove', 'coffee', 'remove', 'webpack-dist', callback
