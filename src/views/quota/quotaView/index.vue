<template>
  <div class="h-layout-full p-4">
    <div class="h-full">
      <QuotaTree :show-search="true" class="h-full w-75" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { QuotaTree } from '/@/components/QuotaTree';
</script>

<style lang="less" scoped></style>
