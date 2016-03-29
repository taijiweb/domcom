{txt} = require('../core/instantiate')
{option} = require('../core/tag')
Tag = require('../core/base/Tag')

# options directive，used for select tag
module.exports = (items, attrs) -> (comp) ->
  if comp not instanceof Tag or comp.tagName!='select'
    throw new Error 'options should be only used in select tag'
  options = []
  if items
    for item in items
      options.push(option(attrs, [txt(item)]))
  comp.setChildren(0, options)