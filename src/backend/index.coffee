import Angular from './Angular'
import Html from './Html'
import React from './React'
import Vue from './Vue'

export default {
  ng: -> new Angular()
  html: -> new Html()
  react: -> new React()
  vue: -> new Vue()
}