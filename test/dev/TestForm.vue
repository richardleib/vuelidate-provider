<template>
  <div>
    <button @click="show = !show">Toggle inputs</button>
    <vuelidate-provider v-if="show" :validator="$v">
      <label>Without proxy</label>
      <vuelidate-injector path="test" #default="{validator ,validatorPath}">
        <div>
          <label>{{validatorPath}}</label>
          <input v-model="validator.$model">
          <div v-show="validator.$error">error</div>
        </div>
      </vuelidate-injector>
      <label>With proxy</label>
      <vuelidate-proxy path="nestedObject">
        <vuelidate-injector path="first_name" #default="{validator ,validatorPath}">
          <div>
            <label>{{validatorPath}}</label>
            <input v-model="validator.$model">
            <div v-show="validator.$error">error</div>
          </div>
        </vuelidate-injector>
        <vuelidate-injector path="last_name" #default="{validator ,validatorPath}">
          <div>
            <label>{{validatorPath}}</label>
            <input v-model="validator.$model">
            <div v-show="validator.$error">error</div>
          </div>
        </vuelidate-injector>
        <vuelidate-injector path="email" #default="{validator ,validatorPath}">
          <div>
            <label>{{validatorPath}}</label>
            <input type="email" v-model="validator.$model">
            <div v-show="validator.$error">error</div>
          </div>
        </vuelidate-injector>
        <label>With nested proxy</label>
        <vuelidate-proxy path="address">
          <vuelidate-injector path="street" #default="{validator ,validatorPath}">
            <div>
              <label>{{validatorPath}}</label>
              <input v-model="validator.$model">
              <div v-show="validator.$error">error</div>
            </div>
          </vuelidate-injector>
          <vuelidate-injector path="city" #default="{validator ,validatorPath}">
            <div>
              <label>{{validatorPath}}</label>
              <input v-model="validator.$model">
              <div v-show="validator.$error">error</div>
            </div>
          </vuelidate-injector>
          <vuelidate-injector path="postal" #default="{validator ,validatorPath}">
            <div>
              <label>{{validatorPath}}</label>
              <input v-model="validator.$model">
              <div v-show="validator.$error">error</div>
            </div>
          </vuelidate-injector>
        </vuelidate-proxy>
        <label>With iter</label>
        <vuelidate-iter path="phones">
          <vuelidate-injector path="model" #default="{validator ,validatorPath}">
            <div>
              <label>{{validatorPath}}</label>
              <input v-model="validator.$model">
              <div v-show="validator.$error">error</div>
            </div>
          </vuelidate-injector>
        </vuelidate-iter>
      </vuelidate-proxy>
    </vuelidate-provider>
  </div>
</template>

<script>
  import required from 'vuelidate/lib/validators/required'
  import minLength from 'vuelidate/lib/validators/minLength'
  import maxLength from 'vuelidate/lib/validators/maxLength'
  import email from 'vuelidate/lib/validators/email'
  import numeric from 'vuelidate/lib/validators/numeric'

  export default {
    data () {
      return {
        show: true,
        test: 'qwe123',
        nestedObject: {
          first_name: '',
          last_name: '',
          email: '',
          address: {
            street: '',
            city: '',
            postal: ''
          },
          phones: [
            {
              model: '',
              brand: ''
            },
          ]
        },
      }
    },
    validations: {
      test: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10)
      },
      nestedObject: {
        first_name: { required, minLength: minLength(3), maxLength: maxLength(20), numeric },
        last_name: { required, minLength: minLength(3), maxLength: maxLength(20) },
        email: { required, email },
        address: {
          street: { required, minLength: minLength(5) },
          city: { required, minLength: minLength(5) },
          postal: { required }
        },
        phones: {
          $each: {
            model: { required },
            brand: { minLength: minLength(8) }
          }
        }
      }
    }
  }
</script>
