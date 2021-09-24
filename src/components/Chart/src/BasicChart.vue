<template>
  <div class="h-full overflow-hidden">
    <div ref="chartElRef" class="w-full h-full"></div>
  </div>
</template>

<script lang="ts" setup>
  import { h, onBeforeUnmount, onDeactivated, ref, render, toRefs, unref, watch } from 'vue';
  import type { Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  import { useSeasonalChart, useNormalChart } from '../tranfer';
  import { chartConfigType } from '/#/chart';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useDebounceFn, useResizeObserver } from '@vueuse/core';
  import { Popover, Input } from 'ant-design-vue';

  const props = defineProps<{
    chartConfig: chartConfigType;
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
  let title = ref(chartConfig.value.title);
  onMountedOrActivated(() => {
    const instance = getInstance();
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
    instance?.on('dblclick', (e) => {
      if (e.componentType === 'title') {
        const { clientX, clientY } = e.event?.event as MouseEvent;
        const dom = document.createElement('span');
        Object.assign(dom.style, {
          position: 'fixed',
          top: `${clientY}px`,
          left: `${clientX}px`,
        });
        document.body.appendChild(dom);

        function input() {
          return h(Input, {
            value: title.value,
            onChange: function (e) {
              title = e.target.value;
            },
          });
        }
        const pop = h(Popover, {
          content: input(),
          defaultVisible: true,
          trigger: 'click',
          onVisibleChange: (visible: boolean) => {
            if (!visible) {
              chartConfig.value.title = title.value;
              dom.remove();
            }
          },
        });
        render(pop, dom);
      }
    });
  });
</script>

<style lang="less" scoped></style>
