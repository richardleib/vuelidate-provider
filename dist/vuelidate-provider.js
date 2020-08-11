/*!
 * vuelidate-provider v1.3.2 
 * (c) 2020 Denis
 * Released under the MIT License.
 */
var VuelidateProvider = (function (exports) {
  'use strict';

  /*!
   * isobject <https://github.com/jonschlinkert/isobject>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
  }

  /*!
   * get-value <https://github.com/jonschlinkert/get-value>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   */


  var getValue = function (target, path, options) {
    if (!isObject(options)) {
      options = {
        "default": options
      };
    }

    if (!isValidObject(target)) {
      return typeof options["default"] !== 'undefined' ? options["default"] : target;
    }

    if (typeof path === 'number') {
      path = String(path);
    }

    var isArray = Array.isArray(path);
    var isString = typeof path === 'string';
    var splitChar = options.separator || '.';
    var joinChar = options.joinChar || (typeof splitChar === 'string' ? splitChar : '.');

    if (!isString && !isArray) {
      return target;
    }

    if (isString && path in target) {
      return isValid(path, target, options) ? target[path] : options["default"];
    }

    var segs = isArray ? path : split(path, splitChar, options);
    var len = segs.length;
    var idx = 0;

    do {
      var prop = segs[idx];

      if (typeof prop === 'number') {
        prop = String(prop);
      }

      while (prop && prop.slice(-1) === '\\') {
        prop = join([prop.slice(0, -1), segs[++idx] || ''], joinChar, options);
      }

      if (prop in target) {
        if (!isValid(prop, target, options)) {
          return options["default"];
        }

        target = target[prop];
      } else {
        var hasProp = false;
        var n = idx + 1;

        while (n < len) {
          prop = join([prop, segs[n++]], joinChar, options);

          if (hasProp = prop in target) {
            if (!isValid(prop, target, options)) {
              return options["default"];
            }

            target = target[prop];
            idx = n - 1;
            break;
          }
        }

        if (!hasProp) {
          return options["default"];
        }
      }
    } while (++idx < len && isValidObject(target));

    if (idx === len) {
      return target;
    }

    return options["default"];
  };

  function join(segs, joinChar, options) {
    if (typeof options.join === 'function') {
      return options.join(segs);
    }

    return segs[0] + joinChar + segs[1];
  }

  function split(path, splitChar, options) {
    if (typeof options.split === 'function') {
      return options.split(path);
    }

    return path.split(splitChar);
  }

  function isValid(key, target, options) {
    if (typeof options.isValid === 'function') {
      return options.isValid(key, target);
    }

    return true;
  }

  function isValidObject(val) {
    return isObject(val) || Array.isArray(val) || typeof val === 'function';
  }

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
        return path ? getValue(this.validator, path) : this.validator;
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

  exports.VuelidateInjector = VuelidateInjector;
  exports.VuelidateIter = VuelidateIter;
  exports.VuelidateProvider = VuelidateProvider;
  exports.VuelidateProxy = VuelidateProxy;
  exports.default = registerComponents;

  return exports;

}({}));
