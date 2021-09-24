import type { InjectionKey, Ref } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import type { QuotaItem } from '/#/quota';
import { chartConfigType, normalQuotaSettingType } from '/#/chart';

export interface SelectedQuotaItem extends QuotaItem {
  selected: boolean;
  setting: normalQuotaSettingType;
}

const quotaKey: InjectionKey<Ref<SelectedQuotaItem[]>> = Symbol();

export function createQuotaListContext(context: Ref<QuotaItem[]>) {
  return createContext<Ref<SelectedQuotaItem[]>>(context, quotaKey, { native: true });
}

export function useQuotaListContext() {
  return useContext<Ref<SelectedQuotaItem[]>>(quotaKey);
}

const selectedQuotaKey: InjectionKey<Ref<SelectedQuotaItem[]>> = Symbol();

export function createSelectedQuotaListContext(context: Ref<SelectedQuotaItem[]>) {
  return createContext<Ref<SelectedQuotaItem[]>>(context, selectedQuotaKey, { native: true });
}

export function useSelectedQuotaListContext() {
  return useContext<Ref<SelectedQuotaItem[]>>(selectedQuotaKey);
}

const chartConfigKey: InjectionKey<chartConfigType> = Symbol();

export function createChartConfigContext(context: chartConfigType) {
  return createContext<chartConfigType>(context, chartConfigKey, { native: true });
}

export function useChartConfigContext() {
  return useContext<chartConfigType>(chartConfigKey);
}
