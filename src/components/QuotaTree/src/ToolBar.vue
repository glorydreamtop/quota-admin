<template>
  <div class="toolbar">
    <Icon
      v-repeat-click="getData"
      class="cursor-pointer"
      icon="ant-design:sync-outlined"
      :spin="loading"
    />
    <Icon class="cursor-pointer" icon="ant-design:plus-outlined" />
  </div>
</template>

<script lang="ts" setup>
  import { toRefs } from 'vue';
  import Icon from '/@/components/Icon';

  const props = defineProps<{
    loading: boolean;
  }>();
  const emit = defineEmits<{
    (event: 'getData'): void;
  }>();

  const { loading } = toRefs(props);
  function getData() {
    emit('getData');
  }
</script>

<style lang="less" scoped>
  .toolbar {
    @apply shadow-gray-400;
    @apply shadow;
    @apply p-1;
    @apply border;

    position: absolute;
    top: 90px;
    right: 16px;
    font-size: 20px !important;
    z-index: 9;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background-color: white;
  }
</style>
