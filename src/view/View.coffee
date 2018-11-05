import Emitter from '../Emitter'
export default class View extends Emitter
  constructor: (component, info={}) ->
    super()
    this.info = info
    this.setComponent(component)

  setComponent: (component) ->
    for key, value of this.info