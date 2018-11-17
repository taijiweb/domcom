import Vue from 'vue'

createVueElement = (h, item, index) ->
  if item.tagComponent && item.tagComponent  && item.children
    children = item.children.map (child, i) -> createVueElement(h, child, index)
    item = h(item.tagComponent, item.props, children)
  else
    item
  return item


export default module.exports = class VueProxy
  constructor: (block) ->
    proxy = this
    this.block = block
    # set key to trigger refresh
    this.data = {key: 0}
    this.vueInstance = new Vue({
    # do not observe tagComponent, props, children, key
    #[Vue warn]: Avoid using observed data object as vnode data: {}
    #Always create fresh vnode data objects in each render!
      data: this.data,
      render:((h) ->
        debugger
        image = proxy.block.getImage()
        {tagComponent, props, children} = image
        children = children.map (child, index) ->
          createVueElement(h, child, index)
        h(tagComponent, props, children))
    })
    return this

  mount: (node) ->
    debugger
    this.vueInstance.$mount(node)
    return

  refresh: ->
    this.data.key++
    return
