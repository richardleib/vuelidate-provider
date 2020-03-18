# vuelidate-provider

## Installation
```bash
npm install vuelidate-provider --save
```
or
```bash
yarn add vuelidate-provider
```

You can import the library and use as a Vue plugin to component globally registration.

```javascript
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VuelidateProvider from 'vuelidate-provider'
Vue.use(Vuelidate)
Vue.use(VuelidateProvider)
```

Alternatively it is possible to import a components directly for each components.

```javascript
import {VuelidateProvider, VuelidateProxy, VuelidateInjector} from 'vuelidate-provider'

var Component = Vue.extend({
  mixins: [validationMixin],
  components: {VuelidateProvider, VuelidateProxy, VuelidateInjector},
  validations: { ... }
})
```

## Basic usage

Use `VuelidateProvider`/`VuelidateInjector` components for provide/inject vuelidate object.

```vue
<template>
	<vuelidate-provider :validator="$v">
		<vuelidate-injector path="form.name" #default="{validator ,validatorPath}">
			<div>
				<label>{{validatorPath}}</label>
				<input v-model="validator.$model">
				<div v-show="validator.$error">error</div>
			</div>
		</vuelidate-injector>
	</vuelidate-provider>
</template>
<script>
  import {required} from 'vuelidate/lib/validators'

  export default {
    data () {
      return {
        form: {
          name: ''
        },
      }
    },
    validations: {
      form: {
        name: {
          required,
        }
      }
    }
  }
</script>
```

## Changelog
Detailed changes for each release are documented in the [CHANGELOG.md](https://github.com/leonied7/vuelidate-provider/blob/master/CHANGELOG.md).
