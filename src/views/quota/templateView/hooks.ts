import { InjectionKey, ref, Ref, watchEffect } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import type { TemplateDOM, TemplateItem } from '/#/template';
import { remove } from 'lodash-es';
import { useMagicKeys } from '@vueuse/core';

const templateKey: InjectionKey<Ref<Array<TemplateItem & { uniqId: string }>>> = Symbol();

export function createTemplateListContext(context: Ref<TemplateDOM[]>) {
  return createContext<Ref<Array<TemplateDOM>>>(context, templateKey, { native: true });
}

export function useTemplateListContext() {
  return useContext<Ref<Array<TemplateDOM>>>(templateKey);
}

const pageConfigKey: InjectionKey<any> = Symbol();

export function createPageConfigContext(context: any) {
  return createContext<any>(context, pageConfigKey, { native: true });
}

export function usePageConfigContext() {
  return useContext<any>(pageConfigKey);
}

type useMultiSelectRes = [
  Ref<string[]>,
  { insertSelectKey: (temp: TemplateDOM, nativeEvent: PointerEvent) => void }
];

export function useMultiSelect(templateList: Ref<TemplateDOM[]>): useMultiSelectRes {
  const { Ctrl_A } = useMagicKeys({
    passive: false,
    onEventFired(e) {
      if (e.ctrlKey && e.key === 'a' && e.type === 'keydown') {
        e.preventDefault();
      }
    },
  });

  watchEffect(() => {
    if (Ctrl_A.value) selectTemplateList.value = templateList.value.map((temp) => temp.uniqId);
  });

  const selectTemplateList = ref<string[]>([]);

  function insertSelectKey(temp: TemplateDOM, nativeEvent: PointerEvent) {
    const list = selectTemplateList.value;
    if (nativeEvent.ctrlKey) {
      const idx = list.findIndex((t) => t === temp.uniqId);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(temp.uniqId);
      }
    } else if (nativeEvent.shiftKey) {
      // Shift多选
      let minIndex = Infinity;
      let maxIndex = 0;
      for (let i = 0; i < list.length; i++) {
        minIndex = Math.min(
          templateList.value.findIndex((item) => item.uniqId === list[i]),
          minIndex
        );
        maxIndex = Math.max(
          templateList.value.findIndex((item) => item.uniqId === list[i]),
          maxIndex
        );
      }
      const currentIndex = templateList.value.findIndex((item) => item.uniqId === temp.uniqId);
      if (currentIndex < minIndex) {
        minIndex = currentIndex;
      }
      if (currentIndex > maxIndex) {
        maxIndex = currentIndex;
      }
      for (let index = minIndex; index <= maxIndex; index++) {
        const key = templateList.value[index].uniqId;
        if (list.findIndex((t) => t === key) === -1) {
          list.push(key);
        }
      }
    } else {
      remove(list, (_) => _);
      list.push(temp.uniqId);
    }
  }
  return [selectTemplateList, { insertSelectKey }];
}

export interface TemplateListMapType {
  [key: string]: TemplateDOM;
}
