export default  module.exports = ->
  onBlur = (event) ->
    comp.otherFramework = event.target.value
    comp.update()
    comp.textNode.focus()
    return

  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember']
  view = ->
    currentFrameWorks = frameworks.concat([comp.otherFramework || 'other'])
    frameworkLiItems = currentFrameWorks.map((item) ->
      onClick = ->
        comp.choice = item
      ['li', {onClick}, "#{item}"])
    ['div',
     ['label', 'Please choose: '],
     ['ol', {}, frameworkLiItems...],
     ['div', "You perfer ", comp.choice, "."]
     ['label', 'add some others: '],
     ['text', {onBlur, value:comp.otherFramework, key:'other-framework', ref:((el) -> comp.textNode = el), keepid:1}]
    ]

  comp = dc({view, choice:'Domcom'})


