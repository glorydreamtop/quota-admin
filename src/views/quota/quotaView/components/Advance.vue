<template>
  <div class="h-full border-l-gray-300 border-l p-2">
    <Divider orientation="left">{{ t('page.quotaView.advance.rectSetting.title') }}</Divider>
    <div class="grid grid-cols-2 pl-8">
      <span class="label">
        <Switch
          :checked-children="t('page.quotaView.advance.show')"
          :un-checked-children="t('page.quotaView.advance.hide')"
          v-model:checked="chartConfig.typeOptions.showLastest"
        />
        <span>{{ t('page.quotaView.advance.rectSetting.lastest') }}</span>
      </span>
      <span class="label">
        <Switch
          :checked-children="t('page.quotaView.advance.show')"
          :un-checked-children="t('page.quotaView.advance.hide')"
          v-model:checked="chartConfig.typeOptions.showHighest"
        />
        <span>{{ t('page.quotaView.advance.rectSetting.highest') }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // import { ref } from 'vue';
  import { Divider, Switch } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useChartConfigContext } from './hooks';

  const { t } = useI18n();
  const chartConfig = useChartConfigContext();
</script>

<style lang="less" scoped>
  .label {
    @apply flex items-center;

    > span {
      @apply ml-2;
    }
  }
</style>
