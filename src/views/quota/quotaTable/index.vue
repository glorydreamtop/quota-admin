<template>
  <div
    class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden"
    ref="containerRef1"
  >
    <div class="h-full w-75 relative scaleable1 border">
      <QuotaTree :show-search="true" class="h-full w-full enter-y" @selectNode="selectNode" />
      <ArrowsAltOutlined
        class="absolute scale z-9 cursor-w-resize"
        :rotate="45"
        :style="{ fontSize: '18px' }"
      />
    </div>
    <div class="flex-grow h-full">
      <TableEditor />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { QuotaTree } from '/@/components/QuotaTree';
  import TableEditor from './components/TableEditor.vue';
  import { ArrowsAltOutlined } from '@ant-design/icons-vue';
  import { useScaleable } from '/@/utils/helper/commonHelper';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';

  const containerRef1 = ref<HTMLDivElement>();
  onMountedOrActivated(() => {
    const container1 = unref(containerRef1)!;
    useScaleable(
      { container: container1, boxName: '.scaleable1', scaleName: '.scale' },
      { x: true, y: false, staticMode: true }
    );
  });
</script>

<style lang="less" scoped>
  .scale {
    right: -8px;
    bottom: 50%;
  }
</style>
