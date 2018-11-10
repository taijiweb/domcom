import {getBindProp} from '../dom-util'

export default  (binding) -> (comp) ->
  comp.setProp(getBindProp(comp), binding, comp.props, 'Props')
  comp