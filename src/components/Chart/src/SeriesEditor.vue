<template>
  <Popover v-bind="$attrs" trigger="click" v-model:visible="visible" destroyTooltipOnHide>
    <template #content>
      <div
        class="
          flex flex-col
          gap-1
          children:whitespace-nowrap children:flex children:items-center
          w-30
        "
      >
        <span class="text-primary">{{ info.name }}</span>
        <span>
          <span>{{ t('quotaView.seriesEdit.seriesType') }}</span>
          <Select v-model:value="info.seriesType" :option="compOptions.seriesTypeList" />
        </span>
        <span>
          <span>{{ t('quotaView.seriesEdit.lineType') }}：</span>
          <Select v-model:value="info.lineType" :option="compOptions.lineTypeList" />
        </span>
        <div class="mt-2 flex gap-1">
          <Button size="small" block type="primary" @click="confirm">{{
            t('common.okText')
          }}</Button>
        </div>
      </div>
    </template>
    <div>
      <slot></slot>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { Popover, Button, Radio, Select } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { normalChartConfigType, seriesSettingType } from '/#/chart';
  import {
    chartTypeEnum,
    echartLineTypeEnum,
    echartSeriesTypeEnum,
    echartSeriesTypeNameEnum,
  } from '/@/enums/chartEnum';

  const { t } = useI18n();
  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const props = defineProps<{
    chartConfig: normalChartConfigType;
    seriesInfo: any;
  }>();
  const info: seriesSettingType = reactive({
    name: '',
    size: 2,
    seriesType: echartSeriesTypeEnum.line,
    lineType: echartLineTypeEnum.solid,
    shadow: false,
    yAxisIndex: 0,
    xAxisIndex: 0,
  });
  const compOptions = reactive({
    seriesTypeList: [
      echartSeriesTypeEnum.line,
      echartSeriesTypeEnum.bar,
      echartSeriesTypeEnum.scatter,
      echartSeriesTypeEnum.smoothLine,
      echartSeriesTypeEnum.area,
      echartSeriesTypeEnum.radar,
      echartSeriesTypeEnum.pie,
    ],
    lineTypeList: [echartLineTypeEnum.solid, echartLineTypeEnum.ddashed, echartLineTypeEnum.dotted],
  });
  const emit = defineEmits<{
    (event: 'update', chartConfig: normalChartConfigType);
    (event: 'visibleChange', visible: boolean);
  }>();
  const visible = ref(false);
  function setVisible(v) {
    visible.value = v;
  }
  defineExpose({ setVisible });
  watch(visible, (v) => {
    if (v) {
      switch (props.chartConfig.type) {
        case chartTypeEnum.normal:
          info.name = props.seriesInfo.seriesName;
          info.seriesType = echartSeriesTypeEnum[props.seriesInfo.seriesType];
          break;

        default:
          break;
      }
    }
    emit('visibleChange', v);
  });
  function confirm() {
    const config = cloneDeep(props.chartConfig);
    emit('update', config);
    setVisible(false);
  }
</script>

<style lang="less" scoped></style>
