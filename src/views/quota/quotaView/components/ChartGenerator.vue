<template>
  <div class="flex flex-grow p-4 bg-white border relative min-w-fit">
    <div class="relative flex-grow">
      <ToolBar @paint="paint" />
      <DoubleSideChart
        class="w-full h-full"
        :config="config"
        @update-config="updateConfig"
        @render-success="renderSuccess"
      />
    </div>
    <Advance ref="advance">
      <template #actions>
        <Button block @click="saveTemplate">
          <span>{{ t('quotaView.advance.saveBtn') }}</span>
        </Button>
      </template>
    </Advance>
  </div>
</template>
<script lang="ts" setup>
  import ToolBar from './ToolBar.vue';
  import Advance from './Advance.vue';
  import { DoubleSideChart } from '/@/components/Chart';
  import { echartMitter, useChartConfigContext } from './hooks';
  import { reactive, ref, toRaw } from 'vue';
  import { Button } from 'ant-design-vue';
  import type { chartConfigType } from '/#/chart';
  import { cloneDeep, mergeWith } from 'lodash-es';
  import { EChartsCoreOption } from 'echarts/core';
  import { mergeAndRemove } from '/@/utils/helper/commonHelper';
  import { updateTemplate } from '/@/api/template';
  import { useRoute } from 'vue-router';
  import { CategoryTreeType } from '/@/enums/quotaEnum';
  import { useI18n } from '/@/hooks/web/useI18n';

  const route = useRoute();
  const { t } = useI18n();
  const chartConfig = useChartConfigContext();
  const config = reactive({}) as chartConfigType;
  function paint() {
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
  function saveTemplate() {
    updateTemplate({
      id: parseInt(route.params.templateId as string) ?? undefined,
      template: JSON.stringify(toRaw(chartConfig)),
      type: CategoryTreeType.sysTemplate,
    });
  }
  // const advance = ref<HTMLElement>();
  // useDrawer(advance);
</script>

<style lang="less" scoped></style>
