<template >
  <VuelidateProvider :validator="$v">
    <VuelidateProxy path="form.user" v-bind="proxyAttrs" v-on="proxyListeners" #default="{ fullPath }">
      <slot>{{fullPath}}</slot>
    </VuelidateProxy>
  </VuelidateProvider>
</template >

<script >
import { required } from 'vuelidate/lib/validators'
import { VuelidateProvider, VuelidateProxy } from '../../src/components'

export default {
  name: 'ProxyTest',
  components: {VuelidateProvider, VuelidateProxy},
  props: {
    proxyAttrs: {
      type: Object,
      default: () => {}
    },
    proxyListeners: {
      type: Object,
      default: () => {}
    },
  },
  data: () => ({
    form: {
      user: {
        firstName: '',
        lastName: '',
      }
    }
  }),
  validations: {
    form: {
      user: {
        firstName: {required}
      }
    }
  },
}
</script >
