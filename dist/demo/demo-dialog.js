var dialog, div, list;

dialog = dc.dialog, list = dc.list, div = dc.div;

module.exports = function() {
  var dlg;
  return dlg = dialog({
    overlay: true,
    showClose: true
  }, div({
    "class": 'message'
  }, 'click to close me', div({
    onclick: (function() {
      return dlg.close();
    })
  }, 'OK')));
};
