###* @module accordion
 * @directive accordion
###

{extend,
div, h4, a, span, img
Component, repeat
extendAttrs} = dc

module.exports = exports = accordion = (attrs, accordionGroupList, options) ->
  attrs = extendAttrs {class:"panel-group"}, attrs  or Object.create(null)
  accordionOptions = options or Object.create(null)
  comp = div(attrs, repeat(accordionGroupList, (group, index) ->
      [groupAttrs, heading, content, groupOptions] = group
      groupOptions = groupOptions or Object.create(null)
      groupOptions.toggleOpen = ->
        groupOptions.opened = !groupOptions.opened
        if accordionOptions.closeOthers and groupOptions.opened
          for group2, i in accordionGroupList
            if i!=index then group2[3].opened = false
        comp.update()
      accordionGroup(groupAttrs, heading, content, groupOptions)
    )
  )
#  div(repeat(accordionGroupList, (group, index) ->
#    [groupAttrs, heading, content, groupOptions] = group
#    div(content)))

#  repeat(accordionGroupList, (group, index) ->
#    [groupAttrs, heading, content, groupOptions] = group
#    div(content))

exports.accordionGroup = accordionGroup = (attrs, heading, content, options) ->
  div({class:"panel panel-default"},
    div({class:"panel-heading", onclick: options.toggleOpen},
      h4({class:"panel-title"}
          div({class:"accordion-toggle"}, span({class:{'text-muted': -> options.disabled}}, heading))
      )
    )
    div({
        class:{"panel-collapse": -> !options.opened}
        style:{ display: -> if options.opened then 'block' else 'none'}},
      div({class:"panel-body"}, content)
    )
  )

  #div(content)

exports.accordion = accordion