import Emitter from './Emitter'

{newDcid, isArray, isObject, normalizeDomElement, watchField, watchDataField, isMap} = require 'dc-util'
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
    this.init()
    this.checkConfig(config)
    this.config = config
    Object.assign this, config
    this.watch()
    return

  init: ->
    this.dcid = newDcid()
    this.base = null
    this.reactElement = null
    this.node = null
    this.mounted = false
    this.reactElement = dc.React.createElement(dc.ReactProxy, {component:this})
    return

  checkConfig: (config) ->
    illegals = []
    for own key, value of config
      if this[key] != undefined
        illegals.push key
    if illegals.length
      dc.error "illegal key in config: #{illegals.join(', ')}, they are used by dc.Component itself!"
    return

  watch: ->
    if config = this.config
      for own key of config
        watchField this, key, this
    if (data = this.getData(dc.store)) && isMap data
      components = data.watchingComponents
      if !components
        data.watchingComponents = [this]
      else
        if components.indexOf(this) == -1
          components.push this
      if data && isMap(data)
        for own key of config.data
          watchDataField config.data, key, this
    return this

  stopWatch: ->
    if config = this.config
      for own key of config
        v = this[key]
        delete this[key]
        this[key] = v
      if (data = config.data) && isMap data
        components = data.watchingComponents
        index = components.indexOf(this)
        if index >= 0
          components.splice index, 1
          delete data.watchingComponents
          if !components.length
            for own key of data
              v = data[key]
              delete data[key]
              data[key] = v
    return this

  copy: ->
    comp = new Component({})
    Object.assign comp, this
    comp.init()
    comp.watch()
    return comp

  extend: (config) ->
    comp = new Component({})
    component.base = this
    comp.checkConfig config
    Object.assign comp, this, config
    comp.init()
    comp.config = Object.assign {}, this.config, config
    return comp

  mount: (mountNode) ->
    this._prepareMount(mountNode)
    dc.mountMap[this.dcid] = this
    dc.ReactDom.render(this.reactElement, this.parentNode)
    this.emit('mounted')
    return

  update: ->
    if this.mounted
      # any object to trigger the update
      this.proxy.setState({})
    return

  _prepareMount: (mountNode) ->
    parentNode = normalizeDomElement(mountNode) || document.body
    if parentNode.childNodes.length
      dc.error('should not mount to node which is not empty:', mountNode)
    this.parentNode = parentNode
    return

  getData: ->
    if typeof this.data == 'function'
      return this.data.call(this, dc.store)
    else
      return this.data

  getView: ->
    data = this.getData()
    if this.view
      if typeof this.view == 'function'
        view = this.view.call(this, data)
      else
        view = this.view
      return view

  unmount: () ->
    this.emit('unmounting')
    {parentNode} = this
    if parentNode.childNodes.length
      node = parentNode.childNodes[0]
      parentNode.removeChild(node)
    #tell React do not warn about this
    parentNode._reactRootContainer = undefined
    this.proxy.component = null
    this.proxy = null
    delete dc.mountMap[this.dcid]
    this.unmounted = false
    return
