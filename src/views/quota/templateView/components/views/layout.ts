import { useMutationObserver } from '@vueuse/core';
import { onMounted, Ref } from 'vue';

interface infoType extends DOMRect {
  page: number;
}

type layoutInfoNodeMap = Map<Element, infoType>;

const layoutInfo: layoutInfoNodeMap = new Map();

const pagesInfo: infoType[] = [];

function setPagesInfo(dom: HTMLElement) {
  const doms = Array.from(dom.getElementsByClassName('page-main'));
  pagesInfo.length = 0;
  doms.forEach((page, index) => {
    const info = page.getBoundingClientRect();
    pagesInfo.push({
      page: index,
      ...info,
    });
  });
}

function setItem(el: Element, rect: infoType) {
  layoutInfo.set(el, rect);
}

function getItem(el: Element) {
  return layoutInfo.get(el);
}

function removeItem() {}

function updateNextAll(el: HTMLElement) {
  let e = el.nextElementSibling;
  while (e?.nextElementSibling) {
    setItem(e, e?.getBoundingClientRect());
    e = e.nextElementSibling;
  }
}

export function useLayout(container: Ref<HTMLElement | undefined>) {
  onMounted(() => {
    useMutationObserver(
      container,
      ([{ target }]) => {
        if (target) {
          const el = target as HTMLElement;
          const rect = el.getBoundingClientRect();
          setItem(el, { ...rect, page: 1 });
          updateNextAll(el);
        }
      },
      {
        childList: true,
      },
    );
  });
  return { setItem, getItem, removeItem, setPagesInfo };
}
