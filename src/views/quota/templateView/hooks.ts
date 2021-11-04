import { InjectionKey, ref, Ref, watchEffect } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import type { pageSettingType, TemplateDOM } from '/#/template';
import { remove } from 'lodash-es';
import { useMagicKeys } from '@vueuse/core';

const templateKey: InjectionKey<Ref<TemplateDOM[]>> = Symbol();

export function createTemplateListContext(context: Ref<TemplateDOM[]>) {
  return createContext<Ref<TemplateDOM[]>>(context, templateKey, { native: true });
}

export function useTemplateListContext() {
  return useContext<Ref<TemplateDOM[]>>(templateKey);
}

const selectTemplateKey: InjectionKey<Ref<TemplateDOM[]>> = Symbol();

export function createSelectTemplateListContext(context: Ref<TemplateDOM[]>) {
  return createContext<Ref<TemplateDOM[]>>(context, selectTemplateKey, { native: true });
}

export function useSelectTemplateListContext() {
  return useContext<Ref<TemplateDOM[]>>(selectTemplateKey);
}

const uniqIdKey: InjectionKey<Ref<string[]>> = Symbol();

export function createUniqIdContext(context: Ref<string[]>) {
  return createContext<Ref<string[]>>(context, uniqIdKey, { native: true });
}

export function useUniqIdContext() {
  return useContext<Ref<string[]>>(uniqIdKey);
}

const pageSettingKey: InjectionKey<pageSettingType> = Symbol();

export function createPageSettingContext(context: pageSettingType) {
  return createContext<pageSettingType>(context, pageSettingKey, { native: true });
}

export function usePageSettingContext() {
  return useContext<pageSettingType>(pageSettingKey);
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

export function insertDOM(
  templateList: Ref<TemplateDOM[]>,
  selectedTemplateList: Ref<TemplateDOM[]>,
  cfg: TemplateDOM
) {
  if (selectedTemplateList.value.length === 1) {
    templateList.value.splice(
      templateList.value.findIndex((t) => t.uniqId === selectedTemplateList.value[0].uniqId) + 1,
      0,
      cfg
    );
  } else {
    templateList.value.push(cfg);
  }
}

export interface TemplateListMapType {
  [key: string]: TemplateDOM;
}

export const textTemplate: TemplateDOM = {
  uniqId: 'z',
  type: 'Text',
  pageConfig: {
    width: '33.3%',
    height: '400px',
  },
  config: {
    text: '这里你可以随意书写，并为其添加丰富的样式',
  },
};

export const imgTemplate: TemplateDOM = {
  uniqId: 'z',
  type: 'Img',
  pageConfig: {
    width: '33.3%',
    height: '400px',
  },
  config: {
    url: '',
    mode: 'fill',
  },
};
