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
eval("\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nvar allChecked, app, clearCompletedTodos, completedCount, editTodo, editingTodo, markAll, originalTodo, pluralize, remainingCount, removeTodo, reverted, saving, todoEditArea, todoFooter, todoHeader, toggleCompleted, view, viewStatusHash;\ndc.addReactProxy(window.React, window.ReactDOM, window.React.Component); //######################################################################################################################\n// store\n\nwindow.fetch = function () {\n  return JSON.parse(localStorage.getItem('todoApp') || '[]');\n};\n\nwindow.save = function (todos) {\n  return localStorage.setItem('todoApp', JSON.stringify(todos));\n}; //######################################################################################################################\n// model\n// [ { title: string, completed: boolean } ... ]\n\n\nwindow.todos = [];\nwindow.todos = fetch(); //######################################################################################################################\n// controller\n\nviewStatusHash = null;\neditingTodo = {\n  title: '',\n  completed: false\n};\noriginalTodo = null;\nreverted = null;\nsaving = false;\n\nwindow.getTodos = function () {\n  if (viewStatusHash === 'active') {\n    return todos.filter(function (todo) {\n      return todo && !todo.completed;\n    });\n  } else if (viewStatusHash === 'completed') {\n    return todos.filter(function (todo) {\n      return todo && todo.completed;\n    });\n  } else {\n    return todos;\n  }\n};\n\nremainingCount = function remainingCount() {\n  return todos.filter(function (todo) {\n    return !todo.completed;\n  }).length;\n};\n\ncompletedCount = function completedCount() {\n  return todos.length - remainingCount();\n};\n\nallChecked = function allChecked() {\n  return !remainingCount();\n};\n\npluralize = function pluralize(test, item) {\n  if (test > 1) {\n    return item + 's';\n  } else {\n    return item;\n  }\n};\n\ntoggleCompleted = function toggleCompleted(todo) {\n  todo.completed = !todo.completed;\n  save(todos);\n  return app.update();\n};\n\nmarkAll = function markAll() {\n  var completed, j, len, todo, valid;\n\n  if (allChecked()) {\n    completed = false;\n  } else {\n    completed = true;\n  }\n\n  valid = true;\n\n  for (j = 0, len = todos.length; j < len; j++) {\n    todo = todos[j];\n\n    if (todo.completed !== completed) {\n      todo.completed = completed;\n      valid = false;\n    }\n  }\n\n  if (!valid) {\n    save(todos);\n    return app.update();\n  }\n};\n\neditTodo = function editTodo(todo) {\n  editingTodo = todo;\n  originalTodo = Object.assign({}, todo);\n  return app.update();\n};\n\nremoveTodo = function removeTodo(todo) {\n  var index;\n  index = todos.indexOf(todo);\n  todos.splice(index, 1);\n  save(todos);\n  return app.update();\n};\n\nclearCompletedTodos = function clearCompletedTodos() {\n  var i, valid;\n  valid = true;\n  i = todos.length - 1;\n\n  while (i >= 0) {\n    if (todos[i].completed) {\n      todos.splice(i, 1);\n      valid = false;\n    }\n\n    i--;\n  }\n\n  if (!valid) {\n    save(todos);\n    return app.update();\n  }\n}; //######################################################################################################################\n// view\n\n\ntodoHeader = function todoHeader() {\n  var onBlur, onChange, onKeyUp;\n\n  onKeyUp = function onKeyUp(event) {\n    var keyCode, value;\n    console.log('onBlur todos: ', todos);\n    keyCode = event.keyCode || event.which;\n\n    if (keyCode === 27) {\n      editingTodo = {\n        title: '',\n        completed: false\n      };\n    } else if (keyCode === 13) {\n      editingTodo.title = value = event.target.value;\n\n      if (!value) {\n        return;\n      } else {\n        todos.push(editingTodo);\n        editingTodo = {\n          title: '',\n          completed: false\n        };\n        save(todos);\n      }\n    }\n\n    return app.update();\n  };\n\n  onBlur = function onBlur(event) {\n    var node, value;\n    console.log('onBlur todos: ', todos);\n    debugger;\n    node = event.target;\n    value = node.value;\n    editingTodo.title = value;\n\n    if (!value) {} else {\n      todos.push(editingTodo);\n      editingTodo = {\n        title: '',\n        completed: false\n      };\n      save(todos);\n      app.update();\n    }\n  };\n\n  onChange = function onChange(event) {\n    var node, value;\n    node = event.target;\n    value = node.value;\n    editingTodo.title = value;\n    app.update();\n  };\n\n  return ['header#header', {\n    key: 1\n  }, ['h1', \"todos\"], ['text#new-todo', {\n    value: editingTodo.title,\n    onChange: onChange,\n    onBlur: onBlur,\n    onKeyUp: onKeyUp,\n    key: 2,\n    focusid: 1\n  }]];\n};\n\ntodoEditArea = function todoEditArea() {\n  var todoItems, todos;\n  todos = getTodos();\n  todoItems = todos.map(function (todo, index) {\n    var if_, onBlur, onChange, onFocus, onKeyUp, onToggle;\n\n    onChange = function onChange(event) {\n      todo.title = event.target.value;\n      return app.update();\n    };\n\n    onBlur = function onBlur(event) {\n      todo.title = event.target.value;\n      save(todos);\n      editingTodo = {};\n      return app.update();\n    };\n\n    onFocus = function onFocus() {\n      return todo = editingTodo;\n    };\n\n    onKeyUp = function onKeyUp(event) {\n      var keyCode;\n      keyCode = event.keyCode || event.which;\n\n      if (keyCode === 27) {\n        todos[todos.indexOf(todo)] = editingTodo = originalTodo;\n      } else if (keyCode === 13) {\n        save(todos);\n        editingTodo = {\n          title: '',\n          completed: false\n        };\n      }\n\n      return app.update();\n    };\n\n    onToggle = function onToggle() {\n      return toggleCompleted(todo);\n    };\n\n    if_ = function if_(x, y, z) {\n      if (x) {\n        return y;\n      } else {\n        return z;\n      }\n    };\n\n    return ['li', {\n      className: {\n        completed: todo.completed,\n        editing: todo === editingTodo,\n        key: 5\n      },\n      onDoubleClick: function onDoubleClick() {\n        return editTodo(todo);\n      }\n    }, ['div#view', ['checkbox.toggle', {\n      checked: todo.completed,\n      onChange: onToggle,\n      key: 1000 + index\n    }], [if_, todo !== editingTodo, ['label', todo.title], ['text.edit', {\n      trim: 'false',\n      value: todo.title,\n      onBlur: onBlur,\n      onChange: onChange,\n      onFocus: onFocus,\n      onKeyUp: onKeyUp,\n      focusid: 100 + index\n    }]], ['button.destroy##float:right', {\n      onClick: function onClick() {\n        return removeTodo(todo);\n      }\n    }, 'x']]];\n  });\n  return ['section#main', ['checkbox.toggle#toggle-all', {\n    key: 6,\n    checked: !!allChecked(),\n    onChange: markAll\n  }], ['label##display:inline-block;', {\n    htmlFor: \"toggle-all\"\n  }, \"Mark all as complete\"], [\"ul#todo-list\"].concat(_toConsumableArray(todoItems)), [\"footer#footer\", {\n    $show: !!todos.length\n  }, [\"span#todo-count\", ['strong', remainingCount()], pluralize(remainingCount(), ' item'), ' left'], [\"ul#filters\", ['li', ['a', {\n    className: {\n      selected: viewStatusHash !== 'active' && viewStatusHash !== 'completed'\n    },\n    href: \"#/all\"\n  }, \"All\"]], ['li', ['a', {\n    className: {\n      selected: viewStatusHash === 'active'\n    },\n    href: \"#/active\"\n  }, \"Active\"]], ['li', ['a', {\n    className: {\n      selected: viewStatusHash === 'completed'\n    },\n    href: \"#/completed\"\n  }, \"Completed\"]]]], ['button#clear-completed', {\n    onClick: clearCompletedTodos,\n    $show: !!completedCount()\n  }, \"Clear completed: \" + completedCount()]];\n};\n\ntodoFooter = ['footer#info', {\n  key: 100\n}, ['p', \"Double-click to edit a todo\"], ['p', 'Created by ', ['a', {\n  href: \"http://github.com/taijiweb/domcom\"\n}, 'Caoxingming(Tiijizhenren, simeon.chaos@gmail.com)']], ['p', \"Part of \", ['a', {\n  href: \"http://todomvc.com\"\n}, \" TodoMVC\"]]];\n\nview = function view() {\n  return ['section#todoapp', {\n    key: 0\n  }, todoHeader(), todoEditArea(), todoFooter];\n};\n\napp = dc({\n  view: view\n});\n\nwindow.updateHash = function () {\n  var locationHash;\n  locationHash = document.location.hash;\n\n  if (locationHash.indexOf('/') >= 0) {\n    return viewStatusHash = locationHash.split('/')[1] || '';\n  } else {\n    return viewStatusHash = locationHash;\n  }\n}; //######################################################################################################################\n// run the app\n\n\nwindow.runTodoMvc = function () {\n  updateHash();\n  app.mount('#todo-app');\n  return window.addEventListener('hashchange', function () {\n    updateHash();\n    return app.update();\n  });\n};\n\n//# sourceURL=webpack:///./demo/coffee/todomvc.coffee?");

/***/ })

/******/ });