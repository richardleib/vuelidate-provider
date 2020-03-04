import Vue from 'vue'
import vuelidate from 'vuelidate/src'
import vuelidateProvider from '../../src/index.js'
import testForm from './TestForm.vue'

Vue.use(vuelidate)
Vue.use(vuelidateProvider)

new Vue({
  el: '#app',
  render: h => h(testForm),
})