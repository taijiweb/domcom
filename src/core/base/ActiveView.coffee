toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{newLine} = require 'dc-util'
extend = require 'extend'

module.exports = class ActiveView extends TransformComponent
  constructor: (activeView) ->

    super()

    @_activeView = activeView = toComponent activeView

    @family = family = extend {}, activeView.family
    family[@dcid] = true

    if Object.defineProperty

      get = -> @_activeView
      set = (activeView) ->
        setActiveView(@, activeView)

      Object.defineProperty(this, 'activeView', {get, set})

  setActiveView: (activeView) ->
    setActiveView(@, activeView)

  onSetActiveView: (activeView, oldActiveView) ->

  getContentComponent: -> @_activeView

  # this probably should be overloaded by the subclass
  clone: -> (new @constructor(@activeView)).copyEventListeners(@)

  toString: (indent=0, addNewLine='') ->
      newLine('', indent, addNewLine)+'<ActiveView '+@activeView.toString(indent+2, true)+'>'

setActiveView = (component, activeView) ->
  oldActiveView = component._activeView

  if activeView == oldActiveView
    activeView
  else
    component.onSetActiveView(activeView, oldActiveView)
    activeView = toComponent activeView
    component.invalidateTransform()
    component._activeView = activeView

