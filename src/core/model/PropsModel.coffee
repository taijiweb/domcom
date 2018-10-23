export default class PropsModel extends Model
  constructor: (props) ->
    super()
    this.props = props

  get: ->

  setComponent: (@omponent) ->
    for own key, value of this.props
      if value instanceof Model
        value.setComponent(component)
    return this
