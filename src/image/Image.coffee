import Emitter from '../Emitter'
import Block from '../component/Block'
export default class Image extends Block

  constructor: (block, tagNameOrClass, props, children) ->
    super()
    this.parentNode = block.parentNode
    Object.assign(this, {block, tagNameOrClass, props, children})
