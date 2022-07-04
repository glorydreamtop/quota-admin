<template>
  <div class="flex justify-start items-center h-layout-full p-4 gap-4 w-full overflow-hidden">
    <div
      ref="container"
      class="absolute top-32 z-49 border w-70 flex justify-end bg-white drawer overflow-hidden"
      :style="{ height: `calc(100% - 9rem)` }"
    >
      <TemplateTree
        :show-search="false"
        class="h-full w-full drawer-main"
        @selectNode="selectNode"
      />
    </div>
    <div class="h-full bg-gray-100 flex flex-col w-full">
      <ToolBar />
      <Views class="views-box" />
    </div>
  </div>
</template>

<script lang="ts" setup name="templateView">
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
  import { useDrawer } from './hooks';
  import { chartConfigType } from '/#/chart';
  import { timeConfigEnum } from '/@/enums/chartEnum';
  import { today, yearsAgo } from '/@/utils/dateUtil';

  const templateList = ref<TemplateDOM[]>([]);
  const selectedTemplateList = ref<TemplateDOM[]>([]);
  const usedUniqId = ref<string[]>([]);
  const pageSetting: pageSettingType = reactive({
    paddingBottom: 32,
    paddingTop: 32,
    paddingLeft: 32,
    paddingRight: 32,
    pagination: true,
    horizontal: false,
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
    showElementborder: true,
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
      width: '480px',
      height: '240px',
      transform: 'translate(0px, 0px)',
    };
    if (node.version! < 3) {
      const config = node.config as chartConfigType;
      if (config.timeConfig.type === timeConfigEnum.default) {
        config.timeConfig.endDate = today();
        config.timeConfig.startDate = yearsAgo(5);
      }
    }
    insertDOM(templateList, selectedTemplateList, node);
    console.log(node);
  }
  const container = ref<HTMLElement>();
  useDrawer(container);
</script>

<style lang="less" scoped>
  .views-box {
    // height: calc(100% - 4rem);
    // flex-grow: 1;
    // width: auto;
    // max-width: 1571px;
  }

  // 收起配置界面用的css

  .drawer-main {
    transition: opacity 0.2s ease;
  }

  .drawer {
    box-shadow: 6px 8px 20px #b9b9b975;
  }

  ::v-deep(.line) {
    transition: background-color 0.3s;
    width: 20px;
    min-width: 20px;
    height: 100%;
    position: relative;
    border-left: 1px solid #e8e8e8;

    .arrow-icon {
      color: rgba(156, 163, 175, 1) !important;
      transition: transform 0.5s;
      position: absolute;
      top: 50%;
      font-size: 20px;

      &.rotate {
        transform: rotate(180deg);
      }
    }

    .tip {
      color: rgba(156, 163, 175, 1) !important;
      transform: translateX(-2px);
      position: absolute;
      top: 40%;
      writing-mode: vertical-rl;
      user-select: none;
    }

    &.hover-gray-shadow:hover {
      background-color: rgba(243, 244, 246, 1);
      border-left-color: rgba(243, 244, 246, 1);
    }

    &.gray-shadow {
      background-color: rgba(243, 244, 246, 1);
      border-left-color: rgba(243, 244, 246, 1);
    }
  }
</style>
