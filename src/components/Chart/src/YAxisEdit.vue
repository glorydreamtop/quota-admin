<template>
  <Popover trigger="click" v-model:visible="visible">
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
        <span>{{ idx + 1 }}</span>
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
    </div>
  </Popover>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { Input, Switch, Radio, Popover } from 'ant-design-vue';
  import { cloneDeep } from 'lodash';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const props = defineProps<{
    current: {
      yAxisIndex: number;
      max?: number;
      min?: number;
      inverse: boolean;
      offset?: number;
      position: 'left' | 'right';
    };
    idx: number;
  }>();
  const emit = defineEmits<{
    (event: 'update', currentCfg: any);
  }>();
  const currentCfg = reactive(cloneDeep(props.current));
  const idx = ref(props.idx);
  // 数字格式化
  function onInputNumber(e, type: 'min' | 'max' | 'offset') {
    if (e.target.value === '') {
      currentCfg[type] = undefined;
      return;
    }
    currentCfg[type] = parseFloat((e.target.value as string).replace(/[^\d|\.]/g, ''));
  }
  const visible = ref(false);
  watch(
    currentCfg,
    (v) => {
      emit('update', v);
    },
    {
      deep: true,
    }
  );
</script>

<style lang="less" scoped></style>
