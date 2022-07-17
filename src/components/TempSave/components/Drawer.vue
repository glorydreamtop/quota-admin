<template>
  <BasicDrawer
    @register="register"
    header-style="display:none"
    :scrollOptions="{ enableScroll: false }"
  >
    <div
      class="flex flex-col h-full p-4 overflow-hidden"
      v-loading="loading"
      loading-tip="保存中..."
    >
      <TemplateTree
        ref="drawerTree"
        :show-search="false"
        class="w-full drawerTree"
        @select-folder="selectFolder"
      />
      <div class="grid grid-cols-2 grid-rows-3 gap-4 h-200px border-t pt-2">
        <div class="col-span-2 row-span-1 flex items-center flex-wrap gap-y-1">
          <span class="whitespace-nowrap">上次选中的目录</span>
          <template v-for="name in historyPath" :key="name">
            <Icon class="arrow" size="12" icon="ant-design:right-outlined" />
            <span
              class="bg-gray-100 leading-5 px-1 border border-gray-400 whitespace-nowrap name"
              >{{ name }}</span
            >
          </template>
          <BasicHelp titile="使用这个位置">
            <Icon
              @click="applyPath"
              :class="[historyPath === folderPath ? 'same' : '']"
              size="12"
              icon="ant-design:check-circle-outlined"
            />
          </BasicHelp>
        </div>
        <div class="col-span-2 row-span-1 flex items-center flex-wrap gap-y-1">
          <span class="whitespace-nowrap">选中的目录</span>
          <template v-for="name in folderPath" :key="name">
            <Icon class="arrow" size="12" icon="ant-design:right-outlined" />
            <span
              class="bg-gray-100 leading-5 px-1 border border-gray-400 whitespace-nowrap name"
              >{{ name }}</span
            >
          </template>
        </div>
        <Button block type="primary" @click="saveTemplate">保存</Button>
        <Button block>另存为</Button>
      </div>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { Button } from 'ant-design-vue';
  import { chartConfigType } from '/#/chart';
  import { updateTemplate } from '/@/api/template';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import Icon from '/@/components/Icon';
  import { TemplateTree } from '/@/components/TemplateTree';
  import { BasicHelp } from '/@/components/Basic';
  import { CategoryTreeModel } from '/#/quota';
  import { getPathHistory, setPathHistory } from '../helper';
  import { TemplateApiNeed } from '/#/template';
  import { CategoryTreeType } from '/@/enums/quotaEnum';

  // 接口需要的格式
  interface templateConfigApiNeed {
    config: object;
    category_id: number;
  }

  const route = useRoute();
  // 从路由获取当前编辑的模板ID，没有就是NaN
  const templateId = parseInt((route.params.templateId ?? '') as string);

  const [register, { closeDrawer }] = useDrawerInner(
    ({ chartConfig, categoryId }: { chartConfig: chartConfigType; categoryId: number }) => {
      console.log(getPathHistory());
      configApiNeed.config = chartConfig;
      historyPath.value = getPathHistory();
    },
  );
  const configApiNeed: templateConfigApiNeed = reactive({
    config: {},
    category_id: NaN,
  });
  const tempInfo: TemplateApiNeed = reactive({
    temolate_name: '',
    template: '',
    type: CategoryTreeType.sysTemplate,
    id: templateId || void 0,
  });

  const folderPath = ref<string[]>([]);
  const historyPath = ref<string[]>([]);

  const loading = ref(false);

  function selectFolder(
    folderNode: CategoryTreeModel,
    path: string[],
    type: CategoryTreeType.sysTemplate | CategoryTreeType.userTemplate,
  ) {
    folderPath.value = path;
    configApiNeed.category_id = folderNode.id;
    tempInfo.type = type;
  }

  function applyPath() {
    folderPath.value = historyPath.value;
  }

  async function saveTemplate() {
    loading.value = true;
    tempInfo.template = JSON.stringify(configApiNeed);
    await updateTemplate(tempInfo);
    setPathHistory(folderPath.value);
    loading.value = false;
    closeDrawer();
  }
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

  .same {
    color: @primary-color!important;
  }
</style>
