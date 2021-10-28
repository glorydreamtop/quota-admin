<template>
  <div class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden">
    <div class="w-75 h-full border enter-y flex-shrink-0 resize-x overflow-hidden">
      <TemplateTree :show-search="true" class="h-full w-full" @selectNode="selectNode" />
    </div>
    <div class="flex-grow h-full enter-y bg-gray-100">
      <ToolBar />
      <Views class="views-box bg-white border" @selectTemplate="selectTemplate" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TemplateTree } from '/@/components/TemplateTree';
  import Views from './components/Views.vue';
  import ToolBar from './components/ToolBar.vue';
  import { createSelectTemplateListContext, createTemplateListContext } from './hooks';
  import { ref } from 'vue';
  import type { TemplateDOM } from '/#/template';
  import { useUniqueField } from '../quotaTable/components/helper';

  const templateList = ref<TemplateDOM[]>([]);
  const selectedTemplateList = ref<TemplateDOM[]>([]);
  createTemplateListContext(templateList);
  createSelectTemplateListContext(selectedTemplateList);
  const { getUniqueField } = useUniqueField();
  function selectNode(node: TemplateDOM) {
    node.uniqId = getUniqueField();
    node.pageConfig = {
      width: '33.3%',
      height: '400px',
    };
    templateList.value.push(node);
  }
  function selectTemplate(arr: TemplateDOM[]) {
    selectedTemplateList.value = arr;
  }
</script>

<style lang="less" scoped>
  .views-box {
    height: calc(100% - 4rem);
  }
</style>
