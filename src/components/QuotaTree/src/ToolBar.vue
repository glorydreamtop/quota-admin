<template>
  <div class="toolbar">
    <Icon
      v-repeat-click="getData"
      :class="['cursor-pointer !text-purple-600 animate__animated',loading?' animate__flash':'']"
      :size="20"
      icon="CloudSync|svg"
    />
    <Icon class="cursor-pointer !text-purple-600" :size="20" icon="ant-design:plus-outlined" />
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
