<template>
  <div class="bg-white h-full flex-grow border shadow-md">
    <div v-for="quota in quotaList" :key="quota.id"> </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useQuotaListContext } from '../hooks';

  const quotaList = useQuotaListContext();
</script>

<style lang="less" scoped></style>
