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
  import {
    useSeasonalChart,
    useNormalChart,
    useBarChart,
    useRadarChart,
    useStructuralChart,
    usePieChart,
    useQuantileRadarChart,
  } from '../tranfer';
  import type { chartConfigType, normalChartConfigType } from '/#/chart';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useDebounceFn, useResizeObserver } from '@vueuse/core';
  import {
    createMountNode,
    useChartTitlePopover,
    useLineChartContextMenu,
    useYAxisIndexEdit,
  } from '../helper';
  import { cloneDeep } from 'lodash';

  const props = defineProps<{
    config: chartConfigType;
  }>();
  const emit = defineEmits<{
    (event: 'updateConfig', chartConfig: chartConfigType): void;
  }>();

  const { config: chartConfig } = toRefs(props);
  const chartElRef = ref<HTMLDivElement>();
  const { setOptions, resize, getInstance } = useECharts(chartElRef as Ref<HTMLDivElement>);

  const chartTypeHooks = {
    [chartTypeEnum.seasonal]: useSeasonalChart,
    [chartTypeEnum.normal]: useNormalChart,
    [chartTypeEnum.bar]: useBarChart,
    [chartTypeEnum.normalRadar]: useRadarChart,
    [chartTypeEnum.structural]: useStructuralChart,
    [chartTypeEnum.pie]: usePieChart,
    [chartTypeEnum.quantileRadar]: useQuantileRadarChart,
  };
  watch(
    chartConfig,
    async (v) => {
      const options = await chartTypeHooks[v.type](v);
      setOptions(options);
    },
    { deep: true }
  );

  function update() {
    emit('updateConfig', cloneDeep(unref(chartConfig)));
  }
  interface eventBusType {
    event: any;
    target: 'title' | 'yAxis' | 'series';
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
      chartConfig: chartConfig.value,
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
      chartConfig: chartConfig.value as normalChartConfigType,
      onOk: (config) => {
        Object.assign(chartConfig.value, config);
        update();
      },
    });
    eventBus.push({
      event: yAxisClickEvent,
      eventType: 'dblclick',
      target: 'yAxis',
    });
    // 支持折线图series右键菜单
    const lineContextMenuEvent = useLineChartContextMenu({
      chartConfig: chartConfig.value as normalChartConfigType,
      onOk: (config) => {
        Object.assign(chartConfig.value, config);
        update();
      },
    });
    eventBus.push({
      event: lineContextMenuEvent,
      eventType: 'contextmenu',
      target: 'series',
    });
    instance.on('dblclick', (e) => {
      console.log(e);
      // 依次执行双击监听的所有事件
      eventBus
        .filter((event) => event.eventType === 'dblclick')
        .forEach((event) => {
          // 匹配对应类型的事件
          if (e.componentType === event.target) {
            const dom = createMountNode(e);
            event.event(dom, e);
          }
        });
    });
    instance.on('contextmenu', (e) => {
      console.log(e);
      // 依次执行双击监听的所有事件
      eventBus
        .filter((event) => event.eventType === 'contextmenu')
        .forEach((event) => {
          // 匹配对应类型的事件
          if (e.componentType === event.target) {
            const dom = createMountNode(e);
            event.event(dom, e);
          }
        });
    });
  });
</script>

<style lang="less" scoped></style>
