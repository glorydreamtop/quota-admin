<template>
  <div class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden">
    <div class="h-full w-75 relative border resize-x overflow-hidden">
      <QuotaTree :show-search="true" class="h-full w-full enter-y" @selectNode="selectNode" />
      <!-- <TemplateTree :show-search="true" class="h-full w-full enter-y" @selectNode="selectTemplateNode" /> -->
    </div>
    <div class="flex flex-col h-full flex-grow w-0 gap-4">
      <QuotaList class="border enter-y overflow-hidden resize-y" />
      <ChartGenerator class="enter-y" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { QuotaTree } from '/@/components/QuotaTree';
  // import { TemplateTree } from '/@/components/TemplateTree';
  import QuotaList from './components/QuotaList.vue';
  import ChartGenerator from './components/ChartGenerator.vue';
  import { reactive, ref } from 'vue';
  // import { useRoute } from 'vue-router';
  import {
    createChartConfigContext,
    createQuotaListContext,
    createSelectedQuotaListContext,
  } from './components/hooks';
  import type { QuotaItem } from '/#/quota';
  import type { SelectedQuotaItem } from './components/hooks';
  import { getChartDefaultConfig } from './helper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  // import { TemplateItem } from '/#/template';

  const { createMessage } = useMessage();
  const { t } = useI18n();

  // 交付给绘图的指标列表
  const quotaList = ref<QuotaItem[]>([]);
  createQuotaListContext(quotaList);
  // 所有从树中选中的指标
  const selectedQuotaList = ref<SelectedQuotaItem[]>([]);
  createSelectedQuotaListContext(selectedQuotaList);
  // 一份图表的配置信息
  const def = cloneDeep(getChartDefaultConfig(chartTypeEnum.normal));
  const chartConfig = reactive(def);
  createChartConfigContext(chartConfig);
  function selectNode(q: QuotaItem) {
    const sq = cloneDeep(q) as SelectedQuotaItem;
    if (selectedQuotaList.value.find((q) => q.id === sq.id)) {
      createMessage.warn((q.shortName || q.name) + t('page.quotaView.uniqSelectedQuotaMessage'));
      return;
    }
    sq.selected = true;
    selectedQuotaList.value.push(sq);
  }
  // function selectTemplateNode(template:TemplateItem){

  // }
</script>

<style lang="less" scoped></style>
