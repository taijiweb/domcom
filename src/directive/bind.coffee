import {getBindProp} from '../dom-util'

module.exports = (binding) -> (comp) ->
  comp.setProp(getBindProp(comp), binding, comp.props, 'Props')
  comp