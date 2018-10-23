var domcomEntry, gulp, logTime, makeConfig, makeWebpackDevServer, onTaskDone, runWebPack, webpack, webpackDistribute;

gulp = require('gulp');

({logTime} = require("gulp-task-helper"));

webpack = require('webpack');

({makeConfig, makeWebpackDevServer} = require('../webpack-config'));

onTaskDone = function() {
  return function(err, stats) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(stats.toString());
    }
    logTime("finished 'webpack'");
  };
};

webpack = require("webpack");

//ClosureCompilerPlugin = require('webpack-closure-compiler')
domcomEntry = {
  'domcom': './lib/domcom'
};

runWebPack = function(entry, filename, options) {
  var config, webpackCompiler;
  config = makeConfig(entry, filename, options);
  webpackCompiler = webpack(config);
  return webpackCompiler.run(onTaskDone());
};

webpackDistribute = function(mode) {
  var plugins;
  plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {}
    })
  ];
  runWebPack(domcomEntry, '[name].js', {
    path: '../dist',
    pathinfo: true,
    libraryTarget: 'umd',
    library: 'dc',
    plugins
  });
  runWebPack('./test/js/index', 'test.js', {
    path: '../dist',
    pathinfo: true,
    plugins
  });
  runWebPack('./demo/js/index', 'demo.js', {
    path: '../dist',
    pathinfo: true,
    plugins
  });
  runWebPack('./demo/js/todomvc', 'todomvc.js', {
    path: '../dist',
    pathinfo: true,
    plugins
  });
  if (mode === 'dist') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true
    }));
    return runWebPack(domcomEntry, '[name].min.js', {
      path: '../dist',
      pathinfo: false,
      libraryTarget: 'umd',
      library: 'dc',
      plugins
    });
  }
};

gulp.task('webpack-dist', function() {
  return webpackDistribute('dist');
});

gulp.task('webpack-dev', function() {
  return webpackDistribute('dev');
});

gulp.task('webpack-server', function() {
  var webServerPlugins;
  webServerPlugins = [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin()];
  makeWebpackDevServer(["webpack/hot/dev-server", './lib/domcom'], 'domcom.js', {
    port: 8083,
    inline: true,
    plugins: webServerPlugins
  });
  makeWebpackDevServer(["webpack/hot/dev-server", './test/js/index'], 'test.js', {
    port: 8088,
    plugins: webServerPlugins
  });
  makeWebpackDevServer(["webpack/hot/dev-server", './demo/js/index'], 'demo.js', {
    port: 8089,
    plugins: webServerPlugins
  });
  return makeWebpackDevServer(["webpack/hot/dev-server", './demo/js/todomvc'], 'todomvc.js', {
    port: 8090,
    plugins: webServerPlugins
  });
});
