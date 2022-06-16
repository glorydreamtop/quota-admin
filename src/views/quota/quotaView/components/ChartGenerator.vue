<template>
  <div class="flex flex-grow p-4 bg-white shadow-md shadow-primary-50 relative min-w-fit">
    <div class="relative flex-grow">
      <ToolBar @paint="paint" />
      <DoubleSideChart
        class="w-full h-full"
        :config="config"
        @update-config="updateConfig"
        @render-success="renderSuccess"
      />
    </div>
    <div id="chart-paint-mode-mask" class="hidden"></div>
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
  function renderSuccess(options: EChartsCoreOption) {
    echartMitter.emit('echartOptions', options);
  }
</script>

<style lang="less" scoped>
  #chart-paint-mode-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(63, 63, 63, 0.3);
    transition: all 0.3s;
    z-index: 99;
    // display: none;
  }
</style>
