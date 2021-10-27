<template>
  <div class="flex items-center gap-4 p-2">
    <div class="flex items-center gap-1">
      <span>{{ t('templateView.toolbar.sameTimeRange') }}</span>
      <Switch v-model:checked="pageConfig.sameTimeRange" />
      <RangePicker
        :disabled="!pageConfig.sameTimeRange"
        class="w-200px"
        value-format="YYYY-MM-DD"
        v-model:value="pageConfig.date"
      />
    </div>
    <div class="flex items-center gap-1">
      <span>{{ t('templateView.toolbar.showLastest') }}</span>
      <Switch v-model:checked="pageConfig.showLastest" />
    </div>
    <div class="flex items-center gap-1">
      <span>{{ t('templateView.toolbar.baseSize') }}</span>
      <Icon icon="ant-design:column-width-outlined" />
      <Input v-model:value="pageConfig.baseSize.width" class="!w-16 text-center" />
      <Icon icon="ant-design:column-height-outlined" />
      <Input v-model:value="pageConfig.baseSize.height" class="!w-16 text-center" />
      <Tooltip>
        <template #title>
          {{ t('templateView.toolbar.baseSizeTip') }}
        </template>
        <Icon icon="ant-design:question-circle-outlined" />
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { DatePicker, Switch, Input, Tooltip } from 'ant-design-vue';
  import { usePageConfigContext } from '../hooks';
  import { useI18n } from '/@/hooks/web/useI18n';

  const RangePicker = DatePicker.RangePicker;
  const { t } = useI18n();
  const pageConfig = usePageConfigContext();
  console.log(pageConfig);
</script>

<style lang="less" scoped></style>
