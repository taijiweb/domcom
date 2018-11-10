import Angular from './Angular'
import Html from './Html'
import React from './React'
import Vue from './Vue'

export default {
  Angular,
  Html,
  React,
  Vue,
  ng: -> new Angular()
  html: -> new Html()
  react: -> new React()
  vue: -> new Vue()
}