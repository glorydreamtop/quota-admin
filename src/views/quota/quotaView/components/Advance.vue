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
        <div class="flex flex-wrap gap-2 pl-8">
          <span class="label">
            <InputNumber
              size="small"
              class="!w-12 min-w-12"
              :min="0"
              v-model:value="chartConfig.valueFormatter.afterDot"
            /><span>{{ t('page.quotaView.advance.valueFormatter.afterDot') }}</span>
          </span>
          <span class="label">
            <InputNumber
              size="small"
              class="!w-12 min-w-12"
              :min="0"
              v-model:value="chartConfig.valueFormatter.scientificNotation"
            />
            <span>{{ t('page.quotaView.advance.valueFormatter.scientificNotation') }}</span>
          </span>
          <span class="label">
            <Switch
              v-model:checked="chartConfig.valueFormatter.normalized"
              :checked-children="t('page.quotaView.advance.use')"
              :un-checked-children="t('page.quotaView.advance.stop')"
            /><span>{{ t('page.quotaView.advance.valueFormatter.normalized') }}</span>
          </span>
        </div>
      </CollapsePanel>
      <CollapsePanel key="axisSetting">
        <template #header>
          <Divider orientation="left">{{ t('page.quotaView.advance.axisSetting.title') }}</Divider>
        </template>
        <div class="pl-8">
          <YAxisEdit
            :chart-config="chartConfig"
            :idx="null"
            @update="updateConfig"
            v-if="showSettingFilter('yAxisEdit')"
          >
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
          <span class="flex gap-1 items-center" v-if="showSettingFilter('pastValue')">
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
          <div class="bg-gray-100 p-2 rounded-sm" v-if="showSettingFilter('sortMonth')">
            <span class="text-primary flex items-center">
              <span>{{ t('page.quotaView.advance.datasourceSetting.sortMonth') }}</span>
              <template v-if="showSettingFilter('startMonth')">
                <span>，{{ t('page.quotaView.advance.datasourceSetting.startMonth') }}</span>
                <Input
                  class="!w-18 ml-1"
                  size="small"
                  addon-after="月"
                  v-model:value="chartConfig.timeConfig.startMonth"
                  @blur="startMonthChange"
                />
              </template>
            </span>
            <div class="grid grid-cols-6 grid-rows-2 gap-2 mt-2" @click="sortMonthChange">
              <div
                :data-month="month"
                :class="[
                  chartConfig.timeConfig.sortMonth.includes(month)
                    ? 'bg-white text-primary'
                    : 'bg-card-blue1 text-white',
                  'w-full text-center rounded-sm month cursor-pointer',
                ]"
                v-for="month in monthList"
                :key="month"
                >{{ month + t('page.quotaView.advance.datasourceSetting.pastUnit.month') }}</div
              >
            </div>
            <div
              v-if="showSettingFilter('sortYear')"
              class="flex flex-wrap gap-2 mt-2 pt-2 border-t border-t-gray-400"
              @click="sortYearChange"
            >
              <div
                :data-year="year"
                :class="[
                  chartConfig.timeConfig.sortYear.includes(year)
                    ? 'bg-white text-primary'
                    : 'bg-primary text-white',
                  'flex-grow min-w-40px max-w-80px text-center rounded-sm month cursor-pointer',
                ]"
                v-for="year in yearList"
                :key="year"
                >{{ year }}</div
              >
            </div>
          </div>
          <div class="bg-gray-100 p-2 rounded-sm" v-if="showSettingFilter('structuralOffset')">
            <span class="text-primary">
              {{ t('page.quotaView.advance.datasourceSetting.structuralOffset') }}
            </span>
            <div class="flex gap-2 items-center">
              <Input
                size="small"
                class="!w-30 !min-w-30"
                v-model:value="chartConfig.structuralOffset"
                @change="structuralOffsetChange"
              />
              <RadioGroup
                button-style="solid"
                size="small"
                v-model:value="chartConfig.structuralOffsetUnit"
              >
                <RadioButton :value="structuralOffsetUnitEnum.tradingDay">{{
                  t('common.tradingDay')
                }}</RadioButton>
                <RadioButton :value="structuralOffsetUnitEnum.natureDay">{{
                  t('common.natureDay')
                }}</RadioButton>
              </RadioGroup>
              <Tooltip>
                <template #title>
                  <span>{{
                    t('page.quotaView.advance.datasourceSetting.structuralOffsetTip')
                  }}</span>
                </template>
                <Icon icon="ant-design:question-circle-outlined" />
              </Tooltip>
            </div>
          </div>
          <div class="bg-gray-100 p-2 rounded-sm" v-if="showSettingFilter('quantileOffset')">
            <span class="text-primary">
              {{ t('page.quotaView.advance.datasourceSetting.quantileOffset') }}
            </span>
            <div class="flex gap-2 items-center">
              <Input
                size="small"
                class="!w-30 !min-w-30"
                v-model:value="chartConfig.quantileOffset"
                @change="quantileOffsetChange"
              />
              <Tooltip>
                <template #title>
                  <span>{{
                    t('page.quotaView.advance.datasourceSetting.structuralOffsetTip')
                  }}</span>
                </template>
                <Icon icon="ant-design:question-circle-outlined" />
              </Tooltip>
            </div>
          </div>
        </div>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script lang="ts" setup>
  import {
    Divider,
    Switch,
    Collapse,
    Input,
    InputNumber,
    Button,
    Select,
    Radio,
    Tooltip,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Icon from '/@/components/Icon';
  import { useChartConfigContext } from './hooks';
  import YAxisEdit from '/@/components/Chart/src/YAxisEditor.vue';
  import { reactive, ref, toRaw, watch } from 'vue';
  import type { CSSProperties } from 'vue';
  import { quotaDataPastUnitTypeEnum } from '/@/api/quota';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { chartTypeEnum, structuralOffsetUnitEnum } from '/@/enums/chartEnum';
  import { uniq } from 'lodash-es';
  import dayjs from 'dayjs';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const CollapsePanel = Collapse.Panel;
  const panelTitleStyle: CSSProperties = reactive({
    backgroundColor: 'transparent',
    border: 'none',
  });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const chartConfig = useChartConfigContext();
  const collapseKey = ref('datasourceSetting');
  function showSettingFilter(modelName: string) {
    const filter = {
      [chartTypeEnum.normal]: ['yAxisEdit', 'sortMonth', 'pastValue'],
      [chartTypeEnum.seasonal]: ['sortMonth', 'startMonth', 'sortYear'],
      [chartTypeEnum.seasonalLunar]: ['sortMonth', 'startMonth'],
      [chartTypeEnum.normalRadar]: ['pastValue'],
      [chartTypeEnum.quantileRadar]: ['quantileOffset'],
      [chartTypeEnum.bar]: ['pastValue'],
      [chartTypeEnum.structural]: ['structuralOffset'],
      [chartTypeEnum.pie]: ['pastValue'],
    };
    return filter[chartConfig.type].includes(modelName);
  }
  const datasourceSetting = reactive({
    pastValue: 0,
    pastUnit: quotaDataPastUnitTypeEnum.last,
  });
  watch(
    () => {
      return chartConfig.timeConfig;
    },
    (v) => {
      if (v.pastValue) {
        datasourceSetting.pastValue = v.pastValue;
      }
      updateYears();
    },
    {
      deep: true,
    },
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
    { deep: true },
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
  // 调整起始月份
  const monthList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  function startMonthChange({ target: { value } }: { target: HTMLInputElement }) {
    if (!(parseInt(value) > 0 && parseInt(value) < 13)) {
      setTimeout(() => {
        chartConfig.timeConfig.startMonth = 1;
      }, 500);
      createMessage.warn(t('page.quotaView.advance.datasourceSetting.startMonthTip'));
      return;
    }
    chartConfig.timeConfig.startMonth = parseInt(value);
    const index = monthList.value!.indexOf(parseInt(value));
    const [a1, a2] = [monthList.value.slice(0, index), monthList.value.slice(index)];
    monthList.value = [...a2, ...a1];
    updateYears();
  }
  function updateYears() {
    const startYear = dayjs(chartConfig.timeConfig.startDate).year();
    const endYear = dayjs(chartConfig.timeConfig.endDate).year();
    yearList.value = [];
    const startMonth = chartConfig.timeConfig.startMonth;
    for (let i = startYear; i <= endYear + 1; i++) {
      yearList.value.push(startMonth !== 1 ? `${i - 1}-${i}` : `${i}`);
    }
  }

  // 修改不要的月份
  function sortMonthChange(e: PointerEvent) {
    const m = parseInt(e.target.dataset.month ?? NaN);
    if (m) {
      const idx = chartConfig.timeConfig.sortMonth!.indexOf(m);
      if (idx !== -1) {
        chartConfig.timeConfig.sortMonth?.splice(idx, 1);
      } else {
        chartConfig.timeConfig.sortMonth?.push(m);
        chartConfig.timeConfig.sortMonth?.sort();
      }
    }
  }
  const yearList = ref<string[]>([]);
  updateYears();
  // 修改不要的年份
  function sortYearChange(e: PointerEvent) {
    const y = e.target.dataset.year;
    if (y) {
      const idx = chartConfig.timeConfig.sortYear!.indexOf(y);
      if (idx !== -1) {
        chartConfig.timeConfig.sortYear?.splice(idx, 1);
      } else {
        chartConfig.timeConfig.sortYear?.push(y);
      }
    }
  }
  // 校验曲线结构日期偏移量输入值
  function structuralOffsetChange({ target }: { target: HTMLInputElement }) {
    if (/[^(\d|,)]/g.test(target.value)) {
      target.style.borderColor = 'red';
      createMessage.error(t('common.invaildTextTip'));
      return;
    }
    const arr = target.value.split(',');
    if (uniq(arr).length !== arr.length) {
      createMessage.error(t('common.notUniqTip'));
      return;
    }
    target.style.borderColor = '';
  }
  function quantileOffsetChange({ target }: { target: HTMLInputElement }) {
    return structuralOffsetChange({ target });
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
