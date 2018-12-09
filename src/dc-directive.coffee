export default exports = module.exports = {}


modelProps = {
  'checkbox': 'checked'
}
exports.model = (item, options) ->
  [tag, props, children] = item
  comp = this
  if typeof options == 'string'
    field = options
  else if options
    field = options.field
    event = options.event || 'onChange'
    prop = options.prop
  props = Object.assign {}, props
  prop = prop || modelProps[props.type] || 'value'
  props[prop] = comp[field]
  console.log 'model:', comp[field]
  props[event || 'onChange'] = (event) =>
    comp[field] = event.target[prop]
  return [tag, props, children]
