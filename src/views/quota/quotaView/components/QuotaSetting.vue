<template>
  <BasicModal @register="register" @ok="ok">
    <div class="w-full flex flex-col gap-4 children:flex children:gap-2 children:items-center">
      <div class="">
        <span class="min-w-4em">{{ t('page.quotaView.quotaSetting.name') }}</span>
        <Input class="!w-80" v-model:value="quotaSetting.name" />
      </div>
      <div class="flex">
        <span class="min-w-4em">{{ t('page.quotaView.quotaSetting.sourceCode') }}</span>
        <Input class="!w-80" v-model:value="quotaSetting.sourceCode">
          <template #suffix>
            <span class="text-primary">{{
              t(`quota.sourceType.${quotaSetting['sourceType']}`)
            }}</span>
          </template>
        </Input>
      </div>
      <div class="flex">
        <span class="min-w-4em">{{ t('page.quotaView.quotaSetting.setting.yAxisIndex') }}</span>
        <Select
          class="w-80"
          v-model:value="quotaSetting.setting.yAxisIndex"
          :options="yAxisIndexList"
        />
      </div>
      <div class="flex">
        <span class="min-w-4em">{{ t('page.quotaView.quotaSetting.setting.type') }}</span>
        <Select class="w-80" v-model:value="quotaSetting.setting.type">
          <SelectOption v-for="type in seriesTypeList" :key="type.value">
            <div>
              <Icon :color="getThemeColor" :icon="type.icon" />
              <span class="ml-2">{{ type.label }}</span>
            </div>
          </SelectOption>
        </Select>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { SelectedQuotaItem, useChartConfigContext } from './hooks';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Input, Select } from 'ant-design-vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { computed, reactive, ref } from 'vue';
  import Icon from '/@/components/Icon';
  import { echartSeriesTypeEnum } from '/@/enums/chartEnum';

  const SelectOption = Select.Option;
  const { t } = useI18n();
  const { getThemeColor } = useRootSetting();
  const chartConfig = useChartConfigContext();
  const quotaIndex = ref(0);
  const quotaSetting: Partial<SelectedQuotaItem> = reactive({
    name: '',
    sourceCode: '',
    sourceType: '',
    setting: {
      yAxisIndex: 0,
      type: 'line',
    },
  });
  // Y轴选择器
  const yAxisIndexList = computed(() => {
    return chartConfig.yAxis.map((item, index) => {
      return {
        label: `${index + 1}/${t('page.quotaView.advance.axisSetting.yAxis.min')}[${
          item.min || t('common.auto')
        }]-${t('page.quotaView.advance.axisSetting.yAxis.max')}[${
          item.max || t('common.auto')
        }]/${t('page.quotaView.advance.axisSetting.yAxis.' + item.position)}`,
        value: index,
      };
    });
  });
  const seriesTypeList = ref([
    {
      label: t('page.quotaView.seriesType.line'),
      value: echartSeriesTypeEnum.line,
      icon: 'carbon:chart-line',
    },
    {
      label: t('page.quotaView.seriesType.bar'),
      value: echartSeriesTypeEnum.bar,
      icon: 'carbon:chart-column',
    },
    {
      label: t('page.quotaView.seriesType.smoothLine'),
      value: echartSeriesTypeEnum.smoothLine,
      icon: 'carbon:chart-line-smooth',
    },
    {
      label: t('page.quotaView.seriesType.scatter'),
      value: echartSeriesTypeEnum.scatter,
      icon: 'carbon:chart-scatter',
    },
    {
      label: t('page.quotaView.seriesType.area'),
      value: echartSeriesTypeEnum.area,
      icon: 'mdi:chart-areaspline-variant',
    },
  ]);
  const [register, { closeModal }] = useModalInner(
    ({ record, index }: { record: SelectedQuotaItem; index?: number }) => {
      quotaIndex.value = index ?? chartConfig.quotaList!.length;
      Object.assign(quotaSetting, record);
    }
  );

  function ok() {
    Object.assign(chartConfig.quotaList![quotaIndex.value], quotaSetting);
    closeModal();
  }
</script>

<style lang="less" scoped></style>
