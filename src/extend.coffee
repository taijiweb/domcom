'use strict'
# https://github.com/justmoon/node-extend
hasOwn = Object::hasOwnProperty
toString = Object::toString

isPlainObject = (obj) ->
  'use strict'
  if !obj or toString.call(obj) != '[object Object]'
    return false
  has_own_constructor = hasOwn.call(obj, 'constructor')
  has_is_property_of_method = obj.constructor and obj.constructor.prototype and hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
  # Not own constructor property must be Object
  if obj.constructor and !has_own_constructor and !has_is_property_of_method
    return false
  # Own properties are enumerated firstly, so to speed up,
  # if last one is own, then all properties are own.
  for key of obj then key = key
  key == undefined or hasOwn.call(obj, key)

module.exports = ->
  target = arguments[0]
  i = 1
  length = arguments.length
  deep = false
  # Handle a deep copy situation
  if typeof target == 'boolean'
    deep = target
    target = arguments[1] or {}
    # skip the boolean and the target
    i = 2
  else if typeof target != 'object' and typeof target != 'function' or target == null
    target = {}
  while i < length
    options = arguments[i]
    # Only deal with non-null/undefined values
    if options != null
      # Extend the base object
      for name of options
        `name = name`
        src = target[name]
        copy = options[name]
        # Prevent never-ending loop
        if target == copy
          ++i
          continue
        # Recurse if we're merging plain objects or arrays
        if deep and copy and (isPlainObject(copy) or (copyIsArray = Array.isArray(copy)))
          if copyIsArray
            copyIsArray = false
            clone = if src and Array.isArray(src) then src else []
          else
            clone = if src and isPlainObject(src) then src else {}
          # Never move original objects, clone them
          target[name] = extend(deep, clone, copy)
          # Don't bring in undefined values
        else if copy != undefined
          target[name] = copy
    ++i
  # Return the modified object
  target
