<template>
  <div class="relative">
    <Space align="center">
      <Select
        class="w-30"
        size="small"
        @select="selectType"
        v-model:value="chartConfig.type"
        :placeholder="t('page.quotaView.toolbar.chartTypeSelectPlaceholer')"
        :options="chartTypeList"
      />
      <Color />
      <div
        class="
          border border-gray-300
          w-50
          flex
          justify-center
          gap-2
          hover:border-primary
          date-picker
        "
      >
        <DatePicker
          size="small"
          v-model:value="chartConfig.timeConfig.startDate"
          value-format="YYYY-MM-DD"
          :placeholer="t('page.quotaView.toolbar.startDatePicker')"
          ><span class="cursor-pointer">{{ chartConfig.timeConfig.startDate }}</span></DatePicker
        >
        <span>~</span>
        <DatePicker
          size="small"
          v-model:value="chartConfig.timeConfig.endDate"
          value-format="YYYY-MM-DD"
          :placeholer="t('page.quotaView.toolbar.endDatePicker')"
          ><span class="cursor-pointer">{{ chartConfig.timeConfig.endDate }}</span></DatePicker
        >
      </div>

      <Icon title="暂不开放保存功能" class="save-icon" size="24" icon="ant-design:save-outlined" />
    </Space>
    <div class="absolute right-0 top-0 w-18 h-18 overflow-hidden" @click="paint">
      <div
        v-ripple
        class="w-36 h-36 !absolute -right-18 -top-18 bg-card-blue1 rounded-1 cursor-pointer"
      >
        <Icon class="absolute left-7 bottom-7" size="32" color="#fff" icon="ph:paint-brush-light" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, unref } from 'vue';
  import { Space, DatePicker, Select } from 'ant-design-vue';
  import vRipple from '/@/directives/ripple';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useChartConfigContext, useQuotaListContext, useSelectedQuotaListContext } from './hooks';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  import Color from './Color.vue';
  import Icon from '/@/components/Icon';
  import { cloneDeep } from 'lodash-es';
  import { getChartDefaultConfig } from '../helper';

  const { t } = useI18n();
  const emit = defineEmits<{
    (event: 'paint'): void;
  }>();
  const chartConfig = useChartConfigContext();

  const quotaList = useQuotaListContext();
  const selectedQuotaList = useSelectedQuotaListContext();
  // 图表类型下拉选择
  const chartTypeList: LabelValueOptions = reactive([]);
  for (let v in chartTypeEnum) {
    chartTypeList.push({
      label: t(`page.quotaView.toolbar.chartTypeList.${v}`),
      value: v,
      disabled: [chartTypeEnum.seasonalLunar, chartTypeEnum.fixedbase].includes(v as chartTypeEnum),
    });
  }
  function selectType(type: chartTypeEnum) {
    for (const key in chartConfig) {
      Reflect.deleteProperty(chartConfig, key);
    }
    Object.assign(chartConfig, getChartDefaultConfig(type));
  }
  async function paint() {
    // 季节性的公历和农历均只适用一个指标，使其他指标置灰
    if ([chartTypeEnum.seasonal, chartTypeEnum.seasonalLunar].includes(chartConfig.type)) {
      const list = selectedQuotaList.value;
      // 是否找到用户已选中的第一个指标，将用户选中的第一个指标作为绘图指标
      let findSelected = false;
      for (let index = 0; index < list.length; index++) {
        const quota = list[index];
        if (findSelected) {
          quota.selected = false;
        } else if (quota.selected) {
          findSelected = true;
        }
      }
    }
    await nextTick();
    // 拿到Title
    chartConfig.title = quotaList.value[0].name;
    chartConfig.quotaList = cloneDeep(unref(quotaList));
    emit('paint');
  }
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

  .date-picker {
    transition: border 300ms;
    border-radius: 2px;
  }
</style>
