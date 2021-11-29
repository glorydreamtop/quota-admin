<template>
  <div class="p-4 h-layout-full flex gap-4">
    <div class="h-full min-w-90 w-90 relative border resize-x overflow-hidden shadow-md">
      <QuotaTree :show-search="true" class="h-full w-full enter-y" @selectNode="selectNode" />
    </div>
    <QuotaPool />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { QuotaTree } from '/@/components/QuotaTree';
  import { createQuotaListContext, SelectedQuotaItem } from './hooks';
  import QuotaPool from './components/QuotaPool.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const quotaList = ref<SelectedQuotaItem[]>([]);
  const { createMessage } = useMessage();
  createQuotaListContext(quotaList);
  function selectNode(quota: SelectedQuotaItem) {
    quota.selected = true;
    if (quotaList.value.some((q) => q.id === quota.id)) {
      createMessage.warn('')
    } else {
      quotaList.value.push(quota);
    }
  }
</script>

<style lang="less" scoped></style>
