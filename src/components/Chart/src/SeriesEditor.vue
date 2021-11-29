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
        <div>
          <span>{{ info.name }}</span>
        </div>
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
  import { Input, Switch, Radio, Popover, Button, Tooltip } from 'ant-design-vue';
  import { cloneDeep, last, partition, merge } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { normalChartConfigType, seriesSettingType } from '/#/chart';
  import type { YAXisComponentOption } from 'echarts';
  import Icon from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  const { t } = useI18n();

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const { createMessage } = useMessage();
  const props = defineProps<{
    chartConfig: normalChartConfigType;
    seriesInfo: any;
  }>();
  const info: seriesSettingType = reactive({
    name: '',
    size: 2,
    type: '',
    shadow: false,
    yAxisIndex: 0,
    xAxisIndex: 0,
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
