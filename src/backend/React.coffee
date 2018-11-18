import Backend from './Backend'

import ReactBlock from '../component/block/ReactBlock'
{tagNames} = require '../dom-util'
{attrsChildren, toTagChildren} = require '../component/util'

export default class React extends Backend
  name: 'React'
  constructor: () ->
    super()
    me = this
    tagNames.forEach (tagName) ->
      me[tagName] = (args...) ->
        [props, children] = attrsChildren(args)
        children = toTagChildren(children)
        return new ReactBlock(tagName, props, children)
    return this

  by: (ReactClass) ->
    return (props, children) ->
      return new ReactBlock(ReactClass, props, children)

module.exports = React

  