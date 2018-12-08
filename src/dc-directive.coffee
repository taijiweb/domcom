export default exports = module.exports = {}

exports.model = (item, field, event='onChange') ->
  [tag, props, children] = item
  comp = this
  props = Object.assign {}, props
  props.value = comp[field]
  console.log 'model:', comp[field]
  props[event] = (event) =>
    console.log('onChange', comp[field], event.target.value)
    comp[field] = event.target.value
    debugger
  return [tag, props, children]
