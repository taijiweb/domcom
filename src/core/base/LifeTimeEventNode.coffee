module.exports = class LifeTimeEventNode extends VirtualNode
  render: ->
    for comp in @lifeTimeBeforeParent then comp.lifeTimeBeforeCallBack()
    for comp in @lifeTimeAfterParent then comp.lifeTimeAfterCallBack()
