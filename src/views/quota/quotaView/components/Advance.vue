<template>
  <div class="h-full border-l-gray-300 border-l p-2">
    <Divider orientation="left">{{ t('page.quotaView.advance.rectSetting.title') }}</Divider>
    <div class="grid grid-cols-2 pl-8">
      <span class="label">
        <Switch
          :checked-children="t('page.quotaView.advance.show')"
          :un-checked-children="t('page.quotaView.advance.hide')"
          v-model:checked="chartConfig.showLastest"
        />
        <span>{{ t('page.quotaView.advance.rectSetting.lastest') }}</span>
      </span>
      <span class="label">
        <Switch
          :checked-children="t('page.quotaView.advance.show')"
          :un-checked-children="t('page.quotaView.advance.hide')"
          v-model:checked="chartConfig.showHighest"
        />
        <span>{{ t('page.quotaView.advance.rectSetting.highest') }}</span>
      </span>
    </div>
    <Divider orientation="left">{{ t('page.quotaView.advance.valueFormatter.title') }}</Divider>
    <div class="grid grid-cols-2 pl-8">
      <span class="label">
        <InputNumber
          size="small"
          class="!w-12 min-w-12"
          :min="0"
          v-model:value="chartConfig.valueFormatter.afterDot"
        /><span>{{ t('page.quotaView.advance.valueFormatter.afterDot') }}</span>
      </span>
      <span class="label">
        <Switch
          v-model:checked="chartConfig.valueFormatter.scientificNotation"
          :checked-children="t('page.quotaView.advance.use')"
          :un-checked-children="t('page.quotaView.advance.stop')"
        /><span>{{ t('page.quotaView.advance.valueFormatter.scientificNotation') }}</span>
      </span>
    </div>
    <Divider orientation="left">{{ t('page.quotaView.advance.axisSetting.title') }}</Divider>
    <div class="pl-8">
      <Button size="small" @click="createYAxis">
        <template #icon>
          <Icon icon="ant-design:plus-outlined" />
        </template>
        <span>{{ t('page.quotaView.advance.axisSetting.yAxis.createY') }}</span>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // import { ref } from 'vue';
  import { Divider, Switch, InputNumber, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Icon from '/@/components/Icon';
  import { useChartConfigContext } from './hooks';
  import { useYAxisIndexEdit } from '/@/components/Chart/helper';
  import type { normalChartConfigType } from '/#/chart';

  const { t } = useI18n();
  const chartConfig = useChartConfigContext();

  function createYAxis(e) {
    const config = chartConfig as normalChartConfigType;
    config.yAxis.push({
      min: undefined,
      max: undefined,
      inverse: false,
      position: 'left',
      offset: 40,
    });
    const yAxisIndexEvent = useYAxisIndexEdit({
      chartConfig: config,
      onOk: () => {},
    });
    yAxisIndexEvent(e.target, { yAxisIndex: config.yAxis.length - 1 });
  }
</script>

<style lang="less" scoped>
  .label {
    @apply flex items-center;

    > span {
      @apply ml-2;
    }
  }
</style>
