import Vue from 'vue'

export default module.exports = Vue.component('hello-vue', {
  props: ['who'],
  render: (h) ->
    debugger
    return h('div', {}, ['hello vue ', this.who])
})