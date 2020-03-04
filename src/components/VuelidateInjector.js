import { normalizeChildren } from "../utils";

export default {
  name: "VuelidateInjector",
  inject: {
    getValidatorByPath: {
      default: () => () => {}
    },
    getValidatorProxyPath: {
      default: () => () => ""
    }
  },
  props: {
    path: {
      type: String,
      required: true
    }
  },
  computed: {
    fieldProps() {
      return {
        validator: this.validatorByPath,
        validatorPath: this.validatorPath
      };
    },
    validatorByPath() {
      return this.getValidatorByPath(this.path);
    },
    validatorPath() {
      const proxyPath = this.getValidatorProxyPath();
      return proxyPath ? `${proxyPath}.${this.path}` : this.path;
    }
  },
  render() {
    return normalizeChildren(this, this.fieldProps);
  }
};
