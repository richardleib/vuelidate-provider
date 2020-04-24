import { createLocalVue, mount } from '@vue/test-utils';
import { elementContent } from './utils';
import { VuelidateProxy } from '../../src';
import ProxyTest from './ProxyTest'
import Vuelidate from 'vuelidate';

const path = 'form.user';

const localVue = createLocalVue();
localVue.use(Vuelidate);

function createWrapper(options = {}) {
  return mount(
    ProxyTest,
    {
      localVue,
      ...options,
    },
  );
}

describe('VuelidateProxy', () => {
  it('Should render slot', () => {
    const wrapper = createWrapper();

    const proxy = wrapper.find(VuelidateProxy);

    expect(proxy.text()).toBe(path);
  });

  it('Should render slim mode', async () => {
    const wrapper = createWrapper();

    const proxy = wrapper.find(VuelidateProxy);

    expect(proxy.is('div')).toBe(true);

    wrapper.setProps({
      proxyAttrs: {
        slim: true
      }
    });
    await wrapper.vm.$nextTick();

    expect(proxy.is('div')).not.toBe(true);
    expect(proxy.text()).toBe(path);
  });

  it('Should render tag if plural slots in slim proxy', () => {
    const slotItem = '<span>123</span>';
    const wrapper = createWrapper({
      propsData: {
        proxyAttrs: {
          slim: true
        }
      },
      slots: {
        default: [slotItem, slotItem],
      }
    });

    const proxy = wrapper.find(VuelidateProxy);

    expect(proxy.is('div')).toBe(true);
    expect(elementContent(proxy)).toBe(`<div>${slotItem}${slotItem}</div>`);
  });

  it('Should render custom tag', () => {
    const wrapper = createWrapper({
      propsData: {
        proxyAttrs: {
          tag: 'form'
        },
      },
    });

    const proxy = wrapper.find(VuelidateProxy);

    expect(proxy.is('form')).toBe(true);
  });

  it('Should add events', () => {
    const clickMethod = jest.fn();
    const wrapper = createWrapper({
      propsData: {
        proxyAttrs: {
          tag: 'button'
        },
        proxyListeners: {
          click: clickMethod
        }
      }
    });

    const proxy = wrapper.find(VuelidateProxy);
    proxy.trigger('click');

    expect(clickMethod).toBeCalled();
  });
});
