export default module.exports = function() {
  var comp, view;
  view = function(data) {
    var display, onClick;
    if (this.display) {
      display = 'block';
    } else {
      display = 'none';
    }
    onClick = () => {
      return this.display = !this.display;
    };
    return [
      'div',
      ['div',
      {onClick},
      'click to show or hide by changing style.display'],
      [
        'p',
        {
          style: {display}
        },
        'this is the controlled content'
      ]
    ];
  };
  comp = dc({
    view,
    display: true
  });
  return comp;
};
