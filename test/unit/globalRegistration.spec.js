import { createLocalVue, mount } from '@vue/test-utils';
import VuelidateProvider, {VuelidateInjector} from '../../src';
import Vuelidate from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

const path = 'form.user';

const localVue = createLocalVue();
localVue.use(Vuelidate);
localVue.use(VuelidateProvider);

function createWrapper(template) {
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
    },
    {
      localVue,
    },
  );
}

describe('global registration', () => {
  it('Components should be correct register globally', () => {
    const wrapper = createWrapper(
      `<VuelidateProxy path="${path}">
        <VuelidateInjector path="${path}">${path}</VuelidateInjector>
      </VuelidateProxy>`,
    );
    const injector = wrapper.find(VuelidateInjector);
    expect(injector.text()).toBe(path);
  });
});
