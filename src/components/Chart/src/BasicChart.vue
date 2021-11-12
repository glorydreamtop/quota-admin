<template>
  <div class="h-full overflow-hidden pt-4 relative" v-loading="loading">
    <div ref="chartElRef" class="w-full h-full"></div>
    <div v-if="noChart" class="no-chart flex flex-col items-center">
      <img src="../../../assets/svg/no-chart.svg" />
      <span v-if="config.title" class="whitespace-nowrap mt-2 text-gray-400">{{
        config.title
      }}</span>
      <span v-else>{{}}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onDeactivated, ref, toRefs, unref, watch } from 'vue';
  import type { Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { useI18n } from '/@/hooks/web/useI18n';
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
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';

  const props = defineProps<{
    config: chartConfigType;
  }>();
  const emit = defineEmits<{
    (event: 'updateConfig', config: chartConfigType): void;
  }>();

  const { config } = toRefs(props);
  const chartElRef = ref<HTMLDivElement>();
  const { setOptions, resize, getInstance } = useECharts(chartElRef as Ref<HTMLDivElement>);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const noChart = ref(true);
  const chartTypeHooks = {
    [chartTypeEnum.seasonal]: useSeasonalChart,
    [chartTypeEnum.normal]: useNormalChart,
    [chartTypeEnum.bar]: useBarChart,
    [chartTypeEnum.normalRadar]: useRadarChart,
    [chartTypeEnum.structural]: useStructuralChart,
    [chartTypeEnum.pie]: usePieChart,
    [chartTypeEnum.quantileRadar]: useQuantileRadarChart,
  };
  const loading = ref(false);
  watch(
    config,
    async (v) => {
      if (!Reflect.has(v, 'quotaList') || v.quotaList?.length === 0) return;
      try {
        loading.value = true;
        const options = await chartTypeHooks[v.type](v);
        setOptions(options);
        noChart.value = false;
      } catch (error) {
        noChart.value = true;
        createMessage.warn(t('common.renderError'));
      } finally {
        loading.value = false;
      }
    },
    { deep: true, immediate: true },
  );

  function update() {
    emit('updateConfig', cloneDeep(unref(config)));
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
      chartConfig: config.value,
      onOk: (title) => {
        config.value.title = title;
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
      chartConfig: config.value as normalChartConfigType,
      onOk: (cfg) => {
        Object.assign(config.value, cfg);
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
      chartConfig: config.value as normalChartConfigType,
      onOk: (cfg) => {
        Object.assign(config.value, cfg);
        update();
      },
    });
    eventBus.push({
      event: lineContextMenuEvent,
      eventType: 'contextmenu',
      target: 'series',
    });
    instance.on('dblclick', (e) => {
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
      // 依次执行右键监听的所有事件
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

<style lang="less" scoped>
  .no-chart {
    position: absolute;
    width: 20%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
