# Domcom package directory hierarchy

  Below is the directory hierarchy of domcom package. They are ordered by their importance, the more important folders and files are put in the front.

  The folders (domcom/lib/, domcom/dist/test/, domcom/dist/demo/) are not expanded, they are just the generated javascript files from the coffee-script source files. They is not intended to be used in engineering, except being as a reference for the programer who prefer to javascript.

  The folders (domcom/static/, domcom/node_modules/ domcom/bower_modules/) are not expanded, because they are public libraries folder.

    domcom    ...................................  // the web framework to provide dom component
    |- src/   ...................................  // the coffee-script source code folder
    |  |- domcom.coffee    ......................  // the index file to enable require this folder as domcom package
    |  |- dc.coffee    ..........................  // the methods and properties which belong to dc directly
    |  |- dc-render.coffee    ...................  // render method properties for dc
    |  |- dc-util.coffee    .....................  // some utilties for domcom
    |  |                                             (UPDATE: has been moved to the npm package dc-util, and imported to domcom)
    |  |
    |- doc    ...................................  // document folder
    |  |- api-reference.md  .....................  // API references(English)
    |  |- api-type-description.md  ..............  // type description for API references(English)
    |  |- class-hierarchy.md   ..................  // class hierarchy(English)
    |  |- package-directory.md   ................  // package directory hierarchy(English)
    |  \- Chinese    ............................  // Chinese document
    |     |- README.CN.md    ....................  // README for github and npm, in Chinese
    |     |- 介绍和辅导教程.md    .................  // introduction and tutorial (Chinese)
    |     |- 概念和原理.md  ......................   // Concepts and theory (Chinese)
    |     |- API参考.md  ........................   // API references (Chinese)
    |     |- 目录结构.md  ........................   // package directory hierarchy (Chinese)
    |     |- 文件夹和模块介绍.md  ..................  // introduction to folder and module (Chinese)
    |     |- 速查表.md  ..........................  // cheatsheet (Chinese)
    |     |- 从React到Domcom.md  .................  // declaration to release (Chinese)
    |     |- 常问问题.md  ........................   // frequently asked questions (Chinese)
    |
    |- test/    .................................   // test folder
    |  |- mocha-runner.html    ..................   // mocha runner html for test, using webpack-hot-server
    |  |- mocha-runner-dist.html    .............   // mocha runner html for test, using the js fiels in dist/ folder
    |  |- mocha-test.css    .....................   // css for mocha test
    |  |
    |- demo/    .................................   // demo folder
    |  |  |- index.html    ......................   // todoMVC html page for webpack-server
    |  |  |- index-dist.html    .................   // todoMVC html page for distribution
    |  |  |- learn.json    ......................   // the learn.json file need by todoMVC site
    |  |
    |  |- app.css    ............................   // css for demo, used in index.html
    |  |- demo-controls.coffee    ...............   // demo for some controls
    |  |- demo-counter.coffee    ................   // demo for a simple counter
    |  |- demo-show-hide.coffee    ..............   // demo for $show / $hide directives
    |  |- demo-sum.coffee    ....................   // demo for sum
    |  |- demo-text-model.coffee    .............   // demo text input with $model directive
    |  |- util.coffee   .........................   // some utilities for demos
    |  |- index.coffee    .......................   // the index file to start all demos
    |  |- index.html    .........................   // index.html for the demo, using webpack-hot-server
    |  \- index-dist.html    ....................   // index.html for the demo, using the code in dist/ folder
    |
    |- dist    ..................................  // distribution folder
    |  |- domcom.js    ..........................  // full domcom distribution, include basic domcom and addon, development version, in most time it's better to use this file
    |  |- domcom.min.js    ......................  // minified full domcom distribution, include basic domcom and addon, production version, in most time it's better to use this file
    |  |- todomvc.js    .........................  // the code for todoMVC, using webpack-hot-server
    |  |- test/ .................................  // generated javascript files from domcom/test/ coffee-script files
    |  \- demo/ .................................  // generated javascript files from domcom/demo/ coffee-script files
    |
    |- lib/    ..................................  // generated javascript files from domcom/src/ coffee-script files
    |- static/    ...............................  // static library files for demonstration and testing, including bootstrap and sinon
    |
    |- README.md    .............................  // README for github and npm
    |- LICENSE    ...............................  // MIT LICENSE of domcom
    |- gulpfile.js    ...........................  // gulpfile, just require the gulpfile.coffee
    |- gulpfile.coffee    .......................  // gulpfile in coffee-script
    |- webpack.config.coffee    .................  // webpack.config.coffee, for webpack workflow
    |- package.json     .........................  // node_modules package json file for npm
    |- bower.json     ...........................  // bower json file for bower
    |- .bowerrc     .............................  // .bowerrc for bower, bower config file
    |- .gitattribute     ........................  // .gitattribute for git
    |- .gitignore     ...........................  // .gitignore for git, ignored files and folder
    |
    |- node_modules/    .........................  // node modules folder for npm package.json
    \- bower_components/    .....................  // bower components folder

