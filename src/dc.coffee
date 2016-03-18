DomNode = require('./DomNode')
{requestAnimationFrame, raf, isElement, addEventListener} = require('./dom-util')
{newDcid, isEven} = require('dc-util')
{domNodeCache, readyFnList, directiveRegistry, renderCallbackList} = require('./config')
isComponent = require('./core/base/isComponent')

###* @api dc(element) - dc component constructor
 *
 * @param element
###

module.exports = dc = (element, options={}) ->
  if typeof element == 'string'
    if options.noCache then querySelector(element, options.all)
    else domNodeCache[element] or domNodeCache[element] = querySelector(element, options.all)
  else if element instanceof Node or element instanceof NodeList or element instanceof Array
    if options.noCache then new DomNode(element)
    else
      if element.dcid then domNodeCache[element.dcid]
      else
        element.dcid = newDcid()
        domNodeCache[element.dcid] = new DomNode(element)
  else throw new Error('error type for dc')

querySelector = (selector, all) ->
  if all then new DomNode(document.querySelectorAll(selector))
  else new DomNode(document.querySelector(selector))

if typeof window != 'undefined'
  window.dcid = newDcid()
  # can not write window.$document = dc(document)
  # why so strange? browser can predict the document.dcid=1, document.body.dcid=2 and assigns it in advance !!!!!!!
  dcid = document.dcid = newDcid()
  window.$document = dc.$document = domNodeCache[dcid] = new DomNode(document)

dc.ready = -> dc.emit('ready')

if typeof window != 'undefined'
  document.addEventListener 'DOMContentLoaded', dc.ready, false
  addEventListener document, 'DOMContentLoaded', ->
    dcid = document.body.dcid = newDcid()
    window.$body = dc.$body = domNodeCache[dcid] = new DomNode(document.body)

# register directive
# directiveHandlerGenerator: (...) -> (component) -> component
dc.directives = (directiveName, directiveHandlerGenerator) ->
  if arguments.length==1
    for name, generator of directiveName
      if name[0]!='$' then name = '$'+name
      directiveRegistry[name] = generator
  else
    if directiveName[0]!='$' then directiveName = '$'+directiveName
    directiveRegistry[directiveName] = directiveHandlerGenerator

dc.toString = -> 'domcom'

dc.listeners = {}
extend = require('extend')
EventMixn = require('./dc-event')
extend(dc, EventMixn)