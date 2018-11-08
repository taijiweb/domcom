import {expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

{isComponent} = dc

module.exports = (testModule, description, singleTestName, unmount=true) ->
  describe description, ->
    if singleTestName
      iit 'should '+singleTestName, ->
        value = testModule[singleTestName]
        if typeof value == 'function'
          value = value()
        if isComponent(value)
          value.mount()
          value.render()
          if unmount
            value.unmount()
    else
      for name, value of testModule
        do (name=name, value=value) ->
          it 'should '+name, ->
            if typeof value == 'function'
              value = value()
            if isComponent(value)
              value.mount()
              value.render()
              if unmount
                value.unmount()