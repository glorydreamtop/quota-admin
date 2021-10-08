<template>
  <div
    class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden"
    ref="containerRef1"
  >
    <div class="h-full w-75 relative scaleable1 border">
      <QuotaTree :show-search="true" class="h-full w-full enter-y" @selectNode="selectNode" />
      <ArrowsAltOutlined
        class="absolute scale z-9 cursor-w-resize"
        :rotate="45"
        :style="{ fontSize: '18px' }"
      />
    </div>
    <div class="flex flex-col h-full flex-grow w-0 gap-4" ref="containerRef2">
      <QuotaList class="scaleable2 border enter-y" />
      <ChartGenerator class="enter-y" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { QuotaTree } from '/@/components/QuotaTree';
  import { ArrowsAltOutlined } from '@ant-design/icons-vue';
  import QuotaList from './components/QuotaList.vue';
  import ChartGenerator from './components/ChartGenerator.vue';
  import { reactive, ref, unref } from 'vue';
  import { useScaleable } from '/@/utils/helper/commonHelper';
  // import { useRoute } from 'vue-router';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import {
    createChartConfigContext,
    createQuotaListContext,
    createSelectedQuotaListContext,
  } from './components/hooks';
  import type { QuotaItem } from '/#/quota';
  import type { SelectedQuotaItem } from './components/hooks';
  import type { normalChartConfigType } from '/#/chart';
  import { getNormalChartDefaultConfig } from './helper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';

  const { createMessage } = useMessage();
  const { t } = useI18n();

  // 交付给绘图的指标列表
  const quotaList = ref<QuotaItem[]>([]);
  createQuotaListContext(quotaList);
  // 所有从树中选中的指标
  const selectedQuotaList = ref<SelectedQuotaItem[]>([]);
  createSelectedQuotaListContext(selectedQuotaList);
  // 一份图表的配置信息
  const def = cloneDeep(getNormalChartDefaultConfig());
  const chartConfig: normalChartConfigType = reactive(def);
  createChartConfigContext(chartConfig);

  const containerRef1 = ref<HTMLDivElement>();
  const containerRef2 = ref<HTMLDivElement>();
  onMountedOrActivated(() => {
    const container1 = unref(containerRef1)!;
    useScaleable(
      { container: container1, boxName: '.scaleable1', scaleName: '.scale' },
      { x: true, y: false, staticMode: true }
    );
    const container2 = unref(containerRef2)!;
    useScaleable(
      { container: container2, boxName: '.scaleable2', scaleName: '.scale' },
      { x: false, y: true, staticMode: true }
    );
  });
  function selectNode(q: QuotaItem) {
    const sq = q as SelectedQuotaItem;
    if (selectedQuotaList.value.find((q) => q.id === sq.id)) {
      createMessage.warn((q.shortName || q.name) + t('page.quotaView.uniqSelectedQuotaMessage'));
      return;
    }
    sq.selected = true;
    selectedQuotaList.value.push(sq);
  }
</script>

<style lang="less" scoped>
  .scale {
    right: -8px;
    bottom: 50%;
  }
</style>
