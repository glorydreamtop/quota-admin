import { Directive, DirectiveBinding, App, VNode, nextTick } from 'vue';
import { h, render } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { buildShortUUID } from '../utils/uuid';

function makeEventListener(parent: HTMLElement, child: HTMLElement) {
  const types = ['mouseenter', 'mouseleave', 'mousedown', 'mouseup', 'click'];
  for (const type of types) {
    parent.addEventListener(type, () => {
      // 继承原生事件
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent(type, false, true);
      child.dispatchEvent(evt);
    });
  }
}

const map = new Map<string, HTMLElement>();

interface tooltipDom extends HTMLElement {
  created: boolean;
  uniqueId: string;
}

export const tooltipDirective: Directive = {
  created(el: tooltipDom, binding: DirectiveBinding<string | VNode>, vnode: VNode) {
    if (!el.created) {
      el.created = true;
      el.uniqueId = `tooltip${buildShortUUID()}`;
    } else {
      return;
    }
    const isComponent = !vnode.scopeId;
    const { value, arg } = binding;
    const mask = h(el.tagName, {
      style: {
        width: '0px',
      },
      class: 'h-tooltip-helper',
    });
    const tooltipInstance = h(
      Tooltip,
      {
        placement: 'top',
        trigger: arg ?? 'hover',
        destroyTooltipOnHide: true,
        getPopupContainer: () => el,
      },
      {
        title: () => value,
        default: () => mask,
      },
    );
    if (isComponent) {
      const d = document.createElement(el.tagName);
      map.set(el.uniqueId, d);
      render(tooltipInstance, d);
      document.body.appendChild(d);
      const mask = d.querySelector('.h-tooltip-helper') as HTMLElement;
      makeEventListener(el, mask);
    } else {
      render(tooltipInstance, el);
      const mask = el.querySelector('.h-tooltip-helper') as HTMLElement;
      makeEventListener(el, mask);
    }
  },
  mounted(el: tooltipDom) {
    setTimeout(() => {
      const d = map.get(el.uniqueId);
      const { y, x } = el.getBoundingClientRect();
      if (d) {
        Object.assign(d.style, {
          position: 'absolute',
          top: `${y + el.offsetHeight / 2}px`,
          left: `${x + el.offsetWidth / 2}px`,
          width: '0px',
          zIndex: '199',
        });
      } else {
        const mask = el.querySelector('.h-tooltip-helper') as HTMLElement;
        Object.assign(mask.style, {
          transform: `translate(${el.offsetWidth / 2}px, ${el.offsetHeight / 2}px)`,
          width: '0px',
        });
      }
    }, 300);
  },
  beforeUnmount(el: tooltipDom) {
    const d = map.get(el.uniqueId);
    d?.remove();
  },
};

export function setupTooltipDirective(app: App) {
  app.directive('tooltip', tooltipDirective);
}
