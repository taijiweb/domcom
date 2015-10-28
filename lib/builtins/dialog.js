var Component, div, globalID, list, see;

see = require("../flow/index").see;

div = require("../core/tag").div;

list = require("../core/instantiate").list;

Component = require("../core/base/component");

globalID = 0;

module.exports = function(options, template) {
  var closeCallback, dlg, openCallback, opened;
  if (options.showClose) {
    template = list(div({
      "class": "dcdialog-close",
      style: {
        position: 'absolute',
        "z-index": 10001,
        top: 0,
        right: '80px'
      },
      onclick: (function() {
        return dlg.close();
      })
    }), template);
  }
  if (options.overlay) {
    template = list(div({
      "class": "dcdialog-overlay",
      style: {
        "z-index": 10000
      }
    }), div({
      "class": "dcdialog-content",
      style: {
        position: 'absolute',
        "z-index": 10001
      }
    }, template));
  } else {
    template = div({
      "class": "dcdialog-content",
      style: {
        "z-index": 10001
      }
    }, template);
  }
  opened = see(!options.closed);
  dlg = if_(opened, div({
    id: 'dcdialog' + (++globalID),
    "class": "dcdialog",
    style: {
      position: 'absolute',
      top: '0px',
      left: '0px',
      "z-index": 9999
    }
  }, template));
  openCallback = options.openCallback;
  dlg.open = function() {
    openCallback && openCallback();
    opened(true);
    return dlg.update();
  };
  closeCallback = options.closeCallback;
  dlg.close = function() {
    opened(false);
    dlg.update();
    return closeCallback && closeCallback();
  };
  if (options.escClose) {
    dlg.on('onMount', function() {
      var escHandler;
      escHandler = function(event) {
        var esc;
        esc = 27;
        if (event.which === esc || event.keyCode === esc) {
          return dlg.close();
        }
      };
      return document.body.addEventListener('keydown', escHandler);
    });
    dlg.on('onUnmount', function() {
      return document.body.removeEventListener('keydown', escHandler);
    });
  }
  return dlg;
};
