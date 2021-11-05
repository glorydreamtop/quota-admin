<template>
  <div class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden">
    <div class="w-75 h-full border enter-y flex-shrink-0 resize-x overflow-hidden">
      <TemplateTree :show-search="false" class="h-full w-full" @selectNode="selectNode" />
    </div>
    <div class="flex-grow h-full enter-y bg-gray-100 flex flex-col">
      <ToolBar />
      <Views class="views-box" @selectTemplate="selectTemplate" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TemplateTree } from '/@/components/TemplateTree';
  import Views from './components/Views.vue';
  import ToolBar from './components/ToolBar.vue';
  import {
    createPageSettingContext,
    createSelectTemplateListContext,
    createTemplateListContext,
    createUniqIdContext,
    insertDOM,
  } from './hooks';
  import { reactive, ref } from 'vue';
  import type { pageSettingType, TemplateDOM } from '/#/template';
  import { useUniqueField } from '../quotaTable/components/helper';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useResizeObserver } from '@vueuse/core';

  const templateList = ref<TemplateDOM[]>([]);
  const selectedTemplateList = ref<TemplateDOM[]>([]);
  const usedUniqId = ref<string[]>([]);
  const pageSetting: pageSettingType = reactive({
    paddingBottom: 24,
    paddingTop: 24,
    paddingLeft: 32,
    paddingRight: 32,
    pagination: true,
    header: {
      show: true,
      left: '笃初诚美 慎终宜令',
      center: '',
      right: '上海笃诚投资管理有限公司',
    },
    footer: {
      show: true,
      left: '内部资料 禁止分发',
      center: '',
      right: '上海笃诚投资管理有限公司',
      pageNum: true,
    },
  });
  createTemplateListContext(templateList);
  createSelectTemplateListContext(selectedTemplateList);
  createUniqIdContext(usedUniqId);
  createPageSettingContext(pageSetting);
  const { getUniqueField } = useUniqueField(usedUniqId.value);
  function selectNode(node: TemplateDOM) {
    node.uniqId = getUniqueField();
    node.type = node.version! < 3 ? 'Chart' : 'Table';
    node.pageConfig = {
      width: '50%',
      height: '300px',
    };
    insertDOM(templateList, selectedTemplateList, node);
    console.log(node);
  }
  function selectTemplate(arr: TemplateDOM[]) {
    selectedTemplateList.value = arr;
  }
  onMountedOrActivated(() => {
    const viewBox = document.getElementsByClassName('views-box')[0];
    const parentEle = viewBox.parentElement;
    useResizeObserver(parentEle, (e) => {
      viewBox.style.maxWidth = `${(e[0].target as HTMLElement).offsetWidth}px`;
    });
  });
</script>

<style lang="less" scoped>
  .views-box {
    // height: calc(100% - 4rem);
    flex-grow: 1;
    // width: auto;
    // max-width: 1571px;
  }
</style>
