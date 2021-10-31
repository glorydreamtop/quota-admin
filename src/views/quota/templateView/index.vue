<template>
  <div class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden">
    <div class="w-75 h-full border enter-y flex-shrink-0 resize-x overflow-hidden">
      <TemplateTree :show-search="true" class="h-full w-full" @selectNode="selectNode" />
    </div>
    <div class="flex-grow h-full enter-y bg-gray-100 flex flex-col">
      <ToolBar />
      <Views class="views-box bg-white border" @selectTemplate="selectTemplate" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TemplateTree } from '/@/components/TemplateTree';
  import Views from './components/Views.vue';
  import ToolBar from './components/ToolBar.vue';
  import {
    createSelectTemplateListContext,
    createTemplateListContext,
    createUniqIdContext,
    insertDOM,
  } from './hooks';
  import { ref } from 'vue';
  import type { TemplateDOM } from '/#/template';
  import { useUniqueField } from '../quotaTable/components/helper';

  const templateList = ref<TemplateDOM[]>([]);
  const selectedTemplateList = ref<TemplateDOM[]>([]);
  const usedUniqId = ref<string[]>([]);
  createTemplateListContext(templateList);
  createSelectTemplateListContext(selectedTemplateList);
  createUniqIdContext(usedUniqId);
  const { getUniqueField } = useUniqueField(usedUniqId.value);
  function selectNode(node: TemplateDOM) {
    node.uniqId = getUniqueField();
    node.type = node.version! < 3 ? 'Chart' : 'Table';
    node.pageConfig = {
      width: '33.3%',
      height: '400px',
    };
    console.log(node);
    insertDOM(templateList, selectedTemplateList, node);
  }
  function selectTemplate(arr: TemplateDOM[]) {
    selectedTemplateList.value = arr;
  }
</script>

<style lang="less" scoped>
  .views-box {
    // height: calc(100% - 4rem);
    flex-grow: 1;
  }
</style>
