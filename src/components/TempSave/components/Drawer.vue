<template>
  <BasicDrawer
    @register="register"
    header-style="display:none"
    :scrollOptions="{ enableScroll: false }"
  >
    <div class="flex flex-col h-full p-4 overflow-hidden">
      <TemplateTree
        ref="drawerTree"
        :show-search="false"
        class="w-full drawerTree"
        @select-folder="selectFolder"
      />
      <div class="grid grid-cols-2 grid-rows-3 gap-4 h-200px border-t pt-2">
        <div class="col-span-2 row-span-1 flex items-center flex-wrap gap-y-1">
          <span class="whitespace-nowrap">上次选中的目录</span>
          <template v-for="name in historyPath">
            <Icon class="arrow" size="12" icon="ant-design:right-outlined" />
            <span
              class="bg-gray-100 leading-5 px-1 border border-gray-400 whitespace-nowrap name"
              >{{ name }}</span
            >
          </template>
        </div>
        <div class="col-span-2 row-span-1 flex items-center flex-wrap gap-y-1">
          <span class="whitespace-nowrap">选中的目录</span>
          <template v-for="name in folderPath">
            <Icon class="arrow" size="12" icon="ant-design:right-outlined" />
            <span
              class="bg-gray-100 leading-5 px-1 border border-gray-400 whitespace-nowrap name"
              >{{ name }}</span
            >
          </template>
        </div>
        <Button block type="primary">保存</Button>
        <Button block>另存为</Button>
      </div>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { Button } from 'ant-design-vue';
  import { chartConfigType } from '/#/chart';
  import { updateTemplate } from '/@/api/template';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import Icon from '/@/components/Icon';
  import { TemplateTree } from '/@/components/TemplateTree';
  import { CategoryTreeModel } from '/#/quota';
  import { getPathHistory, setPathHistory } from '../helper';

  const route = useRoute();
  // 从路由获取当前编辑的模板ID，没有就是NaN
  const templateId = parseInt((route.params.templateId ?? '') as string);
  const [register, { closeDrawer }] = useDrawerInner(
    ({ chartConfig }: { chartConfig: chartConfigType }) => {
      console.log(getPathHistory());
      
      historyPath.value = getPathHistory();
    },
  );

  const folderPath = ref<string[]>([]);
  const historyPath = ref<string[]>([]);

  function selectFolder(folderNode: CategoryTreeModel, path: string[]) {
    console.log(path);
    folderPath.value = path;
    setPathHistory(path);
  }

  // async function saveTemplate() {
  //   await updateTemplate({
  //     id: templateId ?? undefined,
  //     template: JSON.stringify(toRaw(chartConfig)),
  //     type: CategoryTreeType.sysTemplate,
  //   });
  // }
</script>

<style lang="less" scoped>
  .drawerTree {
    max-height: calc(100% - 200px);
    height: calc(100% - 200px);
  }

  .name:last-of-type {
    background: lighten(@primary-color, 10%);
    color: @white;
  }
</style>
