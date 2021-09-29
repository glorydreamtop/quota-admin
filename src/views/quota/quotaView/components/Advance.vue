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
      <YAxisEdit :chart-config="chartConfig" :idx="0" @update="updateConfig">
        <Button size="small">
          <template #icon>
            <Icon icon="ant-design:plus-outlined" />
          </template>
          <span>{{ t('page.quotaView.advance.axisSetting.yAxis.createY') }}</span>
        </Button>
      </YAxisEdit>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Divider, Switch, InputNumber, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Icon from '/@/components/Icon';
  import { useChartConfigContext } from './hooks';
  import YAxisEdit from '/@/components/Chart/src/YAxisEdit.vue';

  const { t } = useI18n();
  const chartConfig = useChartConfigContext();
  function updateConfig(config) {
    Object.assign(chartConfig, config);
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
