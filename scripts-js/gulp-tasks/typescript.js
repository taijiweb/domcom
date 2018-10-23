var CombineStream, compileTypescript, dest, from, logTime, shell, task, typescript;

({task, from, dest, CombineStream, logTime} = require("gulp-task-helper"));

shell = require('shelljs');

typescript = require('gulp-typescript');

compileTypescript = function(fromFiles, toFolder) {
  return from(fromFiles, {
    cache: 'coffee'
  }).pipelog(typescript({
    bare: true
  })).pipe(dest(toFolder));
};

task('typescript', function(cb) {
  //  streamList = []

  //  streamList.push compileTypescript('./src/**/*.coffee', './lib')
  //  below is just for who prefer to reading javascript
  //  streamList.push compileTypescript('./test/**/*.coffee', './dist/test')
  //  streamList.push compileTypescript('./demo/**/*.coffee', './dist/demo')

  //  combineStream = new CombineStream(streamList)
  //  combineStream.end -> logTime('finish compiling typescript')

  //  combineStream
  console.log('starting typescript');
  if (shell.exec('tsc ./**/*.ts').code !== 0) {
    shell.echo('Error: typescript compile failed');
    return shell.exit(1);
  } else {
    return console.log('finish typescript');
  }
});
