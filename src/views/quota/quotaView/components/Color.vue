<template>
  <div>
    <Select
      class="min-w-26"
      size="small"
      label-in-value
      v-model:value="colorScheme"
      :options="colorSchemeList"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Select } from 'ant-design-vue';
  import { useChartConfigContext } from './hooks';
  import { getAllColorScheme } from '/@/api/color';
  import { cloneDeep } from 'lodash-es';

  const chartConfig = useChartConfigContext();
  const colorScheme = ref({
    id: chartConfig.colorSchemeId,
    label: '',
    value: '',
  });
  const colorSchemeList = ref<LabelValueOptions>([]);
  async function getColorSchemeList() {
    const { list } = await getAllColorScheme({ currPage: 1, pageSize: 20 });
    colorSchemeList.value = list.map((item) => {
      return {
        label: item.name,
        value: item.colors,
        id: item.id,
      };
    });
    colorScheme.value = cloneDeep(colorSchemeList.value[0]);
  }

  getColorSchemeList();
</script>

<style lang="less" scoped></style>
