<template>
  <div class="h-full overflow-hidden">
    <div ref="chartElRef" class="w-full h-full"></div>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onDeactivated, ref, toRefs, unref, watch } from 'vue';
  import type { Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  import { useSeasonalChart, useNormalChart } from '../tranfer';
  import type { chartConfigType, normalChartConfigType } from '/#/chart';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useDebounceFn, useResizeObserver } from '@vueuse/core';
  import { useChartTitlePopover, useYAxisIndexEdit } from '../helper';
  import { cloneDeep } from 'lodash';

  const props = defineProps<{
    chartConfig: chartConfigType;
  }>();
  const emit = defineEmits<{
    (event: 'updateConfig', chartConfig: chartConfigType): void;
  }>();

  const { chartConfig } = toRefs(props);
  const chartElRef = ref<HTMLDivElement>();
  const { setOptions, resize, getInstance } = useECharts(chartElRef as Ref<HTMLDivElement>);

  const chartTypeHooks = {
    [chartTypeEnum.seasonal]: useSeasonalChart,
    [chartTypeEnum.normal]: useNormalChart,
  };
  watch(
    chartConfig,
    async (v) => {
      const options = await chartTypeHooks[v.type](v);
      console.log(options);

      setOptions(options);
    },
    { deep: true }
  );

  function update() {
    emit('updateConfig', cloneDeep(unref(chartConfig)));
  }
  interface eventBusType {
    event: any;
    target: 'title';
    eventType: 'dblclick' | 'contextmenu';
  }
  // 监听事件的列表
  const eventBus: eventBusType[] = [];
  onMountedOrActivated(() => {
    const instance = getInstance()!;
    // 自适应大小
    const handler = useDebounceFn(resize, 200);
    const { stop } = useResizeObserver(unref(chartElRef), () => {
      handler();
    });
    onBeforeUnmount(() => {
      stop();
    });
    onDeactivated(() => {
      stop();
    });
    // 编辑标题
    const titleClickEvent = useChartTitlePopover({
      chartConfig,
      onOk: (title) => {
        chartConfig.value.title = title;
        update();
      },
    });
    eventBus.push({
      event: titleClickEvent,
      eventType: 'dblclick',
      target: 'title',
    });
    // 编辑Y轴
    const yAxisClickEvent = useYAxisIndexEdit({
      chartConfig: chartConfig as Ref<normalChartConfigType>,
      onOk: (yAxisOption, idx) => {
        (chartConfig.value as normalChartConfigType).yAxis[idx] = yAxisOption;
        update();
      },
    });
    eventBus.push({
      event: yAxisClickEvent,
      eventType: 'dblclick',
      target: 'title',
    });
    instance.on('dblclick', (e) => {
      console.log(e);
      // 激活双击监听的所有事件
      eventBus
        .filter((event) => event.eventType === 'dblclick')
        .forEach((event) => {
          event.event(e);
        });
    });
  });
</script>

<style lang="less" scoped></style>
