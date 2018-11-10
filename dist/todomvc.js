/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo/coffee/todomvc.coffee");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/coffee/todomvc.coffee":
/*!************************************!*\
  !*** ./demo/coffee/todomvc.coffee ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar a, allChecked, bind, button, checkbox, clearCompletedTodos, completedCount, div, editTodo, editingTodo, footer, form, funcEach, h1, header, label, li, markAll, onEscapeFn, originalTodo, p, pluralize, remainingCount, removeTodo, revertEdits, reverted, saving, section, span, strong, text, text1, todoEditArea, todoFooter, todoHeader, todoItems, toggleCompleted, txt, ul, view, viewStatusHash;\nvar _dc = dc;\nbind = _dc.bind;\nsection = _dc.section;\nh1 = _dc.h1;\nheader = _dc.header;\nform = _dc.form;\ntext = _dc.text;\ncheckbox = _dc.checkbox;\ndiv = _dc.div;\nul = _dc.ul;\nli = _dc.li;\np = _dc.p;\na = _dc.a;\nlabel = _dc.label;\nbutton = _dc.button;\nfooter = _dc.footer;\nstrong = _dc.strong;\nspan = _dc.span;\nfuncEach = _dc.funcEach;\ntxt = _dc.txt;\ndc.directive({\n  $show: dc.$show\n});\ndc.alwaysRender = true; //######################################################################################################################\n// store\n\nwindow.fetch = function () {\n  return JSON.parse(localStorage.getItem('view') || '[]');\n};\n\nwindow.save = function (todos) {\n  return localStorage.setItem('view', JSON.stringify(todos));\n}; //######################################################################################################################\n// model\n// [ { title: string, completed: boolean } ... ]\n\n\nwindow.todos = [];\nwindow.todos = fetch(); //######################################################################################################################\n// controller\n\nviewStatusHash = null;\neditingTodo = null;\noriginalTodo = null;\nreverted = null;\nsaving = false;\n\nwindow.getTodos = function () {\n  if (viewStatusHash === 'active') {\n    return todos.filter(function (todo) {\n      return todo && !todo.completed;\n    });\n  } else if (viewStatusHash === 'completed') {\n    return todos.filter(function (todo) {\n      return todo && todo.completed;\n    });\n  } else {\n    return todos;\n  }\n};\n\nremainingCount = function remainingCount() {\n  return todos.filter(function (todo) {\n    return !todo.completed;\n  }).length;\n};\n\ncompletedCount = function completedCount() {\n  return todos.length - remainingCount();\n};\n\nallChecked = function allChecked() {\n  return !remainingCount();\n};\n\nonEscapeFn = function onEscapeFn(fn) {\n  return function (event) {\n    if (event.keyCode === 27 || event.which === 27) {\n      return fn();\n    }\n  };\n};\n\npluralize = function pluralize(test, item) {\n  if (typeof test === 'function') {\n    return txt(function () {\n      if (test() > 1) {\n        return item + 's';\n      } else {\n        return item;\n      }\n    });\n  } else if (test > 1) {\n    return txt(item + 's');\n  } else {\n    return txt(item);\n  }\n};\n\ntoggleCompleted = function toggleCompleted(todo) {\n  todo.completed = !todo.completed;\n  save(todos);\n  view.render();\n  return dc.clean();\n};\n\nmarkAll = function markAll() {\n  var completed, j, len, todo, valid;\n\n  if (allChecked()) {\n    completed = false;\n  } else {\n    completed = true;\n  }\n\n  valid = true;\n\n  for (j = 0, len = todos.length; j < len; j++) {\n    todo = todos[j];\n\n    if (todo.completed !== completed) {\n      todo.completed = completed;\n      valid = false;\n    }\n  }\n\n  if (!valid) {\n    save(todos);\n    view.render();\n    return dc.clean();\n  }\n};\n\neditTodo = function editTodo(todo) {\n  editingTodo = todo;\n  originalTodo = Object.assign({}, todo);\n  view.render();\n  return dc.clean();\n};\n\nremoveTodo = function removeTodo(todo) {\n  var index;\n  index = todos.indexOf(todo);\n  todos.splice(index, 1);\n  save(todos);\n  view.render();\n  return dc.clean();\n};\n\nrevertEdits = function revertEdits(todo) {\n  todos[todos.indexOf(todo)] = originalTodo;\n  view.render();\n  return dc.clean();\n};\n\nclearCompletedTodos = function clearCompletedTodos() {\n  var i, valid;\n  valid = true;\n  i = todos.length - 1;\n\n  while (i >= 0) {\n    if (todos[i].completed) {\n      todos.splice(i, 1);\n      valid = false;\n    }\n\n    i--;\n  }\n\n  if (!valid) {\n    save(todos);\n    view.render();\n    return dc.clean();\n  }\n}; //######################################################################################################################\n// view\n\n\ntext1 = text({\n  id: \"new-todo\",\n  placeholder: \"What needs to be done?\",\n  disable: function disable() {\n    return saving;\n  },\n  onchange: function onchange(event, node) {\n    if (!node.value) {\n      return;\n    }\n\n    todos.push({\n      title: node.value,\n      completed: false\n    });\n    save(todos);\n    view.render();\n    return dc.clean();\n  },\n  autofocus: true\n});\ntodoHeader = header({\n  id: \"header\"\n}, h1(\"todos\"), form({\n  id: \"todo-form\"\n}, text1));\ntodoItems = funcEach(getTodos, function (todo, index) {\n  return li({\n    className: {\n      completed: function completed() {\n        return todo.completed;\n      },\n      editing: function editing() {\n        return todo === editingTodo;\n      }\n    }\n  }, div({\n    class: \"view\"\n  }, checkbox({\n    className: \"toggle\",\n    checked: function checked() {\n      return todo && todo.completed;\n    },\n    onchange: function onchange() {\n      return toggleCompleted(todo);\n    }\n  }), label({\n    ondblclick: function ondblclick() {\n      return editTodo(todo);\n    }\n  }, function () {\n    return todo && todo.title;\n  }), button({\n    className: \"destroy\",\n    onclick: function onclick() {\n      return removeTodo(todo);\n    }\n  })), form({\n    submit: function submit() {\n      return save(todos);\n    }\n  }, text({\n    className: \"edit\",\n    trim: \"false\",\n    value: bind(todo, \"title\"),\n    onblur: function onblur(event, node) {\n      todo.title = node.value;\n      save(todos);\n      editingTodo = null;\n      view.render();\n      return dc.clean();\n    },\n    onfocus: function onfocus() {\n      return todo === editingTodo;\n    },\n    onkeyup: onEscapeFn(function () {\n      return revertEdits(todo);\n    })\n  })));\n});\ntodoEditArea = section({\n  id: \"main\"\n}, checkbox({\n  id: \"toggle-all\",\n  className: \"toggle\",\n  checked: function checked() {\n    return !!allChecked();\n  },\n  onclick: markAll\n}), label({\n  \"for\": \"toggle-all\"\n}, \"Mark all as complete\"), ul({\n  id: \"todo-list\"\n}, todoItems), footer({\n  id: \"footer\",\n  $show: function $show() {\n    return todos.length;\n  }\n}, span({\n  id: \"todo-count\"\n}, strong(remainingCount), pluralize(remainingCount, ' item'), ' left'), ul({\n  id: \"filters\"\n}, li(a({\n  className: {\n    selected: function selected() {\n      return viewStatusHash !== 'active' && viewStatusHash !== 'completed';\n    }\n  },\n  href: \"#/all\"\n}, \"All\")), li(a({\n  className: {\n    selected: function selected() {\n      return viewStatusHash === 'active';\n    }\n  },\n  href: \"#/active\"\n}, \"Active\")), li(a({\n  className: {\n    selected: function selected() {\n      return viewStatusHash === 'completed';\n    }\n  },\n  href: \"#/completed\"\n}, \"Completed\"))), button({\n  id: \"clear-completed\",\n  onclick: clearCompletedTodos,\n  $show: completedCount\n}, txt(function () {\n  return \"Clear completed: \" + completedCount();\n}))));\ntodoFooter = footer({\n  id: \"info\"\n}, p(\"Double-click to edit a todo\"), p('Created by ', a({\n  href: \"http://github.com/taijiweb/domcom\"\n}, 'Caoxingming(Tiijizhenren, simeon.chaos@gmail.com)')), p(\"Part of \", a({\n  href: \"http://todomvc.com\"\n}, \" TodoMVC\")));\nview = section({\n  id: \"todoapp\"\n}, todoHeader, todoEditArea, todoFooter);\n\nwindow.updateHash = function () {\n  var locationHash;\n  locationHash = document.location.hash;\n\n  if (locationHash.indexOf('/') >= 0) {\n    return viewStatusHash = locationHash.split('/')[1] || '';\n  } else {\n    return viewStatusHash = locationHash;\n  }\n}; //######################################################################################################################\n// run the app\n\n\nwindow.runTodoMvc = function () {\n  updateHash();\n  view.mount('#todo-app');\n  return window.addEventListener('hashchange', function () {\n    updateHash();\n    view.render();\n    return dc.clean();\n  });\n};\n\n//# sourceURL=webpack:///./demo/coffee/todomvc.coffee?");

/***/ })

/******/ });