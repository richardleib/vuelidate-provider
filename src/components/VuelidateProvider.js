import get from "@d_hristov/get-value";

export default {
  name: "VuelidateProvider",
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  methods: {
    getValidatorByPath(path) {
      return path ? get(this.validator, path) : this.validator;
    }
  },
  render(h) {
    return h("div", this.$slots.default);
  },
  provide() {
    return {
      getValidatorByPath: this.getValidatorByPath
    };
  }
};
