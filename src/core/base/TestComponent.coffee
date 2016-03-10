TransformComponent = require('./TransformComponent')
{funcString, newLine, intersect} = require('dc-util')
{renew} = require('lazy-flow')

ObjectDefineProperty = Object.defineProperty

module.exports = class TestComponent extends TransformComponent

  constructor: (test) ->
    super
    this.__cacheTest = null
    me = this
    this.invalidateHandler = -> me.invalidateTransform()
    if ObjectDefineProperty

      get = -> me._test

      set = (test) ->
        me.setTest(test)
        test

      ObjectDefineProperty(this, 'test', {get, set})

    this.setTest(test)

    this

  getTestValue: ->
    test = this.test
    if typeof test == 'function'
      this.__cacheTest = test.call(this)
    else
      this.__cacheTest = test

  setTest: (test) ->
    oldTest = this.test
    if test == oldTest
      test
    else
      if typeof oldTest == 'function'
        if test == this.__originalTest
          return test
        this.__originalTest.offInvalidate(this.invalidateHandler)

      if ObjectDefineProperty
        testField = '_test'
      else
        testField = 'test'

      if typeof test == 'function'
        this.__originalTest = test
        if !test.invalidate
          test = renew(test)
        test.onInvalidate(this.invalidateHandler)

      if this.__cacheTest != test
        this.invalidateTransform()
      this[testField] = test

