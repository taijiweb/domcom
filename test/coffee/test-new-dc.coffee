import {expect, iit, idescribe, nit, ndescribe, newDemoNode} = require('bdd-test-helper')

import {newDemoNode}  from './helper'

{
bindings, see
Tag, Text, List, txt, list
p, div, Html, html
classFn, styleFrom,
Nothing
isComponent
getters
} = dc
# {at} = getters

import React from '../../src/backend/React'

{a_} = bindings({a: 1, b: 2})

describe "test-base-component", ->
  afterEach ->
    dc.reset()

  describe 'update BaseBlock', ->
    it 'should dc generate a component', ->
      comp = dc()
      expect(isComponent(comp)).to.be.true

    it 'dc() chaining call', ->
      v = at('x y')
      d = {x, y}
      comp = dc.div(v).with(d)

    it 'dc.react should be an backend', ->
      debugger
      dr = dc.react() #
      expect(dr).to.be.instanceof(React)
