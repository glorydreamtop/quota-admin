<template>
  <Button type="primary" class="!absolute right-4 top-0 z-19 w-36" @click="paint">
    {{ t('quotaView.doubleSideChart.paint') }}
  </Button>
</template>

<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useChartConfigContext, useQuotaListContext, useSelectedQuotaListContext } from './hooks';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Button } from 'ant-design-vue';

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
      createMessage.warn(t('quotaView.doubleSideChart.noQuotaListTip'));
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
