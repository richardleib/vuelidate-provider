import {VuelidateInjector, VuelidateProxy, VuelidateProvider} from './components';

function registerComponents (Vue, components = {VuelidateInjector, VuelidateProxy, VuelidateProvider}) {
  Object.keys(components).forEach(componentName => {
    Vue.component(componentName, components[componentName])
  })
}

export default registerComponents;
export {VuelidateInjector, VuelidateProxy, VuelidateProvider};