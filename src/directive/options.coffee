{txt} = require '../instantiate'
{option} = require '../tag'
import Tag from '../component/block/Tag'

# options directive，used for select tag
export default module.exports = (items, attrs) -> (comp) ->
  if !(comp instanceof Tag) || comp.tagName!='select'
    throw new Error 'options should be only used in select tag'
  options = []
  if items
    for item in items
      options.push(option(attrs, [txt(item)]))
  comp.setChildren(0, options)
