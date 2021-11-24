<template>
  <div class="p-4 h-layout-full flex gap-4">
    <div class="h-full min-w-90 w-90 relative border resize-x overflow-hidden shadow-md">
      <QuotaTree :show-search="true" class="h-full w-full enter-y" @selectNode="selectNode" />
    </div>
    <QuotaList />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { QuotaTree } from '/@/components/QuotaTree';
  import QuotaList from './components/QuotaList.vue';
  import { createQuotaListContext } from './hooks';
  import { QuotaItem } from '/#/quota';

  const quotaList = ref<QuotaItem[]>([]);
  createQuotaListContext(quotaList);
  function selectNode(quota: QuotaItem) {
    quotaList.value.push(quota);
  }
</script>

<style lang="less" scoped></style>
