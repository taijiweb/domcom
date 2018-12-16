export default module.exports = function() {
  var view;
  view = ['div', ['checkbox', 'a'], ['text', 'a'], ['checkbox', 'b'], ['text', 'b']];
  return dc({
    view,
    a: true,
    b: true
  });
};
