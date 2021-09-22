import type { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import type { QuotaItem } from '/#/quota';
import { baseChartConfigType } from '/#/chart';

export interface SelectedQuotaItem extends QuotaItem {
  selected: boolean;
  setting?: {
    [key: string]: any;
  };
}

const quotaKey: InjectionKey<Ref<QuotaItem[]>> = Symbol();

export function createQuotaListContext(context: Ref<QuotaItem[]>) {
  return createContext<Ref<QuotaItem[]>>(context, quotaKey, { native: true });
}

export function useQuotaListContext() {
  return useContext<Ref<QuotaItem[]>>(quotaKey);
}

const selectedQuotaKey: InjectionKey<Ref<SelectedQuotaItem[]>> = Symbol();

export function createSelectedQuotaListContext(context: Ref<SelectedQuotaItem[]>) {
  return createContext<Ref<SelectedQuotaItem[]>>(context, selectedQuotaKey, { native: true });
}

export function useSelectedQuotaListContext() {
  return useContext<Ref<SelectedQuotaItem[]>>(selectedQuotaKey);
}

const chartConfigKey: InjectionKey<baseChartConfigType> = Symbol();

export function createChartConfigContext(context: baseChartConfigType) {
  return createContext<baseChartConfigType>(context, chartConfigKey, { native: true });
}

export function useChartConfigContext() {
  return useContext<baseChartConfigType>(chartConfigKey);
}
