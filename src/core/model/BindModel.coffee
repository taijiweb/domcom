export default class FuncModel extends Model
  constructor: (object, field) ->
    super()
    this.object = object
    this.field = field

  get: ->
    return this.object[this.field]
