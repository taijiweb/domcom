import toComponent from './toComponent'
import TranComponent from './TranComponent'

export default module.exports = class MVC extends TranComponent
  constructor: (view, model) ->
    super()
    this._view = view
    this._model = model

  getContent: ->
    if typeof this._model == 'function'
      data = this._model.call(this, dc.store)
    else
      data = this._model
    if typeof this._view == 'function'
      view = this._view.call(this, data)
    else
      view = this._view
    return toComponent(view)



