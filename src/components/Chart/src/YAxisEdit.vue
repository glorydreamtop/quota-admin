<template>
  <Popover
    trigger="click"
    :placement="placement"
    destroyTooltipOnHide
    defaultVisible
    @visibleChange="visibleChange"
  >
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
          <div class="w-3em text-justify mr-2">
            {{ t('page.quotaView.advance.axisSetting.yAxis.index') }}
          </div>
          <span>{{ idx + 1 }}</span>
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.min')
          }}</div>
          <Input
            size="small"
            class="!w-59px !min-w-59px"
            v-model:value="currentCfg.min"
            @input="(e) => onInputNumber(e, 'min')"
          />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.max')
          }}</div>
          <Input
            size="small"
            class="!w-59px !min-w-59px"
            v-model:value="currentCfg.max"
            @input="(e) => onInputNumber(e, 'max')"
          />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.position')
          }}</div>
          <RadioGroup size="small" v-model:value="currentCfg.position" button-style="solid">
            <RadioButton value="left">{{
              t('page.quotaView.advance.axisSetting.yAxis.left')
            }}</RadioButton>
            <RadioButton value="right">{{
              t('page.quotaView.advance.axisSetting.yAxis.right')
            }}</RadioButton>
          </RadioGroup>
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.inverse')
          }}</div>
          <Switch size="small" v-model:checked="currentCfg.inverse" />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.offset')
          }}</div>
          <Input
            size="small"
            v-model:value="currentCfg.offset"
            @input="(e) => onInputNumber(e, 'offset')"
          />
        </div>
      </div>
    </template>
    <slot></slot>
  </Popover>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Input, Switch, Radio, Popover } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { normalChartConfigType } from '/#/chart';
  const { t } = useI18n();

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const props = defineProps<{
    chartConfig: normalChartConfigType;
    idx: number;
  }>();
  const emit = defineEmits<{
    (event: 'update', chartConfig: normalChartConfigType);
  }>();

  const idx = ref(props.idx);
  const currentCfg = reactive(cloneDeep(props.chartConfig.yAxis[idx.value]));
  const placementMap = {
    left: 'right',
    right: 'left',
  };
  const placement = ref(placementMap[currentCfg.position!]);
  // 数字格式化
  function onInputNumber(e, type: 'min' | 'max' | 'offset') {
    if (e.target.value === '') {
      currentCfg[type] = undefined;
      return;
    }
    currentCfg[type] = parseFloat((e.target.value as string).replace(/[^\d|\.]/g, ''));
  }
  function visibleChange(v) {
    if (!v) {
      const config = props.chartConfig;
      config.yAxis[idx.value] = currentCfg;
      emit('update', config);
    }
  }
</script>

<style lang="less" scoped></style>
