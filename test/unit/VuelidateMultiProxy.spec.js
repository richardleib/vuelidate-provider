import { createLocalVue, mount } from '@vue/test-utils';
import { VuelidateProxy } from '../../src';
import MultiProxyTest from './MultiProxyTest'
import Vuelidate from 'vuelidate';

const path = 'form.user';

const localVue = createLocalVue();
localVue.use(Vuelidate);

function createWrapper(options = {}) {
  return mount(
    MultiProxyTest,
    {
      localVue,
      ...options,
    },
  );
}

describe('VuelidateMultiProxy', () => {
  it('Should be stack path', () => {
    const wrapper = createWrapper();

    const proxy = wrapper.find(VuelidateProxy);

    expect(proxy.text()).toBe(path);
  });
});
