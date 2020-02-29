import Emitter from './Emitter'
import Component from './Component'

###
# a utility to do almost everything
# generate Component instance
# as the dc framework namespace
# hold convinent getter, setter and method, etc...
# @params template: the template for the component
# @params config: the config object for the component, it can have the fileds below
    model can be the real value of data or a function to generate the model data
    data: the data of the component
    view: the view object or a function to generate the view
###
dc = (config) ->
  comp = new Component(config)
  return comp

dc.on = Emitter::on
dc.off = Emitter::off
dc.emit = Emitter::emit

dc.focusNodeMap = {}

dc.on 'updated', ->
  if dc.focusNode
    dc.focusNode.focus()
  return

dc.dcid = 0

dc.mountMap = {}
dc.keepReactElementMap = {}

dc.update = ->
  for key, comp of dc.mountMap
    comp.update()
  return

if typeof window != 'undefined'
  window.dc = dc

dc.Component = require('./Component')
Object.assign(dc,
  require('./dc-error')
  require('dc-util'),
)
dc.directives = {}
Object.assign dc.directives, require('./dc-directive')
dc.addReactProxy = require './react-proxy'
window.dc = dc
export default module.exports = dc



