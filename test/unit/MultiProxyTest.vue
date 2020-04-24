<template >
  <VuelidateProvider :validator="$v">
    <VuelidateProxy path="form">
      <VuelidateProxy path="user" #default="{ fullPath }">
        <slot>{{fullPath}}</slot>
      </VuelidateProxy>
    </VuelidateProxy>
  </VuelidateProvider>
</template >

<script >
import { required } from 'vuelidate/lib/validators'
import { VuelidateProvider, VuelidateProxy } from '../../src/components'

export default {
  name: 'ProxyTest',
  components: {VuelidateProvider, VuelidateProxy},
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
