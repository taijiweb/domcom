import Emitter from '../Emitter'
Block = require '../component/block/Block'

export default class Image extends Block

  constructor: (block, tagNameOrClass, props, children) ->
    super()
    this.parentNode = block.parentNode
    Object.assign(this, {block, tagNameOrClass, props, children})
