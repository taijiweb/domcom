import TranComponent from './TranComponent'

export default module.exports = class MVC extends TranComponent
  constructor: (view, model) ->
    super()
    this._view = view
    this._model = model

