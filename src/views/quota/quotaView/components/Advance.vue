<template>
  <div class="pr-2 border-l-gray-300 flex w-380px" ref="container">
    <div class="w-24px h-full relative border-l group line hover-gray-shadow" @click="hide">
      <Icon
        class="absolute -left-2px group-hover:-left-1px top-1/2 !text-26px !text-gray-400"
        :icon="`ant-design:${containerHidden ? 'left' : 'right'}-outlined`"
      />
    </div>
    <Collapse class="flex-grow overflow-y-scroll" v-model:activeKey="collapseKey" :bordered="false">
      <CollapsePanel key="rectSetting">
        <template #header>
          <Divider orientation="left">{{ t('quotaView.advance.rectSetting.title') }}</Divider>
        </template>
        <div class="grid grid-cols-2 pr-8 justify-items-end">
          <span class="label">
            <span>{{ t('quotaView.advance.rectSetting.lastest') }}</span>
            <Switch
              :checked-children="t('quotaView.advance.show')"
              :un-checked-children="t('quotaView.advance.hide')"
              v-model:checked="chartConfig.showLastest"
            />
          </span>
          <span class="label">
            <span>{{ t('quotaView.advance.rectSetting.highest') }}</span>
            <Switch
              :checked-children="t('quotaView.advance.show')"
              :un-checked-children="t('quotaView.advance.hide')"
              v-model:checked="chartConfig.showHighest"
            />
          </span>
        </div>
      </CollapsePanel>
      <CollapsePanel key="valueFormatter">
        <template #header>
          <Divider orientation="left">{{ t('quotaView.advance.valueFormatter.title') }}</Divider>
        </template>
        <div class="grid grid-cols-2 pr-8 justify-items-end">
          <span class="label">
            <span>{{ t('quotaView.advance.valueFormatter.afterDot') }}</span>
            <InputNumber
              size="small"
              class="!w-14 min-w-14"
              :min="0"
              v-model:value="chartConfig.valueFormatter.afterDot"
            />
          </span>
          <span class="label">
            <span>{{ t('quotaView.advance.valueFormatter.normalized') }}</span>
            <Switch
              v-model:checked="chartConfig.valueFormatter.normalized"
              :checked-children="t('quotaView.advance.use')"
              :un-checked-children="t('quotaView.advance.stop')"
            />
          </span>
        </div>
      </CollapsePanel>
      <CollapsePanel key="axisSetting">
        <template #header>
          <Divider orientation="left">{{ t('quotaView.advance.axisSetting.title') }}</Divider>
        </template>
        <div class="pl-8" v-if="showSettingFilter('yAxisEdit')">
          <div class="flex items-center gap-2">
            <YAxisEdit :chart-config="chartConfig" :idx="null" @update="updateConfig">
              <Button size="small">
                <template #icon>
                  <Icon icon="ant-design:plus-outlined" />
                </template>
                <span>{{ t('quotaView.advance.axisSetting.yAxis.createY') }}</span>
              </Button>
            </YAxisEdit>
            <Tooltip>
              <template #title>
                <span>{{ t('quotaView.advance.axisSetting.yAxis.tip2') }}</span>
              </template>
              <Icon icon="ant-design:question-circle-outlined" />
            </Tooltip>
          </div>
          <div class="yAxisList">
            <Tag
              v-for="yAxis in yAxisIndexList"
              :key="yAxis.label"
              :closable="yAxis.closable"
              @close="delYAxis(yAxis.value)"
            >
              {{ yAxis.label }}
            </Tag>
          </div>
        </div>
      </CollapsePanel>
      <CollapsePanel key="datasourceSetting">
        <template #header>
          <Divider orientation="left">{{ t('quotaView.advance.datasourceSetting.title') }}</Divider>
        </template>
        <div class="flex flex-col gap-2 pl-8">
          <span class="flex items-center gap-1" v-if="showSettingFilter('pastValue')">
            <span>
              {{ t('quotaView.advance.datasourceSetting.past') }}
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
                <span>{{ t('quotaView.advance.datasourceSetting.tip') }}</span>
              </template>
              <Icon icon="ant-design:question-circle-outlined" />
            </Tooltip>
          </span>
          <div class="p-2 bg-gray-100 rounded-sm" v-if="showSettingFilter('sortMonth')">
            <span class="flex items-center text-primary">
              <span>{{ t('quotaView.advance.datasourceSetting.sortMonth') }}</span>
              <template v-if="showSettingFilter('startMonth')">
                <span>，{{ t('quotaView.advance.datasourceSetting.startMonth') }}</span>
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
                    : 'bg-linear-primary text-white',
                  'w-full text-center rounded-sm month cursor-pointer',
                ]"
                v-for="month in monthList"
                :key="month"
                >{{ month + t('quotaView.advance.datasourceSetting.pastUnit.month') }}</div
              >
            </div>
            <div
              v-if="showSettingFilter('sortYear')"
              class="flex flex-wrap gap-2 pt-2 mt-2 border-t border-t-gray-400"
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
          <div class="p-2 bg-gray-100 rounded-sm" v-if="showSettingFilter('structuralOffset')">
            <span class="text-primary">
              {{ t('quotaView.advance.datasourceSetting.structuralOffset') }}
            </span>
            <div class="flex items-center gap-2">
              <Input
                size="small"
                class="!w-30 !min-w-30"
                v-model:value="chartConfig.structuralOffset"
                @change="offsetChange"
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
                  <span>{{ t('quotaView.advance.datasourceSetting.structuralOffsetTip') }}</span>
                </template>
                <Icon icon="ant-design:question-circle-outlined" />
              </Tooltip>
            </div>
          </div>
          <div class="p-2 bg-gray-100 rounded-sm" v-if="showSettingFilter('quantileOffset')">
            <span class="text-primary">
              {{ t('quotaView.advance.datasourceSetting.quantileOffset') }}
            </span>
            <div class="flex items-center gap-2">
              <Input
                size="small"
                class="!w-30 !min-w-30"
                v-model:value="chartConfig.quantileOffset"
                @change="offsetChange"
              />
              <Tooltip>
                <template #title>
                  <span>{{ t('quotaView.advance.datasourceSetting.structuralOffsetTip') }}</span>
                </template>
                <Icon icon="ant-design:question-circle-outlined" />
              </Tooltip>
            </div>
          </div>
        </div>
      </CollapsePanel>
      <CollapsePanel key="dataEdit">
        <template #header>
          <Divider orientation="left">{{ t('quotaView.advance.dataEdit.title') }}</Divider>
        </template>
        <div class="grid gap-2" v-if="showSettingFilter('removePoint')">
          <div class="label">
            <span>{{ t('quotaView.advance.dataEdit.removePoint') }}</span>
            <Tooltip>
              <template #title>
                <span>{{ t('quotaView.advance.dataEdit.xTip') }}</span>
              </template>
              <Icon icon="ant-design:question-circle-outlined" />
            </Tooltip>
          </div>
          <div class="label">
            <div class="min-w-4em">{{ t('quotaView.advance.dataEdit.xFilter') }}</div>
            <TextArea v-model:value="removePoint.xRange" />
          </div>
          <div class="label">
            <div class="min-w-4em">{{ t('quotaView.advance.dataEdit.seriesFilter') }}</div>
            <Select
              :placeholder="t('quotaView.advance.dataEdit.seriesTip')"
              class="flex-grow"
              v-model:value="removePoint.seriesName"
              :options="seriesOptions"
            />
            <Button type="primary" @click="addFilterGroup">{{
              t('quotaView.advance.dataEdit.addBtn')
            }}</Button>
          </div>
          <div class="items-baseline label">
            <div class="min-w-4em">{{ t('quotaView.advance.dataEdit.filterGroup') }}</div>
            <div class="!children:mb-3">
              <span
                v-for="item in chartConfig.removePoint"
                :key="`${item.seriesName}${item.xRange}`"
              >
                <Tooltip placement="left">
                  <template #title>
                    <span>{{ item.xRange }}</span>
                  </template>
                  <Tag closable @close="delFilterGroup(item)">{{ item.seriesName }}</Tag>
                </Tooltip>
              </span>
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
    Tag,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Icon from '/@/components/Icon';
  import { echartMitter, useSortMonthAndYear, useYAxisEdit } from './hooks';
  import YAxisEdit from '/@/components/Chart/src/YAxisEditor.vue';
  import { onMounted, reactive, ref, toRaw, unref, watch } from 'vue';
  import { quotaDataPastUnitTypeEnum } from '/@/api/quota';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { chartTypeEnum, structuralOffsetUnitEnum } from '/@/enums/chartEnum';
  import { remove, uniq } from 'lodash-es';
  import { EChartsOption, LineSeriesOption } from 'echarts';
  import { chartConfigType, normalChartConfigType } from '/#/chart';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const CollapsePanel = Collapse.Panel;
  const TextArea = Input.TextArea;
  const container = ref<HTMLElement>();
  const { t } = useI18n();
  const { createMessage } = useMessage();
  // const chartConfig = useChartConfigContext();

  const props = defineProps<{
    config: chartConfigType;
  }>();
  const emit = defineEmits<{
    (event: 'update:config', config: chartConfigType): void;
  }>();
  const chartConfig = reactive({
    ...props.config,
  });
  watch(
    () => props.config,
    (newVal) => {
      Object.assign(chartConfig, newVal);
    },
    { deep: true, immediate: true },
  );
  watch(
    chartConfig,
    (newVal) => {
      emit('update:config', newVal);
    },
    { deep: true, immediate: true },
  );
  const collapseKey = ref('dataEdit');
  function showSettingFilter(modelName: string) {
    const filter = {
      [chartTypeEnum.normal]: ['yAxisEdit', 'sortMonth', 'pastValue', 'removePoint'],
      [chartTypeEnum.seasonal]: ['yAxisEdit', 'sortMonth', 'startMonth', 'sortYear', 'removePoint'],
      [chartTypeEnum.seasonalLunar]: ['yAxisEdit', 'sortMonth', 'startMonth', 'removePoint'],
      [chartTypeEnum.normalRadar]: ['pastValue'],
      [chartTypeEnum.quantileRadar]: ['quantileOffset'],
      [chartTypeEnum.bar]: ['yAxisEdit', 'pastValue'],
      [chartTypeEnum.structural]: ['yAxisEdit', 'structuralOffset'],
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
      if (v.pastValue !== undefined && v.pastUnit !== undefined) {
        datasourceSetting.pastValue = v.pastValue;
        datasourceSetting.pastUnit = v.pastUnit;
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
  // 年份月份过滤
  const [
    { monthList, yearList },
    { sortMonthChange, startMonthChange, sortYearChange, updateYears },
  ] = useSortMonthAndYear(chartConfig);
  // Y轴编辑
  const [yAxisIndexList, { delYAxis }] = useYAxisEdit(chartConfig);
  // 校验曲线结构日期偏移量输入值
  function offsetChange({ target }: { target: HTMLInputElement }) {
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
  // 智能抹去数据点
  const removePoint = reactive({
    xRange: '',
    seriesName: '',
  });
  const seriesOptions = ref<{ label: any; value: any }[]>([]);
  echartMitter.on('echartOptions', (options: EChartsOption) => {
    seriesOptions.value = (options.series as LineSeriesOption[]).map((ser) => {
      return {
        label: ser.name,
        value: ser.name,
      };
    });
  });
  function addFilterGroup() {
    const list = (chartConfig as normalChartConfigType).removePoint ?? [];
    const repeat = list.some(
      (item) => item.seriesName === removePoint.seriesName && item.xRange === removePoint.xRange,
    );
    if (repeat) {
      createMessage.warn(t('common.notUniqTip'));
      return;
    }
    list.push({
      seriesName: removePoint.seriesName,
      xRange: removePoint.xRange,
    });
    (chartConfig as normalChartConfigType).removePoint = list;
  }
  function delFilterGroup(group: any) {
    remove(
      (chartConfig as normalChartConfigType).removePoint!,
      (item) => item.xRange === group.xRange && item.seriesName === group.seriesName,
    );
  }
  const containerHidden = ref(false);
  function hide() {
    const parent = unref(container)!;
    const line = parent.getElementsByClassName('line')[0] as HTMLElement;
    const shadow = parent.parentElement?.getElementsByClassName('shadow-box')[0] as HTMLElement;
    const startWidth = parent.offsetWidth;
    const remainWidth = line.offsetWidth;
    if (containerHidden.value) {
      // 移动本体，缩小影子
      parent.style.right = '1rem';
      shadow.style.width = `${startWidth}px`;
      line.classList.remove('gray-shadow');
      line.classList.add('hover-gray-shadow');
      containerHidden.value = false;
    } else {
      parent.style.right = `calc(-${startWidth - remainWidth}px + 1rem)`;
      shadow.style.width = `${remainWidth}px`;
      line.classList.remove('hover-gray-shadow');
      line.classList.add('gray-shadow');
      containerHidden.value = true;
    }
  }
  onMounted(() => {
    const parent = unref(container)!;
    const shadow = document.createElement('div') as HTMLElement;
    const startWidth = `${parent.offsetWidth}px`;
    const startHeight = `${parent.offsetHeight}px`;
    Object.assign(shadow.style, {
      width: startWidth,
      height: '100%',
      transition: 'width .3s',
    });
    Object.assign(parent.style, {
      width: startWidth,
      height: startHeight,
      position: 'absolute',
      right: '1rem',
      transition: 'right .3s',
    });
    shadow.className = 'shadow-box';
    parent.parentElement?.appendChild(shadow);
  });
</script>

<style lang="less" scoped>
  .label {
    @apply flex items-center gap-2;
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

  .yAxisList {
    margin-top: 0.5rem;
    margin-bottom: -0.5rem;

    ::v-deep(.ant-tag) {
      margin-bottom: 0.5rem;
    }
  }

  ::v-deep(.anticon.anticon-close) {
    vertical-align: middle;
    color: @primary-color;
    font-size: 12px;
    margin-top: -2px;
    margin-right: -4px;
  }

  .line {
    transition: background-color 0.3s;

    &.hover-gray-shadow {
      &:hover {
        background-color: rgb(242, 245, 250);
        border-left: none;
      }
    }

    &.gray-shadow {
      background-color: rgb(242, 245, 250);
      border-left-color: rgb(242, 245, 250);

      &:hover {
        border-left: none;
      }
    }
  }

  .container {
    transform: translateX(100px);
  }
</style>
