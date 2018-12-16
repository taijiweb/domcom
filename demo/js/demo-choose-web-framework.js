export default module.exports = function() {
  var comp, frameworks, onBlur, view;
  onBlur = function(event) {
    comp.otherFramework = event.target.value;
    comp.update();
    comp.textNode.focus();
  };
  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember'];
  view = function() {
    var currentFrameWorks, frameworkLiItems;
    currentFrameWorks = frameworks.concat([comp.otherFramework || 'other']);
    frameworkLiItems = currentFrameWorks.map(function(item) {
      var onClick;
      onClick = function() {
        return comp.choice = item;
      };
      return ['li', {onClick}, `${item}`];
    });
    return [
      'div',
      ['label',
      'Please choose: '],
      ['ol',
      {},
      ...frameworkLiItems],
      ['div',
      "You perfer ",
      comp.choice,
      "."],
      ['label',
      'add some others: '],
      [
        'text',
        {
          onBlur,
          value: comp.otherFramework,
          key: 'other-framework',
          ref: (function(el) {
            return comp.textNode = el;
          }),
          keepid: 1
        }
      ]
    ];
  };
  return comp = dc({
    view,
    choice: 'Domcom'
  });
};
