{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeDomElement} = require '../../src/dom-util'
{normalizeItem} = require 'dc-util'
{isComponent} = dc

import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import blue from '@material-ui/core/colors/blue'

describe "test-material-ui", ->
  beforeEach ->
    demoNode = normalizeDomElement('#demo')
    if demoNode.childNodes.length
      node = demoNode.childNodes[0]
      demoNode.removeChild(node)

    # tell React do not warn about this
    demoNode._reactRootContainer = undefined
    return

  describe 'mount some material-ui dc components', ->
     it 'simple material-ui Button', ->
       view =  ['div'
        [Button, {variant:"contained", color:"primary"},'primary'],
        [Button, 'Default'],
        [Button, {variant:"dashed", color:"secondary", disabled:true},'secondary'],
        [Button, {variant:"danger", color:"danger"},'danger']
       ]
       comp = dc {view}
       comp.mount('#demo')

    it 'test a dialog', ->
      debugger
      data = {
        emails:[],
        open:true,
        handleListItemClick: ->
          alert 'handleListItemClick'
          data.open = false
          dc.update()
        handleClose: ->
          data.open = false
          dc.update()
          alert 'handleClose'
      }
      view = (data) ->
        [Dialog, {onClose:data.handleClose, 'aria-labelledby':"simple-dialog-title", open:data.open, className:''},
            [DialogTitle, "#simple-dialog-title", {key:dc.dcid++}, "Set backup account"],
            ['div',
              [List,{className:'', key:dc.dcid++}
                data.emails.map((email) =>
                  [ListItem, {button:true, onClick:(() => data.handleListItemClick(email)), key:email, className:''},
                    [ListItemText, {primary:email, className:'', key:email}]
                  ]),
               [ListItem, {button:true, key:dc.dcid++, onClick:() => data.handleListItemClick('addAccount')}]]]]


      comp = dc({data, view})
      comp.mount('#demo')