{bibind
accordion
repeat
div, span} = dc

module.exports = ->
  groups = [
    {heading:'group1', items: 'a b c'.split(' ')}
    {heading:'group2', items: 'd e f'.split(' ')}
    {heading:'group3', items: 'x y z'.split(' ')}
  ]
  accordionGroupList = for group in groups
    groupOptions = {opened:group.opened, disable:group.disable}
    groupAttrs = {
      #onclick: -> groupOptions.open = !groupOptions.open
    }
    content = repeat(group.items, (item) ->
      span({
        style:{margin:'5px'}
        onclick: ->
      }, item)
    )
    [groupAttrs, group.heading, content, groupOptions]
  comp = accordion(Object.create(null), accordionGroupList, {closeOthers:true})
  #comp.mount()