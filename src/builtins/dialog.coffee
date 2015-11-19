{see} = require 'lazy-flow'
{list, if_, div} = require '../core/instantiate'
{Component} = require '../core/base/Component'

globalID = 0

module.exports = (options, template) ->
  if options.showClose
    template = list(div({class:"dcdialog-close", style:{position:'absolute', "z-index":10001, top: 0, right:'80px'}, onclick:(-> dlg.close())}), template)
  if options.overlay
    template = list(div({class:"dcdialog-overlay",style:{"z-index":10000}}), div({class:"dcdialog-content",style:{position:'absolute', "z-index":10001}},template))
  else template = div({class:"dcdialog-content",style:{"z-index":10001}},template)
  opened = see !options.closed
  dlg = if_ opened, div({id:'dcdialog' + (++globalID), class:"dcdialog",style:{position:'absolute', top:'0px', left:'0px', "z-index":9999}}, template)
  openCallback = options.openCallback
  dlg.open = ->
    openCallback and openCallback()
    # do not use Component.mount, it's not allowed to mount/unmount sub Component
    opened true
    dlg.update()
  closeCallback = options.closeCallback
  dlg.close = ->
    # do not use Component.unmount, it's not allowed to mount/unmount sub Component
    opened false
    dlg.update()
    closeCallback and closeCallback()
  if options.escClose
    dlg.on 'onMount', ->
      escHandler = (event) ->
        esc = 27
        if event.which==esc or event.keyCode==esc
          dlg.close()
      document.body.addEventListener 'keydown', escHandler
    dlg.on 'onUnmount', -> document.body.removeEventListener('keydown', escHandler)
  dlg
