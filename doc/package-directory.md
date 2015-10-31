# Domcom package directory hierarchy

  Below is the directory hierarchy of domcom package. They are ordered by their importance, the more important folders and files are put in the front.

  The folders (domcom/lib/, domcom/dist/test/, domcom/dist/demo/) are not expanded, they are just the generated javascript files from the coffee-script source files. They is not intended to be used in engineering, except being as a reference for the programer who prefer to javascript.

  The folders (domcom/static/, domcom/node_modules/ domcom/bower_modules/) are not expanded, because they are public libraries folder.

    domcom    ...................................  // the web framework to provide dom component
    |- src/   ...................................  // the coffee-script source code folder
    |  |- domcom.coffee    .......................  // the index file to enable require this folder as domcom package, include basic domcom and it's addon content
    |  |- domcom-basic.coffee    .................  // the index file to the basic domcom, does not include the addon content
    |  |- domcom-addon.coffee    ................  // the index file for addon modules: builtins, directives, etc.
    |  |- dc.coffee    ..........................  // the methods and properties which belong to dc directly
    |  |- config.coffee    ......................  // config file for dc
    |  |- util.coffee    ........................  // utilities for dc
    |  |- DomNode.coffee    .....................  // DomNode class, which provide an interface similar to jQuery for operating the dom node
    |  |- extend.coffee    ......................  // the extend function
    |  |- core/    ..............................  // the core implementation to domcom component
    |  |  |- instantiate.coffee    ..............  // convenient utilities to generate components, the same as "new ComponentX(...) "
    |  |  |- tag.coffee    ......................  // convenient utilities to generate Tag component, the same as "new Tag("tagName", ...)"
    |  |  |- property.coffee    .................  // some utilities to process Tag properties and events
    |  |  |- index.coffee    ....................  // the index file to enable requiring core/ folder
    |  |  |- base/    ...........................  // base classes and derived classes for domcom component
    |  |  |  |- component.coffee    .............  // Component base class for all component classes
    |  |  |  |- BaseComponent.coffee    .........  // BaseComponent base class  for all base component classes
    |  |  |  |- TransformComponent.coffee  ......  // TransformComponent base class  for all transform component classes
    |  |  |  |- List.coffee    ..................  // List base component class
    |  |  |  |- Tag.coffee    ...................  // Tag base component class for window.Element: document.createElement
    |  |  |  |- Text.coffee    ..................  // Text base component class for window.Text: document.createTextNode(text)
    |  |  |  |- Html.coffee    ..................  // Html base component class for generating dom nodes by setting innerHTML: node.innerHTML = text
    |  |  |  |- Comment.coffee    ...............  // Comment base component class for window.Comment: document.createComment(text)
    |  |  |  |- Nothing.coffee    ...............  // Nothing base component class, which won't genenate any dom node
    |  |  |  |- If.coffee    ....................  // If transform component class, new If(test, then_, else_)
    |  |  |  |- Case.coffee    ..................  // Case transform component class, new Case(test, hashMap, else_)
    |  |  |  |- Cond.coffee    ..................  // Cond transform component class, new Cond(testComponents, else_)
    |  |  |  |- Func.coffee    ..................  // Func transform component class, new Func(func)
    |  |  |  |- Each.coffee    ..................  // Each transform component class, new Each(items, itemFn, options)
    |  |  |  |- route.coffee    .................  // Route transform component class, route(routeList..., otherwise, baseIndex)
    |  |  |  |- Defer.coffee    .................  // Defer transform component class, new Defer(promise, fulfill, reject, init)
    |  |  |  |- isComponent.coffee    ...........  // check whether an item is a component, isComponent(item)
    |  |  |  |- toComponent.coffee    ...........  // convert anything to component, toComponent(item)
    |  |  |  \- index.coffee    .................  // the index file to enable requiring core/base/ folder
    |  |  |
    |  |- flow/    ..............................  // the utilities to generate reactive functions
    |  |  |- index.coffee    ....................  // some frequently used reative functions
    |  |  |- watch-list.coffee    ...............  // flow.watchEachList and flow.watchEachObject to play with Each component
    |  |  \- addon.coffee    ....................  // more reactive functions and utilities
    |  |
    |  |- directives/    ........................   // some bultin directive definitions
    |  |  |- show-hide.coffee    ................   // $show and $hide directives
    |  |  |- model.coffee    ....................   // $model directive
    |  |  |- bind.coffee     ....................   // $bind directive
    |  |  |- options.coffee    ..................   // $options directive
    |  |  |- splitter.coffee    .................   // $splitter directive
    |  |  |- blink.coffee    ....................   // $blink direcitve
    |  |  \- index.coffee    ....................   // the index file to enable requiring directives/ folder
    |  |
    |  |- builtins/    ..........................   // some bultin component definitions
    |  |  |- accordion.coffee    ................   // accordion implementation based on domcom
    |  |  |- triangle.coffee    ....................   // triangle icon by css in four directions
    |  |  |- autoWidthEdit.coffee    ............   // text input tag element which automatic changing its width according the inputed text
    |  |  |- combo.coffee    ....................   // two implementatinos for comboBox edit
    |  |  |- dialog.coffee    ...................   // a simple dialog implementation based on bootstrap css
    |  |  \- index.coffee    ....................   // the index file to enable requiring builtins/ folder
    |  |
    |- doc    ...................................   // document folder
    |  |- api-referenc  .........................   // API references
    |  |- class-hierachy.md   ...................   // class hierachy
    |  |- package-directory.md   ................   // package directory hierachy
    |  \- Chinese    ............................   // Chinese document
    |     |- README.CN.md    .......................// README for github and npm, in Chinese
    |     |- 介绍和辅导教程.md    ................. // introduction and tutorial (Chinese)
    |     |- 概念和原理.md  .....................   // Concepts and theory (Chinese)
    |     |- API参考.md  ........................   // API references (Chinese)
    |     |- 类层次参考.md  .....................   // class hierachy (Chinese)
    |     |- 目录结构.md  .......................   // package directory hierachy (Chinese)
    |     |- 文件夹和模块介绍.md  ...............   // introduction to folder and module (Chinese)
    |     |- 速查表.md  .........................   // cheatsheet (Chinese)
    |     |- 从React到Domcom.md  ................   // declaration to release (Chinese)
    |     |- 常问问题.md  .......................   // frequently asked questions (Chinese)
    |
    |- test/    .................................   // test folder
    |  |- mocha/    ..............................  // mocha test coffee-script folder
    |  |  |- test-accordion.coffee    ...........   // tests for accordion component
    |  |  |- test-base-component.coffee    ......   // tests for base component
    |  |  |- test-component.coffee    ...........   // tests for component
    |  |  |- test-component-event.coffee    .....   // tests for component, aka Component.on, Component.off, Component.emit
    |  |  |- test-for-demo.coffeev    ...........   // tests for some content in demo, including todoMVC, for debugging the demos
    |  |  |- test-dc.coffee    ..................   // tests for utilities which are direclty hooked on dc
    |  |  |- test-flow.coffee    ................   // tests for reactive functions in flow/
    |  |  |- test-event.coffee    ...............   // tests for event on Tag component
    |  |  |- test-if-case-func.coffee    ........   // tests for If, Case and Func component
    |  |  |- test-list-each.coffee    ...........   // tests for List, Each component
    |  |  |- test-directive.coffee    ...........   // tests for the directives
    |  |  |- test-property.coffee    ............   // tests for properties of Tag component
    |  |  |- test-ref-clone.coffee    ...........   // tests for references and clone to component
    |  |  |- test-route.coffee    ...............   // tests for Route component
    |  |  |- test-toString.coffee    ............   // tests toString of component classes
    |  |  |- test-util.coffee    ................   // tests for dc/util module
    |  |  |- helper.coffee    ...................   // some helper functions for testing
    |  |  \- index.coffee    ....................   // the index file for all tests, used in mocha-runner.html and mocha-runner-dist.html
    |  |
    |  |- mocha-runner.html    ..................   // mocha runner html for test, using webpack-hot-server
    |  |- mocha-runner-dist.html    .............   // mocha runner html for test, using the js fiels in dist/ folder
    |  |- 1.html    .............................   // just used as draft for trying html while developping
    |  |
    |- demo/    .................................   // demo folder
    |  |- todomvc/    ...........................   // todoMVC sample folder
    |  |  |- index.html    ......................   // todoMVC html page for webpack-server
    |  |  |- index-dist.html    .................   // todoMVC html page for distribution
    |  |  |- learn.json    ......................   // the learn.json file need by todoMVC site
    |  |  \- todomvc.coffee    ..................   // the all code for todoMVC app
    |  |
    |  |- app.css    ............................   // css for demo, used in index.html
    |  |- demo-accordion.coffee    ..............   // demo for accordion
    |  |- demo-auto-width-edit.coffee    ........   // demo for automatic width <input, type="text"> component
    |  |- demo-builtins.coffee    ...............   // demo for some builtins
    |  |- demo-controls.coffee    ...............   // demo for some controls
    |  |- demo-counter.coffee    ................   // demo for a simple counter
    |  |- demo-dialog.coffee    .................   // demo for a simple dialog
    |  |- demo-each.coffee    ...................   // demo for some each components
    |  |- demo-event.coffee    ..................   // demo for Tag event
    |  |- demo-if-component.coffee    ...........   // demo for If component
    |  |- demo-mount-unmount.coffee    ..........   // demofor mount/unmount component
    |  |- demo-show-hide.coffee    ..............   // demo for $show / $hide directives
    |  |- demo-splitter.coffee    ...............   // demo for $splitter directive
    |  |- demo-sum.coffee    ....................   // demo for sum
    |  |- demo-switch-1-2-3-4.coffee    .........   // demo for switch 1 2 3 4
    |  |- demo-text-model.coffee    .............   // demo text input with $model directive
    |  |- index.coffee    .......................   // the index file to start all demos
    |  |- index.html    .........................   // index.html for the demo, using webpack-hot-server
    |  \- index-dist.html    ....................   // index.html for the demo, using the code in dist/ folder
    |
    |- dist    ..................................  // distribution folder
    |  |- domcom.js    ..........................  // full domcom distribution, include basic domcom and addon, development version, in most time it's better to use this file
    |  |- domcom.min.js    ......................  // minified full domcom distribution, include basic domcom and addon, production version, in most time it's better to use this file
    |  |- domcom-basic.js    ....................  // basic domcom distribution, development version
    |  |- domcom-basic.min.js    ................  // minified basic domcom distribution, production version
    |  |- mocha-index.js    .....................  // the index file for tests based on mocha, using webpack-hot-server
    |  |- mocha-index.min.js    .................  // the index file for tests based on mocha, using the code in dist/ folder
    |  |- demo-index.js    ......................  // the index file for demos, using webpack-hot-server
    |  |- demo-index.min.js    ..................  // the index file for demos, using the code in dist/ folder
    |  |- todomvc.js    .........................  // the code for todoMVC, using webpack-hot-server
    |  |- todomvc.min.js    .....................  // the code for todoMVC, using the code in dist/ folder
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

