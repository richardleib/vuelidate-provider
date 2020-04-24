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
      return get(this.validator, path);
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
