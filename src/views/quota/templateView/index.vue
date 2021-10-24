<template>
  <div class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden">
    <div class="w-75 h-full border">
      <TemplateTree :show-search="true" class="h-full w-full enter-y" @selectNode="selectNode" />
    </div>
    <div class="bg-white flex-grow h-full border">
      <Views />
    </div>
  </div>
</template>

<script lang="ts" setup>
  // import { ref } from 'vue';
  import { TemplateTree } from '/@/components/TemplateTree';
  import Views from './components/Views.vue';
  import { createTemplateListContext } from './hooks';
  import { ref } from 'vue';
  import type { TemplateItem } from '/#/template';

  const templateList = ref<TemplateItem[]>([]);
  createTemplateListContext(templateList);
  function selectNode(node) {
    console.log(node);
    templateList.value.push(node);
  }
</script>

<style lang="less" scoped></style>
