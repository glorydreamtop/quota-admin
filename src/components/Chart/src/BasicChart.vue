<template>
  <div>
    <div ref="chartElRef" class="w-full min-h-80"></div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { useChartConfigContext } from '/@/views/quota/quotaView/components/hooks';

  const chartElRef = ref<HTMLDivElement>();
  const { setOptions } = useECharts(chartElRef as Ref<HTMLDivElement>);
  console.log(setOptions);

  const chartConfig = useChartConfigContext();
  console.log(chartConfig);
</script>

<style lang="less" scoped></style>
