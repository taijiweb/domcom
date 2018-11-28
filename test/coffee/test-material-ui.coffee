{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeItem, normalizeDomElement} = require 'dc-util'
{isComponent} = dc

import React, {Component} from 'react'
import ReactDom from 'react-dom'
dc.addReactProxy React, ReactDom, Component


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
import PersonIcon from '@material-ui/icons/Person'
import AddIcon from '@material-ui/icons/Add'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Divider from '@material-ui/core/Divider'
import Slide from '@material-ui/core/Slide'


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
      data = {
        emails:['x1@y.z', 'x2@y.z', 'x3@y.z'],
        open:true,
        handleListItemClick: (message)->
          alert 'handleListItemClick: ' + message
          data.open = false
          dc.update()
        handleClose: ->
          data.open = false
          dc.update()
      }
      view = (data) ->
        [Dialog, {onClose:data.handleClose, 'aria-labelledby':"simple-dialog-title", open:data.open, className:''},
            [DialogTitle, "#simple-dialog-title", {key:dc.dcid++}, "Set backup account"],
            ['div', {key:dc.dcid++}
              [List,{className:'', key:dc.dcid++}
                data.emails.map((email) =>
                  [ListItem, {button:true, onClick:(() => data.handleListItemClick(email)), key:email, className:''},
                  #[ListItemAvatar, [Avatar, [PersonIcon]]],
                  [ListItemText, {primary:email, className:'', key:email}, email]
                  ]),
               [ListItem, {button:true, key:dc.dcid++, onClick:() => data.handleListItemClick('addAccount')}, 'add account']]]]
      comp = dc({data, view})
      comp.mount('#demo')


  it 'test a dialog 2', ->
    Transition = (props) ->
      React.createElement(Slide, {direction:"up", props...})
    data =
      emails: ['x1@y.z', 'x2@y.z', 'x3@y.z'],
      open:true,
      handleListItemClick: (message)->
        alert 'handleListItemClick: ' + message
        data.open = false
        dc.update()

      handleClickOpen: ->
        data.open = true
        dc.update()

      close: ->
        data.open = false
        dc.update()

    view = (data) ->
      ['div',
        [Button, {onClick:data.handleClickOpen}, "Open full-screen dialog"],
          [Dialog, {fullScreen:true, open:data.open, onClose:data.close, TransitionComponent:Transition},
            [AppBar, '.appBar',
              [Toolbar,
                [IconButton, {color:"inherit", onClick:data.close, 'aria-label':"Close"}, [CloseIcon]],
                [Typography, {variant:"h6", color:"inherit", className:'.flex'}, 'Sound']
                [Button, {color:"inherit",  onClick:data.close}, "save"]
              ]],
            [List,
              [ListItem, {button:true},
                [ListItemText, {primary:"Phone ringtone", secondary:"Titania"}]],
              [Divider]
              [ListItem, {button:true},
                [ListItemText, {primary:"Default notification ringtone", secondary:"Tethys"}]]]]]
    comp = dc({data, view})
    comp.mount('#demo')