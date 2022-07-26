import { useMutationObserver } from '@vueuse/core';
import { omit } from 'lodash-es';
import { onMounted, Ref } from 'vue';

interface infoType {
  page: number;
  next?: HTMLElement;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

type layoutInfoNodeMap = Map<Element, infoType>;

const layoutInfo: layoutInfoNodeMap = new Map();

const pagesInfo: Omit<infoType, 'next'>[] = [];

// function getRect(el: HTMLElement | null) {
//   const rect = {
//     width: el?.offsetWidth ?? 0,
//     height: el?.offsetHeight ?? 0,
//     top: el?.offsetTop ?? 0,
//     left: el?.offsetLeft ?? 0,
//     bottom: (el?.offsetTop ?? 0) + (el?.offsetHeight ?? 0),
//     right: (el?.offsetWidth ?? 0) + (el?.offsetLeft ?? 0),
//   };
//   return rect;
// }

function setPagesInfo(dom: HTMLElement) {
  const doms = Array.from(dom.getElementsByClassName('page-main'));
  pagesInfo.length = 0;
  doms.forEach((page, index) => {
    const rect = page.getBoundingClientRect();
    pagesInfo.push({
      page: index + 1,
      ...omit(rect, 'toJSON'),
    });
  });
}

function setItem(el: Element | null, rect: infoType) {
  if (!el) return;
  layoutInfo.set(el, rect);
}

function getItem(el: Element) {
  return layoutInfo.get(el);
}

function removeItem(el: Element) {
  layoutInfo.delete(el);
}

function updateNextAll(el: Element | null) {
  while (el?.nextElementSibling?.hasAttribute('data-uniqid')) {
    el = el.nextElementSibling;
    setItem(el, {
      ...omit(el.getBoundingClientRect(), 'toJSON'),
      page: checkIntersect(el as HTMLElement),
    });
    console.log('处理', el);
  }
}

function checkIntersect(el: HTMLElement) {
  let pageIndex = NaN;
  el.style.marginTop = '0';
  const { top: elTop, bottom: elBottom } = el.getBoundingClientRect();
  for (let index = 0; index < pagesInfo.length; index++) {
    const { top, bottom, page } = pagesInfo[index];
    if (top <= elTop && bottom >= elBottom) {
      pageIndex = page;
      el.style.marginTop = '0';
    }
    if (Number.isNaN(pageIndex) && top <= elTop && bottom >= elTop && bottom < elBottom) {
      pageIndex = page + 1;
      const { top: shouldPageTop } = pagesInfo.find((_page) => _page.page === pageIndex)!;
      el.style.marginTop = `${shouldPageTop - elTop}px`;
    }
    if (pageIndex) break;
  }
  return pageIndex;
}

export function useLayout(container: Ref<HTMLElement | undefined>) {
  onMounted(() => {
    const pagePlaceHolder = document.getElementById('pagePlaceHolder') as HTMLDivElement;
    useMutationObserver(
      container,
      ([{ addedNodes, removedNodes }]) => {
        setPagesInfo(pagePlaceHolder);
        if (addedNodes.length > 0) {
          const el = addedNodes[0] as HTMLElement;
          const rect = el.getBoundingClientRect();
          setItem(el, { ...omit(rect, 'toJSON'), page: checkIntersect(el) });
          if (el.previousElementSibling) {
            setItem(el.previousElementSibling, {
              page: getItem(el)?.page,
              ...omit(el.previousElementSibling.getBoundingClientRect(), 'toJSON'),
              next: el,
            });
          }
          updateNextAll(addedNodes[addedNodes.length - 1] as HTMLElement);
        }
        if (removedNodes.length > 0) {
          const lastNode = removedNodes[removedNodes.length - 1] as HTMLElement;
          const preNode = (removedNodes[0] as HTMLElement).previousElementSibling;
          const next = getItem(lastNode)?.next;
          if (preNode) {
            setItem(preNode, { ...getItem(preNode)!, next });
          }
          if (next) {
            // next.style.marginTop = '0';
            console.log(next);

            updateNextAll(next.previousElementSibling);
          }
          removedNodes.forEach((el: HTMLElement) => {
            removeItem(el);
          });
        }
      },
      {
        childList: true,
      },
    );
  });
  return { setItem, getItem, removeItem, setPagesInfo };
}
