extend = require('extend')

DomNode = require('./DomNode')
{addEventListener} = require('./dom-util')
isComponent = require('./core/base/isComponent')

module.exports = dc = (element, all) ->
  if typeof element == 'string'
    if all
      dc(document.querySelectorAll(element))
    else
      dc(document.querySelector(element))
  else if element instanceof Node
    if element.component
      element.component
    else
      new DomNode(element)
  else if element instanceof NodeList || element instanceof Array
    new DomNode(element)
  else
    throw new Error('error type for dc')

dc.toString = -> 'domcom'

dc.directiveRegistry = directiveRegistry = {}

dc.clearDirectives = ->
  dc.directiveRegistry = directiveRegistry = {}

# register directive
# directiveHandlerGenerator: (...) -> (component) -> component
dc.directives = (directiveName, directiveHandlerGenerator) ->
  if arguments.length==1
    for name, generator of directiveName
      if name[0]!='$'
        name = '$'+name
      directiveRegistry[name] = generator
  else
    if directiveName[0]!='$' then directiveName = '$'+directiveName
    directiveRegistry[directiveName] = directiveHandlerGenerator

if typeof window != 'undefined'
  window.$document = dc.$document = new DomNode(document)

dc.ready = ->
  # avoid dc.emit('ready') to call dc.ready recursively
  if dc.listeners['ready']
    dc.emit('ready')
  return

if typeof window != 'undefined'
  addEventListener document, 'DOMContentLoaded', dc.ready, false
  addEventListener document, 'DOMContentLoaded', ->
    window.$body = dc.$body = new DomNode(document.body)

# mixin component event:
extend(dc, require('./dc-event'))