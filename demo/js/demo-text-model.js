export default module.exports = function() {
  var comp, view;
  view = function() {
    return [
      'div',
      [
        'text',
        {
          $model: 'a',
          key: 1,
          ref: function(el) {
            return comp.textInput = el;
          }
        }
      ],
      ['p',
      {},
      this.a]
    ];
  };
  comp = dc({
    view,
    a: 'hello'
  });
  return comp.on('updated', function() {
    comp.textInput.focus();
  });
};
