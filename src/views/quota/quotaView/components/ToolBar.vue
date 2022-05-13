<template>
  <div class="absolute top-0 right-0 overflow-hidden z-9 w-18 h-18" @click="paint">
    <div
      v-ripple
      class="w-36 h-36 !absolute -right-18 -top-18 bg-linear-primary rounded-1 cursor-pointer"
    >
      <Icon class="absolute left-7 bottom-7" size="32" color="#fff" icon="ph:paint-brush-light" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick } from 'vue';
  import vRipple from '/@/directives/ripple';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useChartConfigContext, useQuotaListContext, useSelectedQuotaListContext } from './hooks';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  import Icon from '/@/components/Icon';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const emit = defineEmits<{
    (event: 'paint'): void;
  }>();
  const { createMessage } = useMessage();
  const chartConfig = useChartConfigContext();
  const quotaList = useQuotaListContext();
  const selectedQuotaList = useSelectedQuotaListContext();

  async function paint() {
    if (quotaList.value.length === 0) {
      createMessage.warn(t('quotaView.toolbar.noQuotaListTip'));
      return;
    }
    // 季节性的公历和农历均只适用一个指标，使其他指标置灰
    if ([chartTypeEnum.seasonal, chartTypeEnum.seasonalLunar].includes(chartConfig.type)) {
      const list = selectedQuotaList.value;
      // 是否找到用户已选中的第一个指标，将用户选中的第一个指标作为绘图指标
      let findSelected = false;
      for (let index = 0; index < list.length; index++) {
        const quota = list[index];
        if (findSelected) {
          quota.selected = false;
        } else if (quota.selected) {
          findSelected = true;
        }
      }
    }
    await nextTick();
    // 拿到Title
    if (chartConfig.title === '') {
      chartConfig.title = quotaList.value[0].name;
    }
    chartConfig.quotaList = cloneDeep(quotaList.value);
    emit('paint');
  }
</script>

<style lang="less" scoped></style>
