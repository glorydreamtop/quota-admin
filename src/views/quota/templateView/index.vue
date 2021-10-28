<template>
  <div class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden">
    <div class="w-75 h-full border enter-y flex-shrink-0 resize-x overflow-hidden">
      <TemplateTree :show-search="true" class="h-full w-full" @selectNode="selectNode" />
    </div>
    <div class="flex-grow h-full enter-y bg-gray-100">
      <ToolBar @update="updateConfig" />
      <Views class="views-box bg-white border" @selectTemplate="selectTemplate" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TemplateTree } from '/@/components/TemplateTree';
  import Views from './components/Views.vue';
  import ToolBar from './components/ToolBar.vue';
  import { createTemplateListContext } from './hooks';
  import { ref } from 'vue';
  import type { TemplateDOM } from '/#/template';
  import { useUniqueField } from '../quotaTable/components/helper';
  import { parseInt } from 'lodash';

  const templateList = ref<TemplateDOM[]>([]);
  const uniqIds = ref<string[]>([]);
  createTemplateListContext(templateList);
  const { getUniqueField } = useUniqueField();
  function selectNode(node: TemplateDOM) {
    node.uniqId = getUniqueField();
    node.pageConfig = {
      width: '33.3%',
      height: '400px',
    };
    templateList.value.push(node);
    console.log(node);
  }
  function selectTemplate(ids: string[]) {
    uniqIds.value = ids;
  }
  function updateConfig({ name, param }: { name: string; param: any }) {
    console.log({ name, param });

    switch (name) {
      case 'baseSize':
        let { width, height } = param;
        if (/\%/i.test(width)) {
          width = width;
        } else if (parseInt(width).toString() === width) {
          width = `${width}px`;
        } else {
          width = '33.3%';
        }
        if (parseInt(height).toString() === height) {
          height = `${height}px`;
        } else {
          height = '300px';
        }
        templateList.value.forEach((temp) => {
          if (uniqIds.value.includes(temp.uniqId)) {
            temp.pageConfig.width = width;
            temp.pageConfig.height = height;
          }
        });
        break;
      case 'date':
        templateList.value.forEach((temp) => {
          if (temp.version < 3 && uniqIds.value.includes(temp.uniqId)) {
            [temp.config.timeConfig.startDate, temp.config.timeConfig.endDate] = [...param];
          }
        });
        break;
      case 'showLastest':
        templateList.value.forEach((temp) => {
          if (temp.version < 3 && uniqIds.value.includes(temp.uniqId)) {
            temp.config.showLastest = param;
          }
        });
        break;
      default:
        break;
    }
  }
</script>

<style lang="less" scoped>
  .views-box {
    height: calc(100% - 4rem);
  }
</style>
