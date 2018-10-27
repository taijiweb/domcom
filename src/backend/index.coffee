import Angular from './Angular'
import Html from './Html'
import Html from './React'
import Html from './Vue'

export default {
  ng: -> new Angular()
  html: -> new Html()
  react: -> new React()
  vue: -> new Vue()
}