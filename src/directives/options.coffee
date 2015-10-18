{Tag, List, each, txt, option} = dc

{registerDirective} = require './register'

# options directive，used for select tag
module.exports = registerDirective '$options',(items, attrs) -> (comp) ->
  if comp not instanceof Tag or comp.tagName!='select'
    throw new Error 'options should be only used in select tag'
  comp.setChildren(0, each(items, (item) -> option(attrs, [txt(item)])))
  comp