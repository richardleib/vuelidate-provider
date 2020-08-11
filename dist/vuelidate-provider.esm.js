/*!
 * vuelidate-provider v1.3.3 
 * (c) 2020 Denis
 * Released under the MIT License.
 */
import get from '@d_hristov/get-value';

var VuelidateProvider = {
  name: "VuelidateProvider",
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  methods: {
    getValidatorByPath: function getValidatorByPath(path) {
      return path ? get(this.validator, path) : this.validator;
    }
  },
  render: function render(h) {
    return h("div", this.$slots.default);
  },
  provide: function provide() {
    return {
      getValidatorByPath: this.getValidatorByPath
    };
  }
};

function normalizeChildren(context, slotProps) {
  if (context.$scopedSlots.default) {
    return context.$scopedSlots.default(slotProps);
  }

  return context.$slots.default || [];
}

var VuelidateProxy = {
  name: "VuelidateProxy",
  inject: {
    getParentValidatorByPath: {
      from: "getValidatorByPath"
    },
    getParentValidatorProxyPath: {
      from: "getValidatorProxyPath",
      default: function () { return function () {}; }
    }
  },
  props: {
    path: {
      type: String,
      required: true
    },
    slim: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    slotProps: function slotProps() {
      return {
        fullPath: this.fullProxyPath
      };
    },
    fullProxyPath: function fullProxyPath() {
      var parentProxyPath = this.getParentValidatorProxyPath();
      return parentProxyPath ? (parentProxyPath + "." + (this.path)) : this.path;
    }
  },
  methods: {
    getValidatorByPath: function getValidatorByPath(path) {
      var fullPath = path ? ((this.path) + "." + path) : this.path;
      return this.getParentValidatorByPath(fullPath);
    }
  },
  provide: function provide() {
    var this$1 = this;

    return {
      getValidatorByPath: this.getValidatorByPath,
      getValidatorProxyPath: function () { return this$1.fullProxyPath; }
    };
  },
  render: function render(h) {
    var children = normalizeChildren(this, this.slotProps);

    return this.slim && children.length <= 1
      ? children[0]
      : h(this.tag, { on: this.$listeners }, children);
  }
};

var VuelidateInjector = {
  name: "VuelidateInjector",
  inject: {
    getValidatorByPath: {},
    getValidatorProxyPath: {
      default: function () { return function () { return ""; }; }
    }
  },
  props: {
    path: {
      type: String,
      default: ""
    }
  },
  computed: {
    fieldProps: function fieldProps() {
      return {
        validator: this.validatorByPath,
        validatorPath: this.validatorPath
      };
    },
    validatorByPath: function validatorByPath() {
      return this.getValidatorByPath(this.path);
    },
    validatorPath: function validatorPath() {
      var proxyPath = this.getValidatorProxyPath();
      return proxyPath ? (proxyPath + "." + (this.path)) : this.path;
    }
  },
  render: function render() {
    if(!this.validatorByPath) {
      throw new Error(("[Vuelidate-provider]: validator by path '" + (this.validatorPath) + "' doesn't exists"));
    }
    return normalizeChildren(this, this.fieldProps);
  }
};

var VuelidateIter = {
  name: "VuelidateIter",
  components: { VuelidateProxy: VuelidateProxy },
  props: {
    path: {
      type: String,
      default: ""
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  inject: {
    getValidatorByPath: {
      from: "getValidatorByPath"
    }
  },
  computed: {
    validator: function validator() {
      return this.getValidatorByPath(this.path);
    }
  },
  render: function render(h) {
    var this$1 = this;

    return h(
      this.tag,
      Object.values(this.validator.$each.$iter).map(function (iter, index) {
        return h(VuelidateProxy, {
          props: { path: ((this$1.path) + ".$each." + index) },
          scopedSlots: this$1.$scopedSlots,
          slot: this$1.$slots.default
        });
      })
    );
  }
};

function registerComponents (Vue, components) {
  if ( components === void 0 ) components = {VuelidateInjector: VuelidateInjector, VuelidateProxy: VuelidateProxy, VuelidateProvider: VuelidateProvider, VuelidateIter: VuelidateIter};

  Object.keys(components).forEach(function (componentName) {
    Vue.component(componentName, components[componentName]);
  });
}

export default registerComponents;
export { VuelidateInjector, VuelidateIter, VuelidateProvider, VuelidateProxy };
