export default module.exports = function() {
  var comp, i, list, onClick, view;
  list = [1, 2, 3, 4, 5, 6];
  i = 7;
  onClick = function() {
    list.push(i++);
    return comp.update();
  };
  view = function() {
    return ['div', {onClick}, 'click to append: ', this.list.join(' ')];
  };
  return comp = dc({view, list});
};
