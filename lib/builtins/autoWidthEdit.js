var autoWidthEditController, div, extend, extendAttrs, pipe, see, text;

see = dc.see, pipe = dc.pipe, div = dc.div, text = dc.text, extendAttrs = dc.extendAttrs, extend = dc.extend;

exports.autoWidthEditController = autoWidthEditController = function(options) {
  var controller, initialWidth, inputAttrs, inputEvent, inputEvents, inputText$, inputTextWidth$, spaceWidth, testSubject, testSubjectStyle, _i, _len;
  if (options == null) {
    options = {};
  }
  controller = {};
  initialWidth = options.initialWidth || 48;
  spaceWidth = options.spaceWidth || 40;
  inputTextWidth$ = see(initialWidth);
  inputEvents = options.inputEvents && options.inputEvents.split(/\s+/) || ["onkeydown"];
  inputText$ = see("");
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
      return controller.component.css('fontSize');
    },
    fontFamily: function() {
      return controller.component.css('fontFamily');
    },
    fontWeight: function() {
      return controller.component.css('fontWeight');
    },
    letterSpacing: function() {
      return controller.component.css('letterSpacing');
    },
    visibility: 'hidden'
  };
  testSubject = div({
    style: testSubjectStyle
  }, inputText$);
  inputAttrs = {
    style: {
      'z-index': '10',
      width: pipe(inputTextWidth$, function(w) {
        return Math.max(Math.floor(w) + spaceWidth, initialWidth) + 'px';
      }),
      whiteSpace: 'nowrap'
    }
  };
  for (_i = 0, _len = inputEvents.length; _i < _len; _i++) {
    inputEvent = inputEvents[_i];
    inputAttrs[inputEvent] = function(event, comp) {
      event.executeDefault = true;
      inputText$(this.value);
      inputTextWidth$(testSubject.node.getBoundingClientRect().width);
      controller.component.update();
      return this.focus();
    };
  }
  return extend(controller, {
    testSubject: testSubject,
    inputAttrs: inputAttrs
  });
};

exports.autoWidthEdit = function(attrs, inputAttrs, options) {
  var controller, inputComp;
  controller = autoWidthEditController(options);
  inputComp = text(extendAttrs(controller.inputAttrs, inputAttrs));
  return div(attrs, [inputComp, controller.testSubject]).addController(controller);
};
