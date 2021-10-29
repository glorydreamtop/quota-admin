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
        class="
          flex flex-col
          gap-1
          children:whitespace-nowrap children:flex children:items-center
          w-30
        "
      >
        <div>
          <div class="w-3em text-justify mr-2">
            {{ t('page.quotaView.advance.axisSetting.yAxis.index') }}
          </div>
          <span>{{ idx > -1 ? idx + 1 : '' }}</span>
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.min')
          }}</div>
          <Input
            size="small"
            class="!w-59px !min-w-59px"
            v-model:value="currentCfg.min"
            @input="(e) => onInputNumber(e, 'min')"
          />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.max')
          }}</div>
          <Input
            size="small"
            class="!w-59px !min-w-59px"
            v-model:value="currentCfg.max"
            @input="(e) => onInputNumber(e, 'max')"
          />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.position')
          }}</div>
          <RadioGroup size="small" v-model:value="currentCfg.position" button-style="solid">
            <RadioButton value="left">{{
              t('page.quotaView.advance.axisSetting.yAxis.left')
            }}</RadioButton>
            <RadioButton value="right">{{
              t('page.quotaView.advance.axisSetting.yAxis.right')
            }}</RadioButton>
          </RadioGroup>
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.inverse')
          }}</div>
          <Switch size="small" v-model:checked="currentCfg.inverse" />
        </div>
        <div>
          <div class="min-w-3em text-justify mr-2">{{
            t('page.quotaView.advance.axisSetting.yAxis.offset')
          }}</div>
          <Input
            size="small"
            v-model:value="currentCfg.offset"
            @input="(e) => onInputNumber(e, 'offset')"
          />
        </div>
        <div class="mt-2 flex gap-1">
          <Button size="small" block type="primary" @click="confirm">{{
            t('common.okText')
          }}</Button>
          <Button
            size="small"
            block
            type="primary"
            danger
            @click="del"
            v-show="props.idx !== null"
            >{{ t('common.removeText') }}</Button
          >
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
  import { Input, Switch, Radio, Popover, Button } from 'ant-design-vue';
  import { cloneDeep, last, partition } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { normalChartConfigType } from '/#/chart';
  import type { YAXisComponentOption } from 'echarts';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { t } = useI18n();

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const { createMessage } = useMessage();
  const props = defineProps<{
    chartConfig: normalChartConfigType;
    idx: Nullable<number>;
  }>();
  const emit = defineEmits<{
    (event: 'update', chartConfig: normalChartConfigType);
    (event: 'visibleChange', visible: boolean);
  }>();
  const currentCfg = reactive({}) as YAXisComponentOption;
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
      if (props.idx === null) {
        // 新增的智能分配到轴比较少的一侧
        const [leftAxis, rightAxis] = partition(props.chartConfig.yAxis!, (item) => {
          return item.position === 'left';
        });
        const isLeft = leftAxis.length < rightAxis.length;
        // 新轴的偏移量在最后一根同侧轴+40
        const offset =
          (isLeft ? last(rightAxis)?.offset ?? -40 : last(leftAxis)?.offset ?? -40) + 40;
        Object.assign(currentCfg, {
          min: undefined,
          max: undefined,
          inverse: false,
          offset: offset,
          position: isLeft ? 'left' : 'right',
        });
      } else {
        Object.assign(currentCfg, props.chartConfig.yAxis[props.idx]);
      }
      placement.value = placementMap[currentCfg.position!];
    }
    emit('visibleChange', v);
  });
  function confirm() {
    const config = cloneDeep(props.chartConfig);
    if (props.idx === null) {
      // 添加模式
      config.yAxis.push(currentCfg);
    } else {
      // 修改模式
      Object.assign(config.yAxis[props.idx], currentCfg);
    }
    emit('update', config);
    setVisible(false);
  }
  function del() {
    const config = cloneDeep(props.chartConfig);
    // 检查当前轴是否被使用中
    const hasDep = config.quotaList!.find((quota) => quota.setting.yAxisIndex === props.idx);
    if (hasDep) {
      createMessage.warn(
        `[${hasDep.name}]` + t('page.quotaView.advance.axisSetting.yAxis.cannotdel')
      );
      return;
    }
    if (config.yAxis.length === 1) {
      createMessage.warn(t('page.quotaView.advance.axisSetting.yAxis.lastnotdel'));
      return;
    }
    config.yAxis.splice(props.idx!, 1);
    emit('update', config);
    setVisible(false);
  }
</script>

<style lang="less" scoped></style>
