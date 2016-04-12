{cloneObject} = require('dc-util')

exports.styleFrom = styleFrom = (value) ->
  if typeof value == 'string'
    result = {}
    value = value.trim().split(/\s*;\s*/)
    for item in value
      item = item.trim()
      if !item
        continue
      [key, v] = item.split /\s*:\s*/
      result[key] = v
    result
  else if value instanceof Array
    result = {}
    for item in value
      if typeof item == 'string'
        item = item.trim()
        if !item
          continue
        [key, value] = item.split /\s*:\s*/
      else
        [key, value] = item
      result[key] = value
    result
  else if value && typeof value != 'object'
    {}
  else
    cloneObject(value)

