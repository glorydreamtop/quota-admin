<template>
  <div
    class="flex flex-col gap-1 children:whitespace-nowrap children:flex children:items-center w-30"
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
      <Input size="small" class="!w-12 !min-w-12" v-model:value="currentCfg.min" />
    </div>
    <div>
      <div class="min-w-3em text-justify mr-2">{{
        t('page.quotaView.advance.axisSetting.yAxis.max')
      }}</div>
      <Input size="small" class="!w-12 !min-w-12" v-model:value="currentCfg.max" />
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
      <div class="min-w-3em text-justify mr-2">逆序</div>
      <Switch size="small" v-model:checked="currentCfg.inverse" />
    </div>
    <div>
      <div class="min-w-3em text-justify mr-2">创建轴</div>
      <Button size="small" @click="create">+1</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { Input, Switch, Radio, Button } from 'ant-design-vue';
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
      position: 'left' | 'right';
    };
    idx: number;
  }>();
  const emit = defineEmits<{
    (event: 'update', currentCfg: any);
    (event: 'create', cloneCfg: any);
  }>();
  const currentCfg = reactive(cloneDeep(props.current));
  const idx = ref(props.idx);

  watch(
    currentCfg,
    (v) => {
      emit('update', v);
    },
    {
      deep: true,
    }
  );
  function create() {
    const clone = cloneDeep(currentCfg);
    emit('create', clone);
  }
</script>

<style lang="less" scoped></style>
