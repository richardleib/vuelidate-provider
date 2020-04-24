import { createLocalVue, shallowMount } from '@vue/test-utils';
import { VuelidateProvider } from '../../src';
import Vuelidate from 'vuelidate';
import {required} from 'vuelidate/lib/validators';

const localVue = createLocalVue();
localVue.use(Vuelidate);

const componentContent = 'content';

function createWrapper(options = {}) {
  return shallowMount(
    {
      template: `<VuelidateProvider :validator="$v">${componentContent}</VuelidateProvider>`,
      data: () => ({
        firstName: '',
        lastName: '',
      }),
      validations: {
        firstName: {required}
      },
      components: { VuelidateProvider },
    },
    {
      localVue,
      ...options,
    },
  );
}

describe('VuelidateProvider', () => {
  it('Should render slot', () => {
    const wrapper = createWrapper();
    const provider = wrapper.find(VuelidateProvider);
    expect(provider.text()).toBe(componentContent);
    expect(provider.props('validator')).not.toBeUndefined();
  });
});
