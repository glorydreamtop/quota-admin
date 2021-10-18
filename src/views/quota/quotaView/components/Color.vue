<template>
  <div>
    <Select class="min-w-26" size="small" label-in-value v-model:value="colorScheme">
      <SelectOption v-for="item in colorSchemeList" :key="item.id" :value="item.value">
        <Popover placement="right">
          <template #content>
            <div class="flex color-popover">
              <div
                v-for="color in item.value"
                :key="color"
                class="w-2 h-4"
                :style="{ backgroundColor: color }"
              ></div>
            </div>
          </template>
          <div class="w-full">{{ item.label }}</div>
        </Popover>
      </SelectOption>
    </Select>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Select, Popover } from 'ant-design-vue';
  import { useChartConfigContext } from './hooks';
  import { getAllColorScheme } from '/@/api/color';
  import { cloneDeep } from 'lodash-es';

  interface LabelValueOption {
    label: string;
    value: any;
    id: number;
  }
  const SelectOption = Select.Option;
  const chartConfig = useChartConfigContext();
  const colorScheme = ref({
    id: chartConfig.colorSchemeId,
    label: '',
    value: '',
  });
  const colorSchemeList = ref<LabelValueOption[]>([]);
  async function getColorSchemeList() {
    const { list } = await getAllColorScheme({ currPage: 1, pageSize: 20 });
    colorSchemeList.value = list.map((item) => {
      return {
        label: item.name,
        value: item.colors.split(','),
        id: item.id,
      };
    });
    colorScheme.value = cloneDeep(colorSchemeList.value[0]);
  }

  getColorSchemeList();
</script>

<style lang="less" scoped>
  .color-popover {
    margin: -6px -8px;
    gap: 2px;

    div {
      // transform: skew(-10deg);
    }
  }
</style>
