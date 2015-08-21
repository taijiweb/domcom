{Tag, List, repeat, txt, option} = require '../core'

{registerDirective} = require './register'

# options directive，used for select tag
module.exports = options = (items, attr) -> (comp) ->
  if comp not instanceof Tag or comp.tagName!='select'
    throw new Error 'options should be only used in select tag'
  comp.children = new List([repeat(items, (item) -> option(attrs, [txt(item)]))])
  return

registerDirective 'options', options