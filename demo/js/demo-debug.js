var exports;

exports = {};

exports.demoEachPush = function() {
  var comp, list, view;
  list = [1, 2];
  view = [
    'div',
    [
      'div',
      this.list.map((item) => {
        return ['p',
      item];
      })
    ],
    'some other thing'
  ];
  comp = dc({view, list});
  comp.mount();
  lst.push(3);
  return comp.update();
};

exports.demoIfEach = function() {
  var comp, view;
  view = function() {
    if (this.showing) {
      return this.list.map(function(item) {
        return ['div', {}, item];
      });
    } else {
      return null;
    }
  };
  comp = {
    view,
    list: [1, 2]
  };
  comp.mount();
  comp.showing = false;
  comp.showing = true;
  return comp;
};

exports.demoModelOnMultipleInput = function() {
  var comp, view;
  view = function() {
    return [
      'div',
      [
        'text',
        {
          '#': [[dc.model,
        'x']]
        }
      ],
      [
        'text',
        {
          '#': [[dc.model,
        'x']]
        }
      ]
    ];
  };
  return comp = dc({
    view,
    x: 'input some text'
  });
};

export default exports;
