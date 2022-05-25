<template>
  <div class="grid gap-2" v-if="showSettingFilter('removePoint')">
    <div class="label">
      <span>{{ t('quotaView.advance.dataEdit.removePoint') }}</span>
      <BasicHelp :text="t('quotaView.advance.dataEdit.xTip')" />
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
        <span v-for="item in chartConfig.removePoint" :key="`${item.seriesName}${item.xRange}`">
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
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Tooltip, Tag, Select, Button, Input } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useChartConfigContext, useSettingFilter, echartMitter } from '../hooks';
  import { normalChartConfigType } from '/#/chart';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { remove } from 'lodash-es';
  import { EChartsOption, LineSeriesOption } from 'echarts';
  import { BasicHelp } from '/@/components/Basic';

  const TextArea = Input.TextArea;
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const chartConfig = useChartConfigContext();
  const showSettingFilter = useSettingFilter(chartConfig);
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
</script>

<style lang="less" scoped></style>
