export default module.exports = function() {
  var comp, data, view;
  data = {
    a: 1,
    b: 2
  };
  view = function(data) {
    var props1, props2;
    props1 = {
      focusid: 1,
      value: data.a,
      onChange: function(event) {
        data.a = event.target.value * 1;
        return comp.update();
      }
    };
    props2 = {
      focusid: 2,
      value: data.b,
      onChange: function(event) {
        data.b = event.target.value * 1;
        return comp.update();
      }
    };
    return [
      'div',
      {
        key: 0
      },
      ['text',
      props1],
      ['text',
      props2],
      ['p',
      data.a + data.b]
    ];
  };
  return comp = dc({data, view});
};
