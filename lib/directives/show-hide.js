
/* @param test - paramenter expression for directive
 */
var showHide;

showHide = function(showing) {
  return function(test, display) {
    return function(comp) {
      comp.showHide(showing, test, display);
      return comp;
    };
  };
};

exports.$show = showHide(true);

exports.$hide = showHide(false);
