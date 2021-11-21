<template>
  <div class="bg-white shadow-md flex-grow p-4 overflow-hidden flex">
    <div class="w-2/3 relative top-0 bottom-0 left-0 right-0">
      <ToolBar @paint="paint" @event="handleEvent" />
      <div class="absolute top-12 bottom-0 left-0 right-2 preserve-3d box">
        <BasicChart
          :class="['chart-view w-full', showTable ? 'back' : 'front']"
          :config="config"
          @update-config="updateConfig"
          ref="chartRef"
        />
        <QuotaDataTable
          :class="['table-view', showTable ? 'front' : 'back']"
          :config="config"
          ref="tableRef"
        />
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
  import { QuotaDataTable } from '/@/components/QuotaTable';

  const chartConfig = useChartConfigContext();
  const showTable = ref(false);
  const config = reactive({}) as chartConfigType;
  function paint() {
    Object.assign(config, cloneDeep(chartConfig));
  }
  function updateConfig(config) {
    Object.assign(chartConfig, cloneDeep(config));
  }
  const chartRef = ref<
    {
      getInstance: () => EChartsType;
    } & ComponentRef
  >();
  const tableRef = ref<
    {
      download: () => void;
    } & ComponentRef
  >();
  async function handleEvent(type: string) {
    switch (type) {
      case 'screenshot':
        const url = (chartRef.value!.getInstance() as EChartsType).getDataURL({
          type: 'png',
          pixelRatio: 1,
          backgroundColor: '#FFF',
        });
        await downloadByBase64(url, `${chartConfig.title}.png`);
        break;

      case 'xlsx':
        tableRef.value!.download();
        break;
      case 'showTable':
        showTable.value = true;
        break;
      case 'showChart':
        showTable.value = false;
        break;
      default:
        break;
    }
  }
</script>

<style lang="less" scoped>
  .box {
    perspective: 1000;
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
