import Emitter from '../Emitter'
export default class View extends Emitter
  constructor: (component) ->
    super()
    this.component = component