<template>
  <div class="h-full overflow-y-scroll">
    <div
      class="flex text-center h-12 items-center even:bg-gray-100"
      v-for="(item, index) in dataList"
      :key="item.memberName"
    >
      <div class="w-10">{{ index + 1 }}</div>
      <div class="flex items-center flex-grow">
        <div class="w-1/3">{{ item.memberName }}</div>
        <div class="w-1/3">{{ item.volume }}</div>
        <div class="w-1/3">{{ item.volumeChange }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { toRefs } from 'vue';
  import type { RankResult } from '/@/api/future/model';

  const props = defineProps<{
    dataList: RankResult;
  }>();
  const { dataList } = toRefs(props);
</script>

<style lang="less" scoped></style>
