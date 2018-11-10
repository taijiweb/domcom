import Angular from './Angular'
import Html from './Html'
import React from './React'
import Vue from './Vue'

module.exports = exports = {
  Angular,
  Html,
  React,
  Vue,
  ng: -> new Angular()
  html: -> new Html()
  react: -> new React()
  vue: -> new Vue()
}

export default exports