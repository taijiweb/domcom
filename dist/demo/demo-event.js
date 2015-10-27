var a, checkbox, list, p, text;

list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p;

module.exports = function() {
  var noPropagation, propagation;
  propagation = a({
    onclick: function() {
      return alert('parent');
    }
  }, p({
    onclick: function(event) {
      alert('child');
      return event.continuePropagation = true;
    }
  }, 'propagation'));
  noPropagation = a({
    onclick: function() {
      return alert('parent');
    }
  }, p({
    onclick: function(event) {
      return alert('child');
    }
  }, 'do not propagation'));
  noPropagation.mount();
  return list(propagation, noPropagation);
};
