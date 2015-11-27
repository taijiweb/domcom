var a, allChecked, bind, button, checkbox, clearCompletedTodos, completedCount, div, each, editTodo, editingTodo, extend, fetch, footer, form, getTodos, h1, header, label, li, markAll, onEscapeFn, originalTodo, p, pluralize, remainingCount, removeTodo, revertEdits, reverted, save, saving, section, setView, span, strong, text, todoEditArea, todoFooter, todoHeader, todoItems, todos, toggleCompleted, txt, ul, view, viewStatusHash;

bind = dc.bind, section = dc.section, h1 = dc.h1, header = dc.header, form = dc.form, text = dc.text, checkbox = dc.checkbox, div = dc.div, ul = dc.ul, li = dc.li, p = dc.p, a = dc.a, label = dc.label, button = dc.button, footer = dc.footer, strong = dc.strong, span = dc.span, each = dc.each, txt = dc.txt, extend = dc.extend;

dc.directives({
  $show: dc.$show
});

fetch = function() {
  return JSON.parse(localStorage.getItem('dc') || '[]');
};

save = function(todos) {
  return localStorage.setItem('dc', JSON.stringify(todos));
};

todos = [];

viewStatusHash = null;

editingTodo = null;

originalTodo = null;

reverted = null;

saving = false;

getTodos = function() {
  if (viewStatusHash === 'active') {
    return todos.filter(function(todo) {
      return todo && !todo.completed;
    });
  } else if (viewStatusHash === 'completed') {
    return todos.filter(function(todo) {
      return todo && todo.completed;
    });
  } else {
    return todos;
  }
};

remainingCount = function() {
  return todos.filter(function(todo) {
    return !todo.completed;
  }).length;
};

completedCount = function() {
  return todos.length - remainingCount();
};

allChecked = function() {
  return !remainingCount();
};

onEscapeFn = function(fn) {
  return function(event) {
    if (event.keyCode === 27 || event.which === 27) {
      return fn();
    }
  };
};

pluralize = function(test, item) {
  if (typeof test === 'function') {
    return txt(function() {
      if (test() > 1) {
        return item + 's';
      } else {
        return item;
      }
    });
  } else if (test > 1) {
    return txt(item + 's');
  } else {
    return txt(item);
  }
};

toggleCompleted = function(todo) {
  todo.completed = !todo.completed;
  save(todos);
  return view.update();
};

markAll = function() {
  var completed, todo, valid, _i, _len;
  if (allChecked()) {
    completed = false;
  } else {
    completed = true;
  }
  valid = true;
  for (_i = 0, _len = todos.length; _i < _len; _i++) {
    todo = todos[_i];
    if (todo.completed !== completed) {
      todo.completed = completed;
      valid = false;
    }
  }
  if (!valid) {
    save(todos);
    return view.update();
  }
};

editTodo = function(todo) {
  editingTodo = todo;
  originalTodo = extend({}, todo);
  return view.update();
};

removeTodo = function(todo) {
  var index;
  index = todos.indexOf(todo);
  todos.splice(index, 1);
  save(todos);
  return view.update();
};

revertEdits = function(todo) {
  todos[todos.indexOf(todo)] = originalTodo;
  return view.update();
};

clearCompletedTodos = function() {
  var i, valid;
  valid = true;
  i = todos.length - 1;
  while (i >= 0) {
    if (todos[i].completed) {
      todos.splice(i, 1);
      valid = false;
    }
    i--;
  }
  if (!valid) {
    save(todos);
    return view.update();
  }
};

setView = function(locationHash) {
  viewStatusHash = locationHash.split('/')[1] || '';
  return view.update();
};

todoHeader = header({
  id: "header"
}, h1("todos"), form({
  id: "todo-form"
}, text({
  id: "new-todo",
  placeholder: "What needs to be done?",
  disable: function() {
    return saving;
  },
  onchange: function() {
    if (!this.value) {
      return;
    }
    todos.push({
      title: this.value,
      completed: false
    });
    save(todos);
    return view.update();
  },
  autofocus: true
})));

todoItems = each(getTodos, function(todo, index) {
  return li({
    className: {
      completed: (function() {
        return todo.completed;
      }),
      editing: function() {
        return todo === editingTodo;
      }
    }
  }, div({
    "class": "view"
  }, checkbox({
    className: "toggle",
    checked: (function() {
      return todo && todo.completed;
    }),
    onchange: (function() {
      return toggleCompleted(todo);
    })
  }), label({
    ondblclick: (function() {
      return editTodo(todo);
    })
  }, (function() {
    return todo && todo.title;
  })), button({
    className: "destroy",
    onclick: (function() {
      return removeTodo(todo);
    })
  })), form({
    submit: function() {
      return save(todos);
    }
  }, text({
    className: "edit",
    trim: "false",
    value: bind(todo, "title"),
    onblur: function() {
      todo.title = this.value;
      save(todos);
      editingTodo = null;
      return view.update();
    },
    onfocus: function() {
      return todo === editingTodo;
    },
    onkeyup: onEscapeFn(function() {
      return revertEdits(todo);
    })
  })));
});

todoEditArea = section({
  id: "main"
}, checkbox({
  id: "toggle-all",
  className: "toggle",
  checked: function() {
    return !!allChecked();
  },
  onclick: markAll
}), label({
  "for": "toggle-all"
}, "Mark all as complete"), ul({
  id: "todo-list"
}, todoItems), footer({
  id: "footer",
  $show: (function() {
    return todos.length;
  })
}, span({
  id: "todo-count"
}, strong(remainingCount), pluralize(remainingCount, ' item'), ' left'), ul({
  id: "filters"
}, li(a({
  className: {
    selected: function() {
      return viewStatusHash === '';
    }
  },
  href: "#/all"
}, "All")), li(a({
  className: {
    selected: function() {
      return viewStatusHash === 'active';
    }
  },
  href: "#/active"
}, "Active")), li(a({
  className: {
    selected: function() {
      return viewStatusHash === 'completed';
    }
  },
  href: "#/completed"
}, "Completed"))), button({
  id: "clear-completed",
  onclick: clearCompletedTodos,
  $show: completedCount
}, txt(function() {
  return "Clear completed: " + completedCount();
}))));

todoFooter = footer({
  id: "info"
}, p("Double-click to edit a todo"), p('Created by ', a({
  href: "http://github.com/taijiweb/domcom"
}, 'Caoxingming(Tiijizhenren, simeon.chaos@gmail.com)')), p("Part of ", a({
  href: "http://todomvc.com"
}, " TodoMVC")));

view = section({
  id: "todoapp"
}, todoHeader, todoEditArea, todoFooter);

window.runTodoMvc = function() {
  todos = fetch();
  view.mount('#todo-app');
  setView(document.location.hash);
  return window.addEventListener('hashchange', function() {
    return setView(document.location.hash);
  });
};
