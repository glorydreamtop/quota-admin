<template>
  <div class="bg-white shadow-md flex-grow p-4 overflow-hidden flex">
    <div class="w-2/3 relative left-0 right-0">
      <ToolBar @paint="paint" @event="handleEvent" />
      <Teleport to="body" :disabled="!fullscreen">
        <div
          class="absolute top-12 bottom-0 left-0 right-2 preserve-3d box"
          :class="[fullscreen ? 'fullscreen' : '']"
          id="quota-view-chartbox"
        >
          <BasicChart
            :class="['chart-view w-full', showTable ? 'back' : 'front']"
            :config="config"
            @update-config="updateConfig"
            @paint-success="paintSuccess"
            ref="chartRef"
          />
          <QuotaDataTable
            :class="['table-view', showTable ? 'front' : 'back']"
            :config="config"
            ref="tableRef"
          />
          <div class="absolute top-2 right-2 flex gap-4">
            <Icon
              icon="ant-design:close-circle-filled"
              v-if="fullscreen"
              class="!text-gray-400 !text-3xl"
              @click="handleEvent('fullscreen')"
            />
          </div>
        </div>
      </Teleport>
    </div>
    <Advance class="w-1/3" />
  </div>
</template>
<script lang="ts" setup>
  import ToolBar from './ToolBar.vue';
  import Advance from './Advance.vue';
  import { BasicChart } from '/@/components/Chart';
  import { echartMitter, useChartConfigContext } from './hooks';
  import { reactive, ref, watchEffect } from 'vue';
  import type { chartConfigType } from '/#/chart';
  import { cloneDeep, merge } from 'lodash-es';
  import { EChartsType } from 'echarts/core';
  import { downloadByBase64 } from '/@/utils/file/download';
  import { QuotaDataTable } from '/@/components/QuotaTable';
  import { useMagicKeys } from '@vueuse/core';
  import { ECBasicOption } from 'echarts/types/dist/shared';

  const chartConfig = useChartConfigContext();
  const showTable = ref(false);
  const fullscreen = ref(false);
  const { Escape } = useMagicKeys();
  watchEffect(() => {
    // ESC键关闭全屏
    if (Escape.value) fullscreen.value = false;
  });
  const config = reactive({}) as chartConfigType;
  function paint() {
    merge(config, cloneDeep(chartConfig));
  }
  function updateConfig(cfg) {
    merge(chartConfig, cloneDeep(cfg));
    paint();
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
  // 响应工具栏事件
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
      case 'fullscreen':
        fullscreen.value = !fullscreen.value;
      default:
        break;
    }
  }
  // 绘图完成
  function paintSuccess(options: ECBasicOption) {
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
