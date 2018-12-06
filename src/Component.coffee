import Emitter from './Emitter'

{newDcid, isArray, isObject, normalizeDomElement} = require 'dc-util'
###
  部件基类
  @params config: the config object for the component, it can have the fileds below
    data: the real data of the component or a function to generate the data
    view: the view object or a function to generate the view
    any other fields that do not conflict with component itself
###
export default module.exports = class Component extends Emitter
  constructor: (config) ->
    super()
    this.dcid = newDcid()
    this.base = null
    this.reactElement = null
    this.node = null
    illegals = []
    for own key, value of config
      if this[key] != undefined
        illegals.push key
    if illegals.length
      dc.error "illegal key in config: #{illegals.join(', ')}, they are used by dc.Component itself!"
    Object.assign this, config
    this.reactElement = dc.React.createElement(dc.ReactProxy, {component:this})
    return

  copy: ->
    comp = new Component({})
    Object.assign comp, this
    comp.dcid = newDcid()
    comp.reactElement = dc.React.createElement(dc.ReactProxy, {component:comp})
    return comp

  extend: (config) ->
    comp = new Component({})
    for own key, value of config
      if comp[key] != undefined
        illegals.push key
    if illegals.length
      dc.error "illegal key in config: #{illegals.join(', ')}, they are used by dc.Component itself!"
    Object.assign comp, this, config
    comp.reactElement = dc.React.createElement(dc.ReactProxy, {component:comp})
    return comp


  ### mountNode should not be the node of any Component
  ###
  mount: (mountNode) ->
    this.emit('mounting')
    this._prepareMount(mountNode)
    dc.mountMap[this.dcid] = this
    dc.ReactDom.render(this.reactElement, this.parentNode)
    this.emit('mounted')
    return

  update: ->
    # any object to trigger the update
    this.proxy.setState({})
    return this

  makeProxyViewItem: ->
    [dc.ReactProxy, {component:this}, []]

  _prepareMount: (mountNode) ->
    parentNode = normalizeDomElement(mountNode) || document.body
    if parentNode.childNodes.length
      dc.error('should not mount to node which is not empty:', mountNode)
    this.parentNode = parentNode
    return

  getData: ->
    if typeof this.data == 'function'
      return this.data()
    else
      return this.data

  getView: ->
    data = this.getData()
    if this.view
      if typeof this.view == 'function'
        view = this.view(data)
      else
        view = this.view
      return view

  unmount: () ->
    this.emit('mounting')
    {parentNode} = this
    if parentNode.childNodes.length
      node = parentNode.childNodes[0]
      parentNode.removeChild(node)
    #tell React do not warn about this
    parentNode._reactRootContainer = undefined
    this.proxy.component = null
    this.proxy = null
    delete dc.mountMap[this.dcid]
    this.emit('unmounted')
    return
