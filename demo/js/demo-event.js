var a, checkbox, list, p, text;

({list, a, checkbox, text, p} = dc);

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
  // below run ok
  //  comp3 = a({onmouseleave: -> alert('parent')},
  //    p({onmouseleave: (event) -> alert('child'); event.continuePropagation = true}, 'propagation leave'))
  //  comp3.mount()
  return list(propagation, noPropagation);
};
