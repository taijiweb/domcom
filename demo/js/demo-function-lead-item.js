var if_;

if_ = function(test, then_, else_) {
  if (test) {
    return then_;
  } else {
    return else_;
  }
};

export default module.exports = function() {
  var view;
  view = function() {
    return ['div', ['text', 'x'], [if_, !(this.x * 1), ['div', 'It is 0 or NaN.'], ['div', 'it is other number']]];
  };
  return dc({
    view,
    x: 1
  });
};
