<template>
  <div class="bg-white shadow-md flex-grow p-4 overflow-hidden rounded-md flex">
    <div class="w-3/5 relative top-0 bottom-0 left-0 right-0">
      <ToolBar @paint="paint" class="" />
      <div class="absolute top-12 bottom-0 left-0 right-2">
        <BasicChart :config="config" @update-config="updateConfig" />
      </div>
    </div>
    <Advance class="w-2/5" />
  </div>
</template>
<script lang="ts" setup>
  import ToolBar from './ToolBar.vue';
  import Advance from './Advance.vue';
  import { BasicChart } from '/@/components/Chart';
  import { useChartConfigContext } from './hooks';
  import { reactive } from 'vue';
  import type { chartConfigType } from '/#/chart';
  import { cloneDeep } from 'lodash-es';

  const chartConfig = useChartConfigContext();
  const config = reactive({}) as chartConfigType;
  function paint() {
    Object.assign(config, cloneDeep(chartConfig));
  }
  function updateConfig(config) {
    Object.assign(chartConfig, cloneDeep(config));
  }
</script>

<style lang="less" scoped>
  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: all 0.8s ease;
    opacity: 1;
  }

  .component-fade-enter-from,
  .component-fade-leave-to {
    transform: scale(0.5);
    opacity: 0;
  }
</style>
