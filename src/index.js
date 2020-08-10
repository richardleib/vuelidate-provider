import {VuelidateInjector, VuelidateProxy, VuelidateProvider, VuelidateIter} from './components';

function registerComponents (Vue, components = {VuelidateInjector, VuelidateProxy, VuelidateProvider, VuelidateIter}) {
  Object.keys(components).forEach(componentName => {
    Vue.component(componentName, components[componentName])
  })
}

export default registerComponents;
export {VuelidateInjector, VuelidateProxy, VuelidateProvider, VuelidateIter};
