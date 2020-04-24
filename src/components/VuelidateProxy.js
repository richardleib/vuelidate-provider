import { normalizeChildren } from "../utils";

export default {
  name: "VuelidateProxy",
  inject: {
    getParentValidatorByPath: {
      from: "getValidatorByPath"
    },
    getParentValidatorProxyPath: {
      from: "getValidatorProxyPath",
      default: () => () => {}
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
    slotProps() {
      return {
        fullPath: this.fullProxyPath
      };
    },
    fullProxyPath() {
      const parentProxyPath = this.getParentValidatorProxyPath();
      return parentProxyPath ? `${parentProxyPath}.${this.path}` : this.path;
    }
  },
  methods: {
    getValidatorByPath(path) {
      const fullPath = path ? `${this.path}.${path}` : this.path;
      return this.getParentValidatorByPath(fullPath);
    }
  },
  provide() {
    return {
      getValidatorByPath: this.getValidatorByPath,
      getValidatorProxyPath: () => this.fullProxyPath
    };
  },
  render(h) {
    const children = normalizeChildren(this, this.slotProps);

    return this.slim && children.length <= 1
      ? children[0]
      : h(this.tag, { on: this.$listeners }, children);
  }
};
