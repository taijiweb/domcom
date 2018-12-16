var allChecked, app, clearCompletedTodos, completedCount, editTodo, editingTodo, markAll, onEscapeFn, originalTodo, pluralize, remainingCount, removeTodo, revertEdits, reverted, saving, todoEditArea, todoFooter, todoHeader, toggleCompleted, view, viewStatusHash;

dc.addReactProxy(window.React, window.ReactDOM, window.React.Component);

//######################################################################################################################
// store
window.fetch = function() {
  return JSON.parse(localStorage.getItem('todoApp') || '[]');
};

window.save = function(todos) {
  return localStorage.setItem('todoApp', JSON.stringify(todos));
};

//######################################################################################################################
// model
// [ { title: string, completed: boolean } ... ]
window.todos = [];

window.todos = fetch();

//######################################################################################################################
// controller
viewStatusHash = null;

editingTodo = {
  title: '',
  completed: false
};

originalTodo = null;

reverted = null;

saving = false;

window.getTodos = function() {
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
  if (test > 1) {
    return item + 's';
  } else {
    return item;
  }
};

toggleCompleted = function(todo) {
  todo.completed = !todo.completed;
  save(todos);
  return app.update();
};

markAll = function() {
  var completed, j, len, todo, valid;
  if (allChecked()) {
    completed = false;
  } else {
    completed = true;
  }
  valid = true;
  for (j = 0, len = todos.length; j < len; j++) {
    todo = todos[j];
    if (todo.completed !== completed) {
      todo.completed = completed;
      valid = false;
    }
  }
  if (!valid) {
    save(todos);
    return app.update();
  }
};

editTodo = function(todo) {
  editingTodo = todo;
  originalTodo = Object.assign({}, todo);
  return app.update();
};

removeTodo = function(todo) {
  var index;
  index = todos.indexOf(todo);
  todos.splice(index, 1);
  save(todos);
  return app.update();
};

revertEdits = function(todo) {
  todos[todos.indexOf(todo)] = editingTodo = originalTodo;
  return app.update();
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
    return app.update();
  }
};

//######################################################################################################################
// view
todoHeader = function() {
  var onBlur, onChange, onKeyUp;
  onKeyUp = function(event) {
    var keyCode, value;
    console.log('onBlur todos: ', todos);
    keyCode = event.keyCode || event.which;
    if (keyCode === 27) {
      editingTodo = {
        title: '',
        completed: false
      };
    } else if (keyCode === 13) {
      editingTodo.title = value = event.target.value;
      if (!value) {
        return;
      } else {
        todos.push(editingTodo);
        editingTodo = {
          title: '',
          completed: false
        };
        save(todos);
      }
    }
    return app.update();
  };
  onBlur = function(event) {
    var node, value;
    console.log('onBlur todos: ', todos);
    debugger;
    node = event.target;
    value = node.value;
    editingTodo.title = value;
    if (!value) {

    } else {
      todos.push(editingTodo);
      editingTodo = {
        title: '',
        completed: false
      };
      save(todos);
      app.update();
    }
  };
  onChange = function(event) {
    var node, value;
    node = event.target;
    value = node.value;
    editingTodo.title = value;
    app.update();
  };
  return [
    'header#header',
    {
      key: 1
    },
    ['h1',
    "todos"],
    [
      'text#new-todo',
      {
        value: editingTodo.title,
        onChange,
        onBlur,
        onKeyUp,
        key: 2,
        focusid: 1
      }
    ]
  ];
};

