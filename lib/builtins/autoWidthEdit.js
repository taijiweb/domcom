var AutoWidthEdit, Tag, div, flow, overAttrs, pipe, see, text, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ref = require("../flow/index"), see = _ref.see, flow = _ref.flow, pipe = _ref.pipe;

_ref1 = require("../core/tag"), div = _ref1.div, text = _ref1.text;

Tag = require("../core/base/Tag");

overAttrs = require("../core/property").overAttrs;

exports.AutoWidthEdit = AutoWidthEdit = (function(_super) {
  __extends(AutoWidthEdit, _super);

  function AutoWidthEdit(contextEditAttrs, inputAttrs, inputKeyFn) {
    var editWidth, me, testSubject, testSubjectStyle, _inputAttrs;
    if (inputKeyFn == null) {
      inputKeyFn = this.inputKeyFn;
    }
    me = this;
    editWidth = see(48);
    testSubjectStyle = {
      position: 'absolute',
      top: '30px',
      width: 'auto',
      height: '20px',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      margin: '0',
      padding: '0',
      fontSize: function() {
        return me.css('fontSize');
      },
      fontFamily: function() {
        return me.css('fontFamily');
      },
      fontWeight: function() {
        return me.css('fontWeight');
      },
      letterSpacing: function() {
        return me.css('letterSpacing');
      },
      visibility: 'hidden'
    };
    testSubject = div({
      style: testSubjectStyle
    }, ((function(_this) {
      return function() {
        return _this.value;
      };
    })(this)));
    this.inputKeyFn = function(event, comp) {
      var node;
      event.executeDefault = true;
      node = comp.node;
      me.value = node.value;
      editWidth(testSubject.node.getBoundingClientRect().width);
      me.update();
      return node.focus();
    };
    _inputAttrs = {
      style: {
        'z-index': '10',
        width: pipe(editWidth, function(w) {
          return Math.max(Math.floor(w) + 40, 48) + 'px';
        }),
        whiteSpace: 'nowrap'
      },
      onkeydown: function(event, comp) {
        return me.inputKeyFn(event, comp);
      }
    };
    this.inputComp = text(overAttrs(_inputAttrs, inputAttrs));
    contextEditAttrs = overAttrs({
      onclick: function(event, comp) {
        return this.focus();
      }
    }, contextEditAttrs);
    AutoWidthEdit.__super__.constructor.call(this, 'div', contextEditAttrs, [this.inputComp, testSubject]);
  }

  return AutoWidthEdit;

})(Tag);

exports.autoWidthEdit = function(contextEditAttrs, inputAttrs, inputKeyFn) {
  return new AutoWidthEdit(contextEditAttrs, inputAttrs, inputKeyFn);
};
