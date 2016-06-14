{flow, see, case_, each, every, func, list, div, label, text} = dc

module.exports = ->
  firstLetter$ = see 'd',  (x) -> x.toLowerCase()
  comp = null
  prompt = label 'Please choose: '
  prefered = text {onchange: -> comp.render()}, firstLetter$

  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember']
#  items =  for item in frameworks then div "#{item[0]}. #{item}"  # (1)
#  items = list items

#  items = each frameworks, (item) -> div "#{item[0]}. #{item}" # (2)

  items = every frameworks, (item) -> div "#{item[0]}. #{item}"  #(3)

  caseMap = {}
  for item in frameworks
    caseMap[item[0]] = item
  choice =  case_ firstLetter$, caseMap, 'some other things'

  comp = list \
    prompt, prefered,
    items,
    div "You perfer ", choice, "."

module.exports = ->
  firstLetter$ = see 'd',  (x) -> x.toLowerCase()
  comp = null
  prompt = label 'Please choose: '
  prefered = text {onchange: -> comp.render()}, firstLetter$

  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember']
  items = each frameworks, (item) -> div "#{item[0]}. #{item}"

  prompt2 = label 'add some others: '
  added = text onchange: (event, node) ->
    newFramework = node.value
    frameworks.push newFramework
    firstLetter$ newFramework[0]
    comp.render()

  choice = func flow firstLetter$, ->
    firstLetter = firstLetter$()
    for item in frameworks
      if item[0].toLowerCase()==firstLetter
        return item
    'some other things'

  comp = list \
    prompt, prefered,
    prompt2, added,
    items,
    div "You perfer ", choice, "."

