//this should be a js file, because it should NOT depend on coffee or gulp self.

var gulp = require('gulp');
var gutil = require('gulp-util');

exports.gulp = gulp;
exports.gutil = gutil;
exports.watch = gulp.watch;

var changed = require('gulp-changed');
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');

exports.task = gulp.task.bind(gulp);

exports.xtask = function () {};

var src = exports.src = gulp.src.bind(gulp);

var from = exports.from = function (source, options) {
    "use strict";

    options = options || {dest:'app', cache:'cache'};

    options.dest = options.dest || 'app';
    options.cache = options.cache || 'cache';

    // return src(source).pipe(changed(options.dest)).pipe(plumber())
    return src(source).pipe(changed(options.dest)).pipe(cache(options.cache)).pipe(plumber());
};

var dest = exports.dest = gulp.dest.bind(gulp);

var FromStream = from('').constructor;

FromStream.prototype.to = function (dst) {
    "use strict";

    return this.pipe(dest(dst));
};

FromStream.prototype.pipelog = function (obj, log){
    "use strict";

    log = log || gutil.log;
    return this.pipe(obj).on('error', log);
};

exports.CombineStream = require("combine-stream");

exports.logTime = function (msg) {
    "use strict";

    var t = new Date();

    console.log("["+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+": " + msg);
};

