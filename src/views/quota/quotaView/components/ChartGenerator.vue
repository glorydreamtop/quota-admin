<template>
  <div class="bg-white shadow-md flex-grow p-4 overflow-hidden flex">
    <div class="w-2/3 relative top-0 bottom-0 left-0 right-0">
      <ToolBar @paint="paint" @event="handleEvent" />
      <div class="absolute top-12 bottom-0 left-0 right-2" id="chart-canvas">
        <BasicChart :config="config" @update-config="updateConfig" ref="chartRef" />
      </div>
    </div>
    <Advance class="w-1/3" />
  </div>
</template>
<script lang="ts" setup>
  import ToolBar from './ToolBar.vue';
  import Advance from './Advance.vue';
  import { BasicChart } from '/@/components/Chart';
  import { useChartConfigContext } from './hooks';
  import { reactive, ref } from 'vue';
  import type { chartConfigType } from '/#/chart';
  import { cloneDeep } from 'lodash-es';
  import { EChartsType } from 'echarts/core';
  import { downloadByBase64 } from '/@/utils/file/download';

  const chartConfig = useChartConfigContext();
  const config = reactive({}) as chartConfigType;
  function paint() {
    Object.assign(config, cloneDeep(chartConfig));
  }
  function updateConfig(config) {
    Object.assign(chartConfig, cloneDeep(config));
  }
  const chartRef = ref<ComponentRef>();
  async function handleEvent(type: string) {
    switch (type) {
      case 'screenshot':
        const url = (chartRef.value.getInstance() as EChartsType).getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#FFF',
        });
        await downloadByBase64(url, `${chartConfig.title}.png`);
        break;

      default:
        break;
    }
  }
</script>

<style lang="less" scoped>
  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: all 0.8s ease;
    opacity: 100%;
  }

  .component-fade-enter-from,
  .component-fade-leave-to {
    transform: scale(0.5);
    opacity: 0%;
  }
</style>
