import Angular from './Angular'
import Html from './Html'
import React from './React'
import Vue from './Vue'

module.exports = exports = {
  Angular,
  Html,
  React,
  Vue,
  html: (block) ->
    block.setBackend('html')
    return block

  react: (block) ->
    block.setBackend('react')
    return block

  vue: (block) ->
    block.setBackend('vue')
    return block
}
exports.html.by = (tag) ->
  return (props, children) ->
    element = new Element(tag, props, children)
    element.setBackend 'html'
    return element

exports.react.by = (tag) ->
  return (props, children) ->
    element = new Element(tag, props, children)
    element.setBackend 'react'
    return element

exports.vue.by = (tag) ->
  return (props, children) ->
    element = new Element(tag, props, children)
    element.setBackend 'vue'
    return element

export default exports