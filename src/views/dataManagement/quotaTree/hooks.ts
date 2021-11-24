import { InjectionKey, Ref } from 'vue';
import { QuotaItem } from '/#/quota';
import { useContext, createContext } from '/@/hooks/core/useContext';

const quotaKey: InjectionKey<Ref<QuotaItem[]>> = Symbol();

export function createQuotaListContext(context: Ref<QuotaItem[]>) {
  return createContext<Ref<QuotaItem[]>>(context, quotaKey, { native: true });
}

export function useQuotaListContext() {
  return useContext<Ref<QuotaItem[]>>(quotaKey);
}
