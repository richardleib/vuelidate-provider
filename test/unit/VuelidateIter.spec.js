import { createLocalVue, mount } from '@vue/test-utils';
import { VuelidateProvider, VuelidateProxy, VuelidateIter } from '../../src';
import Vuelidate from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { elementContent } from './utils'

const localVue = createLocalVue();
localVue.use(Vuelidate);

const path = 'roles';
const roles = [
  {
    id: 1,
    caption: 'admin',
    description: ''
  },
  {
    id: 2,
    caption: 'manager',
    description: ''
  }
]

function createWrapper(template, components) {
  return mount(
    {
      template: `<VuelidateProvider :validator="$v">${template}</VuelidateProvider>`,
      data: () => ({
        roles
      }),
      validations: {
        roles: {
          $each: {
            id: {required},
            caption: {required},
            description: {},
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

describe('VuelidateIter', () => {
  it('Should render proxy for each item', () => {
    const wrapper = createWrapper(
      `<VuelidateIter path="${path}" #default="{fullPath}">{{fullPath}}</VuelidateIter>`,
      { VuelidateIter }
    );
    const proxyWrappers = wrapper.findAll(VuelidateProxy);
    expect(proxyWrappers.length).toBe(roles.length);
    proxyWrappers.wrappers.forEach((proxy, index) => {
      expect(proxy.text()).toBe(`${path}.$each.${index}`);
    });
  });

  it('Should render correct tag', async () => {
    const wrapper = createWrapper(
      `<VuelidateIter path="${path}" />`,
      { VuelidateIter }
    );
    const iterWrapper = wrapper.find(VuelidateIter);
    const content = roles.reduce(result => result + '<div></div>', '');

    expect(elementContent(iterWrapper)).toBe(`<div>${content}</div>`);

    iterWrapper.setProps({
      tag: 'span'
    });
    await iterWrapper.vm.$nextTick();

    expect(elementContent(iterWrapper)).toBe(`<span>${content}</span>`);
  });

  it('Should set props for proxy', async () => {
    const proxyProps = { tag: 'span' };
    const wrapper = createWrapper(
      `<VuelidateIter path="${path}" />`,
      { VuelidateIter }
    );
    const iterWrapper = wrapper.find(VuelidateIter);
    iterWrapper.setProps({ proxyProps });
    await iterWrapper.vm.$nextTick();

    const proxyWrapper = wrapper.find(VuelidateProxy);
    expect(proxyWrapper.props('tag')).toBe('span');
  });
});
