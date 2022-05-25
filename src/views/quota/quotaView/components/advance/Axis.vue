<template>
  <div class="pl-8" v-if="showSettingFilter('yAxisEdit')">
    <div class="flex items-center gap-2">
      <YAxisEdit :chart-config="chartConfig" :idx="null" @update="updateConfig">
        <Button size="small">
          <template #icon>
            <Icon icon="ant-design:plus-outlined" />
          </template>
          <span>{{ t('quotaView.advance.axisSetting.yAxis.createY') }}</span>
        </Button>
      </YAxisEdit>
      <BasicHelp :text="t('quotaView.advance.axisSetting.yAxis.tip2')" />
    </div>
    <div class="yAxisList">
      <Tag
        v-for="yAxis in yAxisIndexList"
        :key="yAxis.label"
        :closable="yAxis.closable"
        @close="delYAxis(yAxis.value)"
      >
        {{ yAxis.label }}
      </Tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Tag, Button } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  import { BasicHelp } from '/@/components/Basic';
  import YAxisEdit from '/@/components/Chart/src/YAxisEditor.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useChartConfigContext, useYAxisEdit, useSettingFilter } from '../hooks';

  const { t } = useI18n();
  const chartConfig = useChartConfigContext();
  const showSettingFilter = useSettingFilter(chartConfig);
  function updateConfig(config) {
    Object.assign(chartConfig, config);
  }
  // Y轴编辑
  const [yAxisIndexList, { delYAxis }] = useYAxisEdit(chartConfig);
</script>

<style lang="less" scoped>
  .yAxisList {
    margin-top: 0.5rem;
    margin-bottom: -0.5rem;

    ::v-deep(.ant-tag) {
      margin-bottom: 0.5rem;
    }
  }
</style>