todoEditArea = function() {
  var todoItems, todos;
  todos = getTodos();
  todoItems = todos.map(function(todo, index) {
    var if_, onBlur, onChange, onFocus, onKeyUp, onToggle;
    onChange = function(event) {
      todo.title = event.target.value;
      return app.update();
    };
    onBlur = function(event) {
      todo.title = event.target.value;
      save(todos);
      editingTodo = {};
      return app.update();
    };
    onFocus = function() {
      return todo = editingTodo;
    };
    onKeyUp = function(event) {
      var keyCode;
      keyCode = event.keyCode || event.which;
      if (keyCode === 27) {
        todos[todos.indexOf(todo)] = editingTodo = originalTodo;
      } else if (keyCode === 13) {
        save(todos);
        editingTodo = {
          title: '',
          completed: false
        };
      }
      return app.update();
    };
    onToggle = function() {
      return toggleCompleted(todo);
    };
    if_ = function(x, y, z) {
      if (x) {
        return y;
      } else {
        return z;
      }
    };
    return [
      'li',
      {
        className: {
          completed: todo.completed,
          editing: todo === editingTodo,
          key: 5
        },
        onDoubleClick: (function() {
          return editTodo(todo);
        })
      },
      [
        'div#view',
        [
          'checkbox.toggle',
          {
            checked: todo.completed,
            onChange: onToggle,
            key: 1000 + index
          }
        ],
        [
          if_,
          todo !== editingTodo,
          ['label',
          todo.title],
          [
            'text.edit',
            {
              trim: 'false',
              value: todo.title,
              onBlur,
              onChange,
              onFocus,
              onKeyUp,
              focusid: 100 + index
            }
          ]
        ],
        [
          'button.destroy##float:right',
          {
            onClick: (function() {
              return removeTodo(todo);
            })
          },
          'x'
        ]
      ]
    ];
  });
  return [
    'section#main',
    [
      'checkbox.toggle#toggle-all',
      {
        key: 6,
        checked: !!allChecked(),
        onChange: markAll,
        onClick: function() {
          return 'click toggle all';
        }
      }
    ],
    [
      'label',
      {
        htmlFor: "toggle-all"
      },
      "Mark all as complete"
    ],
    ["ul#todo-list",
    ...todoItems],
    [
      "footer#footer",
      {
        $show: todos.length
      },
      ["span#todo-count",
      ['strong',
      remainingCount()],
      pluralize(remainingCount(),
      ' item'),
      ' left'],
      [
        "ul#filters",
        [
          'li',
          [
            'a',
            {
              className: {
                selected: viewStatusHash !== 'active' && viewStatusHash !== 'completed'
              },
              href: "#/all"
            },
            "All"
          ]
        ],
        [
          'li',
          [
            'a',
            {
              className: {
                selected: viewStatusHash === 'active'
              },
              href: "#/active"
            },
            "Active"
          ]
        ],
        [
          'li',
          [
            'a',
            {
              className: {
                selected: viewStatusHash === 'completed'
              },
              href: "#/completed"
            },
            "Completed"
          ]
        ]
      ]
    ],
    [
      'button#clear-completed',
      {
        onClick: clearCompletedTodos,
        $show: !!completedCount()
      },
      "Clear completed: " + completedCount()
    ]
  ];
};

todoFooter = [
  'footer#info',
  {
    key: 100
  },
  ['p',
  "Double-click to edit a todo"],
  [
    'p',
    'Created by ',
    [
      'a',
      {
        href: "http://github.com/taijiweb/domcom"
      },
      'Caoxingming(Tiijizhenren, simeon.chaos@gmail.com)'
    ]
  ],
  [
    'p',
    "Part of ",
    [
      'a',
      {
        href: "http://todomvc.com"
      },
      " TodoMVC"
    ]
  ]
];

view = function() {
  return [
    'section#todoapp',
    {
      key: 0
    },
    todoHeader(),
    todoEditArea(),
    todoFooter
  ];
};

app = dc({view});

window.updateHash = function() {
  var locationHash;
  locationHash = document.location.hash;
  if (locationHash.indexOf('/') >= 0) {
    return viewStatusHash = locationHash.split('/')[1] || '';
  } else {
    return viewStatusHash = locationHash;
  }
};

//######################################################################################################################
// run the app
window.runTodoMvc = function() {
  updateHash();
  app.mount('#todo-app');
  return window.addEventListener('hashchange', function() {
    updateHash();
    return app.update();
  });
};
