import { createLocalVue, mount } from '@vue/test-utils';
import { VuelidateProvider, VuelidateProxy, VuelidateInjector } from '../../src';
import Vuelidate from 'vuelidate';
import get from '@d_hristov/get-value';
import { required } from 'vuelidate/lib/validators';

const path = 'form.user';

const localVue = createLocalVue();
localVue.use(Vuelidate);

function createWrapper(template, components) {
  return mount(
    {
      template: `<VuelidateProvider :validator="$v">${template}</VuelidateProvider>`,
      data: () => ({
        form: {
          user: {
            firstName: '',
            lastName: '',
          }
        }
      }),
      validations: {
        form: {
          user: {
            firstName: {required}
          }
        }
      },
      components: { VuelidateProvider, ...components },
    },
    {
      localVue,
    },
  );
}

describe('VuelidateInjector', () => {
  it('Should be inject validator by path', () => {
    const wrapper = createWrapper(
      `<VuelidateInjector path="${path}">test</VuelidateInjector>`,
      { VuelidateInjector }
    );
    const injector = wrapper.find(VuelidateInjector);
    expect(get(wrapper.vm.$v, path)).toBe(injector.vm.fieldProps.validator);
  });

  it('Should be inject validator without path', () => {
    const wrapper = createWrapper(
      `<VuelidateInjector>test</VuelidateInjector>`,
      { VuelidateInjector }
    );
    const injector = wrapper.find(VuelidateInjector);
    expect(wrapper.vm.$v).toBe(injector.vm.fieldProps.validator);
  });

  it('Should be inject validator by path with proxy', () => {
    const injectPath = 'firstName';
    const wrapper = createWrapper(
      `<VuelidateProxy path="${path}">
        <VuelidateInjector path="${injectPath}">test</VuelidateInjector>
      </VuelidateProxy>`,
      { VuelidateProxy, VuelidateInjector }
    );
    const injector = wrapper.find(VuelidateInjector);
    expect(get(wrapper.vm.$v, `${path}.${injectPath}`)).toBe(injector.vm.fieldProps.validator);
  });

  it('Should be inject validator without path with proxy', () => {
    const wrapper = createWrapper(
      `<VuelidateProxy path="${path}">
        <VuelidateInjector />
      </VuelidateProxy>`,
      { VuelidateProxy, VuelidateInjector }
    );
    const injector = wrapper.find(VuelidateInjector);
    expect(get(wrapper.vm.$v, path)).toBe(injector.vm.fieldProps.validator);
  });
});
