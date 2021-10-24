import type { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import type { TemplateItem } from '/#/template';

const templateKey: InjectionKey<Ref<TemplateItem[]>> = Symbol();

export function createTemplateListContext(context: Ref<TemplateItem[]>) {
  return createContext<Ref<TemplateItem[]>>(context, templateKey, { native: true });
}

export function useTemplateListContext() {
  return useContext<Ref<TemplateItem[]>>(templateKey);
}
