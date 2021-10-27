<template>
  <div class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden">
    <div class="w-75 h-full border enter-y flex-shrink-0 resize-x overflow-hidden">
      <TemplateTree :show-search="true" class="h-full w-full" @selectNode="selectNode" />
    </div>
    <div class="bg-white flex-grow h-full border p-2 enter-y">
      <ToolBar class="h-16" />
      <Views class="views-box" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TemplateTree } from '/@/components/TemplateTree';
  import Views from './components/Views.vue';
  import ToolBar from './components/ToolBar.vue';
  import { createPageConfigContext, createTemplateListContext } from './hooks';
  import { reactive, ref } from 'vue';
  import type { TemplateDOM } from '/#/template';
  import { formatToDate, yearsAgo } from '/@/utils/dateUtil';
  import { useUniqueField } from '../quotaTable/components/helper';

  const templateList = ref<TemplateDOM[]>([]);
  createTemplateListContext(templateList);
  const { getUniqueField } = useUniqueField();
  function selectNode(node: TemplateDOM) {
    node.uniqId = getUniqueField();
    templateList.value.push(node);
    console.log(node);
  }
  const pageConfig = reactive({
    date: [yearsAgo(5), formatToDate()],
    sameTimeRange: false,
    showLastest: false,
    baseSize: {
      width: '50%',
      height: '300',
    },
  });
  createPageConfigContext(pageConfig);
</script>

<style lang="less" scoped>
  .views-box {
    height: calc(100% - 4rem);
  }
</style>
