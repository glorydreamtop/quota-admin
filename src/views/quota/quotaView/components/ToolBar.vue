<template>
  <div>
    <Space align="center">
      <Select
        class="w-30"
        size="small"
        v-model:value="chartConfig.type"
        :placeholder="t('page.quotaView.toolbar.chartTypeSelectPlaceholer')"
        :options="chartTypeList"
      />
      <Color />
      <DatePicker
        size="small"
        :placeholer="t('page.quotaView.toolbar.startDatePicker')"
        class="w-30"
      />
      <DatePicker
        size="small"
        :placeholer="t('page.quotaView.toolbar.endDatePicker')"
        class="w-30"
      />
      <Icon
        class="setting-icon rotate-icon"
        size="24"
        @click="openAdvanceModal"
        icon="ant-design:setting-outlined"
      />
      <Icon class="save-icon" size="24" icon="ant-design:save-outlined" />
    </Space>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Space, DatePicker, Select } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useChartConfigContext } from './hooks';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  import Color from './Color.vue';
  import Icon from '/@/components/Icon';

  const { t } = useI18n();
  const chartConfig = useChartConfigContext();
  // 图表类型下拉选择
  const chartTypeList: LabelValueOptions = reactive([]);
  for (let v in chartTypeEnum) {
    chartTypeList.push({
      label: t(`page.quotaView.toolbar.chartTypeList.${v}`),
      value: v,
    });
  }
  function openAdvanceModal() {}
</script>

<style lang="less" scoped>
  .setting-icon,
  .save-icon {
    transition: 0.3s ease-in-out;
    transition-property: transform color;

    &.rotate-icon {
      &:hover {
        transform: rotate(120deg);
      }
    }

    &:hover {
      color: @primary-6;
    }
  }
</style>
