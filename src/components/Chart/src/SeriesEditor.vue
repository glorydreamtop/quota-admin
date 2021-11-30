<template>
  <Popover v-bind="$attrs" trigger="click" v-model:visible="visible" destroyTooltipOnHide>
    <template #content>
      <div
        class="
          flex flex-col
          gap-1
          children:whitespace-nowrap children:flex children:items-center
          w-40
        "
      >
        <span class="text-primary">{{ info.name }}</span>
        <span>
          <span class="w-4em text-justify mr-2">{{ t('quotaView.seriesEdit.seriesType') }}</span>
          <Select
            class="!w-6em"
            size="small"
            v-model:value="info.seriesType"
            :options="compOptions.seriesTypeList"
          />
        </span>
        <span v-if="info.lineType !== undefined">
          <span class="w-4em text-justify mr-2">{{ t('quotaView.seriesEdit.lineType') }}</span>
          <Select
            class="!w-6em"
            size="small"
            v-model:value="info.lineType"
            :options="compOptions.lineTypeList"
          />
        </span>
        <span v-if="info.size !== undefined">
          <span class="w-4em text-justify mr-2">{{ t('quotaView.seriesEdit.lineWidth') }}</span>
          <Input class="!w-3em !text-center" size="small" v-model:value="info.size" />
        </span>
        <span v-if="info.shadow !== undefined">
          <span class="w-4em text-justify mr-2">{{ t('quotaView.seriesEdit.lineShadow') }}</span>
          <Switch size="small" v-model:checked="info.shadow" />
        </span>
        <span v-if="info.yAxisIndex !== undefined">
          <span class="w-4em text-justify mr-2">{{ t('quotaView.seriesEdit.yAxisIndex') }}</span>
          <Input class="!w-3em !text-center" size="small" v-model:value="info.yAxisIndex" />
        </span>
        <span v-if="info.xAxisIndex !== undefined">
          <span class="w-4em text-justify mr-2">{{ t('quotaView.seriesEdit.xAxisIndex') }}</span>
          <Input class="!w-3em !text-center" size="small" v-model:value="info.xAxisIndex" />
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
  import { reactive, ref, watch, toRaw } from 'vue';
  import { Popover, Button, Switch, Radio, Select, Input } from 'ant-design-vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { normalChartConfigType, seriesSettingType } from '/#/chart';
  import {
    chartTypeEnum,
    echartLineTypeEnum,
    echartSeriesTypeEnum,
    echartSeriesTypeNameEnum,
  } from '/@/enums/chartEnum';
  import { EChartsOption } from 'echarts';
  import { setSeriesInfo } from '../helper';

  const { t } = useI18n();
  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const props = defineProps<{
    chartConfig: normalChartConfigType;
    seriesInfo: any;
    options: EChartsOption;
  }>();
  const info: seriesSettingType = reactive({
    name: '',
    size: undefined,
    seriesType: echartSeriesTypeEnum.line,
    lineType: undefined,
    shadow: undefined,
    yAxisIndex: undefined,
    xAxisIndex: undefined,
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
    ].map((name) => {
      return {
        label: t(`quotaView.seriesEdit.seriesTypeList.${name}`),
        value: name,
      };
    }),
    lineTypeList: [
      echartLineTypeEnum.solid,
      echartLineTypeEnum.dashed,
      echartLineTypeEnum.dotted,
    ].map((name) => {
      return {
        label: t(`quotaView.seriesEdit.lineTypeList.${name}`),
        value: name,
      };
    }),
  });
  // function getWhiteList(type:string){
  //   let whiteList = [];
  //   switch (info.seriesType) {
  //     case echartSeriesTypeEnum.line:
  //       whiteList = ['seriesType','lineType','lineShadow']
  //       break;

  //     default:
  //       break;
  //   }
  // }
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
      setSeriesInfo(info, props.chartConfig.type, props.seriesInfo, props.options);
    }
    emit('visibleChange', v);
  });
  function confirm() {
    const config = cloneDeep(props.chartConfig);
    const series = config.seriesSetting.find((ser) => ser.name === info.name);
    if (series) {
      merge(series, toRaw(info));
    } else {
      config.seriesSetting.push(cloneDeep(toRaw(info)));
    }
    emit('update', config);
    setVisible(false);
  }
</script>

<style lang="less" scoped></style>
