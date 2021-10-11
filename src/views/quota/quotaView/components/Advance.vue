<template>
  <div class="h-full border-l-gray-300 border-l p-2 overflow-y-scroll">
    <Collapse v-model:activeKey="collapseKey" :bordered="false">
      <CollapsePanel key="rectSetting" :style="panelTitleStyle">
        <template #header>
          <Divider orientation="left">{{ t('page.quotaView.advance.rectSetting.title') }}</Divider>
        </template>
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
      </CollapsePanel>
      <CollapsePanel key="valueFormatter">
        <template #header>
          <Divider orientation="left">{{
            t('page.quotaView.advance.valueFormatter.title')
          }}</Divider>
        </template>
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
      </CollapsePanel>
      <CollapsePanel key="axisSetting">
        <template #header>
          <Divider orientation="left">{{ t('page.quotaView.advance.axisSetting.title') }}</Divider>
        </template>
        <div class="pl-8">
          <YAxisEdit :chart-config="chartConfig" :idx="null" @update="updateConfig">
            <Button size="small">
              <template #icon>
                <Icon icon="ant-design:plus-outlined" />
              </template>
              <span>{{ t('page.quotaView.advance.axisSetting.yAxis.createY') }}</span>
            </Button>
          </YAxisEdit>
        </div>
      </CollapsePanel>
      <CollapsePanel key="datasourceSetting">
        <template #header>
          <Divider orientation="left">{{
            t('page.quotaView.advance.datasourceSetting.title')
          }}</Divider>
        </template>
        <div class="pl-8 flex flex-col gap-2">
          <span class="flex gap-1 items-center">
            <span>
              {{ t('page.quotaView.advance.datasourceSetting.past') }}
            </span>
            <InputNumber
              size="small"
              :min="0"
              class="!w-14 !min-w-14"
              v-model:value="datasourceSetting.pastValue"
            />
            <Select
              size="small"
              :options="pastUnitList"
              v-model:value="datasourceSetting.pastUnit"
            />
            <Tooltip>
              <template #title>
                <span>{{ t('page.quotaView.advance.datasourceSetting.tip') }}</span>
              </template>
              <Icon icon="ant-design:question-circle-outlined" />
            </Tooltip>
          </span>
          <div class="bg-gray-100 p-2 rounded-sm">
            <span class="text-primary">{{
              t('page.quotaView.advance.datasourceSetting.sortMonth')
            }}</span>
            <div class="grid grid-cols-6 grid-rows-2 gap-2 mt-2" @click="changeSortMonth">
              <div
                :data-month="month"
                :class="[
                  chartConfig.timeConfig.sortMonth.includes(month)
                    ? 'bg-white text-primary'
                    : 'bg-primary text-white',
                  'w-full text-center rounded-sm month',
                ]"
                v-for="month in 12"
                :key="month"
                >{{ month + t('page.quotaView.advance.datasourceSetting.pastUnit.month') }}</div
              >
            </div>
          </div>
        </div>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script lang="ts" setup>
  import { Divider, Switch, Collapse, InputNumber, Button, Select, Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Icon from '/@/components/Icon';
  import { useChartConfigContext } from './hooks';
  import YAxisEdit from '/@/components/Chart/src/YAxisEditor.vue';
  import { reactive, ref, toRaw, watch } from 'vue';
  import type { CSSProperties } from 'vue';
  import { quotaDataPastUnitTypeEnum } from '/@/api/quota';

  const CollapsePanel = Collapse.Panel;
  const panelTitleStyle: CSSProperties = reactive({
    backgroundColor: 'transparent',
    border: 'none',
  });
  const { t } = useI18n();
  const chartConfig = useChartConfigContext();
  const collapseKey = ref('rectSetting');
  const datasourceSetting = reactive({
    pastValue: 0,
    pastUnit: quotaDataPastUnitTypeEnum.last,
    sortMonth: [],
  });
  watch(
    () => {
      return chartConfig.timeConfig;
    },
    (v) => {
      if (v.pastValue) {
        datasourceSetting.pastValue = v.pastValue;
      }
    }
  );
  watch(
    datasourceSetting,
    (v) => {
      if (v.pastValue > 0) {
        Object.assign(chartConfig.timeConfig, toRaw(datasourceSetting));
      } else {
        chartConfig.timeConfig.pastUnit = undefined;
        chartConfig.timeConfig.pastValue = undefined;
      }
    },
    { deep: true }
  );
  const pastUnitList = ref([
    {
      label: quotaDataPastUnitTypeEnum.last,
      value: quotaDataPastUnitTypeEnum.last,
    },
    {
      label: quotaDataPastUnitTypeEnum.day,
      value: quotaDataPastUnitTypeEnum.day,
    },
    {
      label: quotaDataPastUnitTypeEnum.month,
      value: quotaDataPastUnitTypeEnum.month,
    },
  ]);
  function updateConfig(config) {
    Object.assign(chartConfig, config);
  }
  function changeSortMonth(e: PointerEvent) {
    console.log(e);
    const m = parseInt(e.target.dataset.month ?? NaN);
    if (m) {
      const idx = chartConfig.timeConfig.sortMonth?.indexOf(m);
      if (idx !== -1) {
        chartConfig.timeConfig.sortMonth?.splice(idx, 1);
      } else {
        chartConfig.timeConfig.sortMonth?.push(m);
        chartConfig.timeConfig.sortMonth?.sort();
      }
      console.log(chartConfig.timeConfig.sortMonth);
    }
  }
</script>

<style lang="less" scoped>
  .label {
    @apply flex items-center;

    > span {
      @apply ml-2;
    }
  }

  .ant-collapse {
    background-color: transparent !important;

    &-item {
      border: none;
    }
  }

  .ant-divider {
    margin: 0;
  }

  .month {
    transition: all 0.3s ease;
  }
</style>
