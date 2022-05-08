<template>
  <div
    class="flex flex-grow p-4 overflow-hidden bg-white shadow-md shadow-primary-50 relative min-w-fit"
  >
    <div class="relative flex-grow">
      <ToolBar @paint="paint" />
      <DoubleSideChart
        class="absolute top-10 left-0 right-0 bottom-0"
        :config="config"
        @update-config="updateConfig"
        @paint-success="paintSuccess"
      />
    </div>
    <Advance />
  </div>
</template>
<script lang="ts" setup>
  import ToolBar from './ToolBar.vue';
  import Advance from './Advance.vue';
  import { DoubleSideChart } from '/@/components/Chart';
  import { echartMitter, useChartConfigContext } from './hooks';
  import { reactive } from 'vue';
  import type { chartConfigType } from '/#/chart';
  import { cloneDeep, mergeWith } from 'lodash-es';
  import { EChartsCoreOption } from 'echarts/core';
  import { mergeAndRemove } from '/@/utils/helper/commonHelper';

  const chartConfig = useChartConfigContext();
  const config = reactive({}) as chartConfigType;
  function paint() {
    // mergeWith(config, cloneDeep(chartConfig), (target, src) => {
    //   if (target instanceof Array) {
    //     return reactive(src);
    //   }
    // });
    mergeAndRemove(config, chartConfig);
  }
  function updateConfig(cfg: chartConfigType) {
    mergeWith(chartConfig, cloneDeep(cfg), (target, src) => {
      if (target instanceof Array) {
        return reactive(src);
      }
    });
    paint();
  }
  // 绘图完成
  function paintSuccess(options: EChartsCoreOption) {
    echartMitter.emit('echartOptions', options);
  }
</script>

<style lang="less" scoped>
  .fullscreen {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @white;
    z-index: 9999;

    .chart-view {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  .box {
    transition: width 0.3s ease;
  }

  .chart-view,
  .table-view {
    position: absolute;
    backface-visibility: hidden;
    transition: all 1s;

    &.front {
      transform: rotateY(0);
    }

    &.back {
      transform: rotateY(180deg);
    }
  }
</style>
