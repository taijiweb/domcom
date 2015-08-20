#{Value} = require 'bind-expression'
{Tag, List, repeat, txt, option} = require '../core'

{registerDirective} = require './register'

# options directive， used for select tag
registerDirective 'options',   (exp, attrs) -> (comp) ->
  if comp not instanceof Tag or comp.tagName!='select'
    throw new Error 'options should be only used in select tag'
  comp.children = new List([repeat(exp, (item) -> option(attrs, [txt(item)]))])
  return