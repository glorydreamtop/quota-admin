import { InjectionKey, Ref } from 'vue';
import { QuotaItem } from '/#/quota';
import { useContext, createContext } from '/@/hooks/core/useContext';

export interface SelectedQuotaItem extends QuotaItem {
  selected: boolean;
}

const quotaKey: InjectionKey<Ref<SelectedQuotaItem[]>> = Symbol();

export function createQuotaListContext(context: Ref<SelectedQuotaItem[]>) {
  return createContext<Ref<SelectedQuotaItem[]>>(context, quotaKey, { native: true });
}

export function useQuotaListContext() {
  return useContext<Ref<SelectedQuotaItem[]>>(quotaKey);
}
