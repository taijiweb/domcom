{dialog, div} = require('domcom/src/index')

module.exports = ->
  onOk = ->
    alert('onOk')
    dlg.close()
  dlg = dialog({
      overlay:true,
      showClose:true
    },
    div({class:'message'}, 'a message', div({onclick:onOk}, 'OK')))
  dlg.open()