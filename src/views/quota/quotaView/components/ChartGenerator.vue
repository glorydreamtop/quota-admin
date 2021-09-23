<template>
  <div class="bg-white shadow-md flex-grow p-4 overflow-hidden rounded-md flex">
    <div class="w-3/5">
      <ToolBar class="" />
      <BasicChart class="mt-4 component-border w-full" />
    </div>
    <Advance class="w-2/5" />
  </div>
</template>
<script lang="ts" setup>
  import ToolBar from './ToolBar.vue';
  import Advance from './Advance.vue';
  import { BasicChart } from '/@/components/Chart';
</script>

<style lang="less" scoped>
  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: all 0.8s ease;
    opacity: 1;
  }

  .component-fade-enter-from,
  .component-fade-leave-to {
    transform: scale(0.5);
    opacity: 0;
  }
</style>
