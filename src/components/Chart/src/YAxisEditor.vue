<template>
  <Popover
    v-bind="$attrs"
    trigger="click"
    v-model:visible="visible"
    :placement="placement"
    destroyTooltipOnHide
  >
    <template #content>
      <div
        class="flex flex-col gap-1 children:whitespace-nowrap children:flex children:items-center w-30"
      >
        <div>
          <div class="w-3em text-justify mr-2">
            {{ t('quotaView.advance.axisSetting.yAxis.index') }}
          </div>
          <span>{{ isNull(idx) ? chartConfig.yAxis.length + 1 : idx + 1 }}</span>
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('quotaView.advance.axisSetting.yAxis.min')
          }}</div>
          <Input
            size="small"
            class="!w-59px !min-w-59px"
            v-model:value="currentCfg.min"
            :placeholder="t('common.auto')"
            @input="(e) => onInputNumber(e, 'min')"
          />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('quotaView.advance.axisSetting.yAxis.max')
          }}</div>
          <Input
            size="small"
            class="!w-59px !min-w-59px"
            v-model:value="currentCfg.max"
            :placeholder="t('common.auto')"
            @input="(e) => onInputNumber(e, 'max')"
          />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('quotaView.advance.axisSetting.yAxis.color')
          }}</div>
          <div class="color-popover">
            <div
              v-for="color in currentColorScheme"
              :key="color"
              class="w-2 h-2"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('quotaView.advance.axisSetting.yAxis.position')
          }}</div>
          <RadioGroup
            size="small"
            v-model:value="currentCfg.position"
            @change="positionChange"
            button-style="solid"
          >
            <RadioButton value="left">{{
              t('quotaView.advance.axisSetting.yAxis.left')
            }}</RadioButton>
            <RadioButton value="right">{{
              t('quotaView.advance.axisSetting.yAxis.right')
            }}</RadioButton>
          </RadioGroup>
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('quotaView.advance.axisSetting.yAxis.inverse')
          }}</div>
          <Switch size="small" v-model:checked="currentCfg.inverse" />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('quotaView.advance.axisSetting.yAxis.showLine')
          }}</div>
          <Switch size="small" v-model:checked="currentCfg.axisLine.show" />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('quotaView.advance.axisSetting.yAxis.magnitude')
          }}</div>
          <InputNumber
            size="small"
            class="!w-59px !min-w-59px"
            :min="0"
            v-model:value="scientificNotation"
          />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('quotaView.advance.axisSetting.yAxis.offset')
          }}</div>
          <Input
            size="small"
            class="!w-38px !min-w-38px !mr-1"
            v-model:value="currentCfg.offset"
            @input="(e) => onInputNumber(e, 'offset')"
          />
          <Tooltip>
            <template #title>
              <span>{{ t('quotaView.advance.axisSetting.yAxis.offsetTip') }}</span>
            </template>
            <Icon icon="ant-design:question-circle-outlined" />
          </Tooltip>
        </div>
        <div class="mt-2 flex gap-1">
          <Button size="small" block type="primary" @click="confirm">{{
            t('common.okText')
          }}</Button>
          <!-- <Button
            size="small"
            block
            type="primary"
            danger
            @click="del"
            v-show="props.idx !== null"
            >{{ t('common.removeText') }}</Button
          > -->
        </div>
      </div>
    </template>
    <div>
      <slot></slot>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { Input, Switch, Radio, Popover, Button, InputNumber, Tooltip } from 'ant-design-vue';
  import { cloneDeep, last, partition, merge } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { normalChartConfigType } from '/#/chart';
  import type { YAXisComponentOption } from 'echarts';
  import Icon from '/@/components/Icon';
  import { isNull } from '/@/utils/is';
  import { useColor } from '../helper';
  const { t } = useI18n();

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const props = defineProps<{
    chartConfig: normalChartConfigType;
    idx: Nullable<number>;
  }>();
  const emit = defineEmits<{
    (event: 'update', chartConfig: normalChartConfigType);
    (event: 'visibleChange', visible: boolean);
  }>();
  const currentCfg = reactive({
    min: undefined,
    max: undefined,
    inverse: false,
    offset: 0,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#333333',
      },
    },
    position: 'left',
    axisLabel: {
      formatter: '{value}',
    },
  }) as YAXisComponentOption;
  const scientificNotation = ref(0);
  const placementMap = {
    left: 'right',
    right: 'left',
  };

  const placement = ref<'left' | 'right'>('right');
  // 数字格式化
  function onInputNumber(e, type: 'min' | 'max' | 'offset') {
    if (e.target.value === '') {
      currentCfg[type] = undefined;
      return;
    }
    currentCfg[type] = parseFloat((e.target.value as string).replace(/[^\d|\.]/g, ''));
  }
  const visible = ref(false);
  function setVisible(v) {
    visible.value = v;
  }
  defineExpose({ setVisible });
  watch(visible, (v) => {
    if (v) {
      getColorScheme();
      if (props.idx === null) {
        // 新增的智能分配到轴比较少的一侧
        const [leftAxis, rightAxis] = partition(props.chartConfig.yAxis!, (item) => {
          return item.position === 'left';
        });
        const isLeft = leftAxis.length < rightAxis.length;
        // 新轴的偏移量在最后一根同侧轴+40
        const offset =
          (isLeft ? last(leftAxis)?.offset ?? -40 : last(rightAxis)?.offset ?? -40) + 40;
        merge(currentCfg, {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: offset,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333333',
            },
          },
          position: isLeft ? 'left' : 'right',
          axisLabel: {
            formatter: '{value}',
          },
        });
        scientificNotation.value = 0;
      } else {
        Object.assign(currentCfg, cloneDeep(props.chartConfig.yAxis[props.idx]));
        // @ts-ignore
        const formatter = props.chartConfig.yAxis[props.idx!].axisLabel!.formatter as string;
        scientificNotation.value = /pow/i.test(formatter)
          ? parseInt(formatter.match(/\d+/i)![0])
          : 0;
      }
      placement.value = placementMap[currentCfg.position!];
    }
    emit('visibleChange', v);
  });
  function positionChange() {
    // 新增的智能分配到轴比较少的一侧
    const [leftAxis, rightAxis] = partition(props.chartConfig.yAxis!, (item) => {
      return item.position === 'left';
    });
    const isLeft = currentCfg.position === 'left';
    currentCfg.offset =
      (isLeft ? last(leftAxis)?.offset ?? -40 : last(rightAxis)?.offset ?? -40) + 40;
  }
  function confirm() {
    const config = cloneDeep(props.chartConfig);
    if (scientificNotation.value > 0) {
      currentCfg.axisLabel!.formatter! = `pow${scientificNotation.value}`;
    } else {
      currentCfg.axisLabel!.formatter! = '{value}';
    }
    if (props.idx === null) {
      // 添加模式
      config.yAxis.push(cloneDeep(currentCfg));
    } else {
      // 修改模式
      Object.assign(config.yAxis[props.idx], currentCfg);
    }
    emit('update', config);
    setVisible(false);
  }
  const currentColorScheme = ref<string[]>([]);
  async function getColorScheme() {
    currentColorScheme.value = await useColor({ chartConfig: props.chartConfig });
  }
</script>

<style lang="less" scoped>
  .color-popover {
    @apply flex flex-wrap !w-59px bg-white p-1 shadow shadow-gray-300;

    gap: 2px;

    div {
      // transform: skew(-10deg);
    }
  }
</style>
