var task, tsk, _i, _len, _ref;

task = require('gulp-task-helper').task;

_ref = 'clean coffee webpack build-tasks'.split(/\s+/);
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  tsk = _ref[_i];
  require('./scripts/gulp-tasks/' + tsk);
}

task('default', ['webpack-server']);
