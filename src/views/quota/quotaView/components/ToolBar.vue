<template>
  <div class="relative">
    <Space align="center">
      <Select
        class="w-30"
        size="small"
        @select="selectType"
        v-model:value="chartConfig.type"
        :placeholder="t('quotaView.toolbar.chartTypeSelectPlaceholer')"
        :options="chartTypeList"
      />
      <Color />
      <div
        class="
          border border-gray-300
          w-50
          flex
          justify-center
          gap-2
          hover:border-primary
          date-picker
        "
      >
        <DatePicker
          size="small"
          v-model:value="chartConfig.timeConfig.startDate"
          value-format="YYYY-MM-DD"
          :showToday="false"
          :placeholer="t('quotaView.toolbar.startDatePicker')"
          ><span class="cursor-pointer">{{ chartConfig.timeConfig.startDate }}</span>
          <template #renderExtraFooter>
            <div class="flex items-center">
              <Input
                size="small"
                class="!w-10 text-center !mr-1"
                v-model:value="quickDateParams.num"
              />
              <RadioGroup button-style="solid" size="small" v-model:value="quickDateParams.unit">
                <RadioButton value="year">{{ t('quotaView.toolbar.year') }}</RadioButton>
                <RadioButton value="month">{{ t('quotaView.toolbar.month') }}</RadioButton>
                <RadioButton value="week">{{ t('quotaView.toolbar.week') }}</RadioButton>
                <RadioButton value="day">{{ t('quotaView.toolbar.day') }}</RadioButton>
              </RadioGroup>
              <span class="text-primary ml-auto cursor-pointer" @click="quickDate">{{
                t('common.okText')
              }}</span>
            </div>
          </template>
        </DatePicker>
        <span>~</span>
        <DatePicker
          size="small"
          v-model:value="chartConfig.timeConfig.endDate"
          value-format="YYYY-MM-DD"
          :placeholer="t('quotaView.toolbar.endDatePicker')"
          ><span class="cursor-pointer">{{ chartConfig.timeConfig.endDate }}</span></DatePicker
        >
      </div>

      <Icon
        title="暂不开放保存功能"
        :class="['save-icon ml-2', chartConfig.title.length === 0 ? 'disabled' : '']"
        size="21"
        icon="save|svg"
      />
      <Tooltip>
        <template #title>
          <span>{{
            showTableRef
              ? t('quotaView.toolbar.downloadXLSX')
              : t('quotaView.toolbar.downloadImg')
          }}</span>
        </template>
        <Icon
          :class="[
            'download-icon animate__animated',
            chartConfig.title.length === 0 ? 'disabled' : '',
          ]"
          size="24"
          icon="download_one|svg"
          @click="download($event)"
        />
      </Tooltip>
      <Tooltip>
        <template #title>{{
          showTableRef
            ? t('quotaView.toolbar.chartView')
            : t('quotaView.toolbar.tableView')
        }}</template>
        <div
          class="relative w-29px h-29px"
          :class="[chartConfig.title.length === 0 ? 'disabled' : '']"
          @click="showTable"
        >
          <Icon
            :class="['chartmode-icon', showTableRef ? 'front' : 'back']"
            icon="barchart|svg"
            size="27"
          />
          <Icon
            :class="['sheetmode-icon -mt-1px', !showTableRef ? 'front' : 'back']"
            icon="data_sheet|svg"
            size="29"
          />
        </div>
      </Tooltip>
      <Icon icon="fullscreen|svg" size="20" @click="fullscreen" />
    </Space>
    <div class="absolute right-0 top-0 z-9 w-18 h-18 overflow-hidden" @click="paint">
      <div
        v-ripple
        class="w-36 h-36 !absolute -right-18 -top-18 bg-linear-primary rounded-1 cursor-pointer"
      >
        <Icon class="absolute left-7 bottom-7" size="32" color="#fff" icon="ph:paint-brush-light" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, unref, ref } from 'vue';
  import { Input, Space, DatePicker, Select, Tooltip, Radio } from 'ant-design-vue';
  import vRipple from '/@/directives/ripple';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useChartConfigContext, useQuotaListContext, useSelectedQuotaListContext } from './hooks';
  import { chartTypeEnum } from '/@/enums/chartEnum';
  import Color from './Color.vue';
  import Icon from '/@/components/Icon';
  import { cloneDeep } from 'lodash-es';
  import { getChartDefaultConfig } from '../helper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTimeoutFn } from '@vueuse/shared';
  import dayjs from 'dayjs';

  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  const { t } = useI18n();
  const emit = defineEmits<{
    (event: 'paint'): void;
    (event: 'event', eventName: string): void;
  }>();
  const { createMessage } = useMessage();
  const chartConfig = useChartConfigContext();
  const quotaList = useQuotaListContext();
  const selectedQuotaList = useSelectedQuotaListContext();
  // 图表类型下拉选择
  const chartTypeList: LabelValueOptions = reactive([]);
  for (let v in chartTypeEnum) {
    chartTypeList.push({
      label: t(`quotaView.toolbar.chartTypeList.${v}`),
      value: v,
      disabled: [chartTypeEnum.seasonalLunar, chartTypeEnum.fixedbase].includes(v as chartTypeEnum),
    });
  }
  const quickDateParams = reactive({
    num: '1',
    unit: 'year',
  });
  function quickDate() {
    chartConfig.timeConfig.startDate = dayjs()
      .subtract(parseInt(quickDateParams.num), quickDateParams.unit)
      .format('YYYY-MM-DD');
  }
  function selectType(type: chartTypeEnum) {
    for (const key in chartConfig) {
      Reflect.deleteProperty(chartConfig, key);
    }
    Object.assign(chartConfig, getChartDefaultConfig(type));
  }
  async function paint() {
    if (quotaList.value.length === 0) {
      createMessage.warn(t('quotaView.toolbar.noQuotaListTip'));
      return;
    }
    // 季节性的公历和农历均只适用一个指标，使其他指标置灰
    if ([chartTypeEnum.seasonal, chartTypeEnum.seasonalLunar].includes(chartConfig.type)) {
      const list = selectedQuotaList.value;
      // 是否找到用户已选中的第一个指标，将用户选中的第一个指标作为绘图指标
      let findSelected = false;
      for (let index = 0; index < list.length; index++) {
        const quota = list[index];
        if (findSelected) {
          quota.selected = false;
        } else if (quota.selected) {
          findSelected = true;
        }
      }
    }
    await nextTick();
    // 拿到Title
    chartConfig.title = quotaList.value[0].name;
    chartConfig.quotaList = cloneDeep(unref(quotaList));
    emit('paint');
  }
  async function download({ target }: { target: HTMLElement }) {
    console.log(target);

    target.parentElement!.parentElement!.classList.add('animate__bounce');
    useTimeoutFn(() => {
      target.parentElement!.parentElement!.classList.remove('animate__bounce');
      emit('event', showTableRef.value ? 'xlsx' : 'screenshot');
    }, 1000);
  }
  const showTableRef = ref(false);
  function showTable() {
    showTableRef.value = !showTableRef.value;
    emit('event', showTableRef.value ? 'showTable' : 'showChart');
  }
  function fullscreen() {
    emit('event', 'fullscreen');
  }
</script>

<style lang="less" scoped>
  .date-picker {
    transition: border 300ms;
    border-radius: 2px;
  }

  .disabled {
    filter: grayscale(80%);

    pointer-events: none;
    transition: none;
  }

  .chartmode-icon,
  .sheetmode-icon {
    position: absolute;
    backface-visibility: hidden;
    transition: all 0.2s;
    perspective: 1000;

    &.front {
      transform: rotateY(-180deg);
    }

    &.back {
      transform: rotateY(-360deg);
    }
  }
</style>
