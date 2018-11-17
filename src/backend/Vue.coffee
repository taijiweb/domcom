import Backend from './Backend'
import VueBlock from '../component/VueBlock'
{tagNames} = require '../dom-util'
{attrsChildren, toTagChildren} = require '../component/util'

export default class Vue extends Backend
  name: 'Vue'
  constructor: () ->
    super()
    me = this
    tagNames.forEach (tagName) ->
      me[tagName] = (args...) ->
        [props, children] = attrsChildren(args)
        children = toTagChildren(children)
        return new VueBlock(tagName, props, children)
    return this

  by: (vueComponent) ->
    return (props, children) ->
      return new VueBlock(vueComponent, props, children)

module.exports = Vue
