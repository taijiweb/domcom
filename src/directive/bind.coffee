{getBindProp} = require '../dom-util'

export default module.exports = (binding) -> (comp) ->
  comp.setProp(getBindProp(comp), binding, comp.props, 'Props')
  comp