<template>
  <div class="bg-white">
    <AutoComplete
      class="w-full"
      v-model:value="searchWord"
      @search="handleSearch"
      @select="handleSelect"
      :options="searchList"
    />
    <Tabs v-model:activeKey="treeType" class="tabs" centered>
      <TabPane :key="CategoryTreeType.sysQuota" :tab="t('quota.sysQuota')">
        <Icon
          @click="getData(CategoryTreeType.sysQuota)"
          class="refresh-icon"
          icon="ant-design:redo-outlined"
          :spin="loading[CategoryTreeType.sysQuota]"
        />
        <BasicTree
          v-bind="treeProps[CategoryTreeType.sysQuota]"
          ref="sysTree"
          @select="handleTreeSelect"
        />
      </TabPane>
      <TabPane :key="CategoryTreeType.userQuota" :tab="t('quota.userQuota')">
        <Icon
          @click="getData(CategoryTreeType.userQuota)"
          class="refresh-icon"
          icon="ant-design:redo-outlined"
          :spin="loading[CategoryTreeType.userQuota]" />
        <BasicTree
          v-bind="treeProps[CategoryTreeType.userQuota]"
          ref="userTree"
          @select="handleTreeSelect"
      /></TabPane>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, unref } from 'vue';
  // import type {ComponentPublicInstance} from 'vue';
  import { BasicTree } from '/@/components/Tree/index';
  import type { ReplaceFields, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { Tabs, TabPane, AutoComplete } from 'ant-design-vue';
  import { getQuotaTree, getDirQuota, searchQuota } from '/@/api/quota';
  import type { CategoryTreeModel, QuotaItem } from '/#/quota';
  import { CategoryTreeType } from '/@/enums/quotaEnum';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Icon from '/@/components/Icon';
  import { findNode, findPath, forEach } from '/@/utils/helper/treeHelper';
  import { useDebounceFn } from '@vueuse/shared';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { remove, uniq } from 'lodash';
  import { useTimeoutFn } from '/@/hooks/core/useTimeout';

  type treeProp = Partial<{
    treeData: TreeItem[];
    replaceFields: ReplaceFields;
    blockNode: boolean;
    clickRowToExpand: boolean;
    loadData: Fn;
  }>;
  interface treePropsModel {
    [CategoryTreeType.sysQuota]: treeProp;
    [CategoryTreeType.userQuota]: treeProp;
  }
  type QuotaType = CategoryTreeType.sysQuota | CategoryTreeType.userQuota;
  interface searchItemType {
    label: string;
    value: any;
    categoryId: number;
  }

  const HIGHTLIGHT = 'select-hightlight';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const treeType = ref<QuotaType>(CategoryTreeType.sysQuota);

  const treeProps: treePropsModel = reactive({
    [CategoryTreeType.sysQuota]: {
      treeData: [],
      replaceFields: {
        title: 'name',
      },
      blockNode: true,
      clickRowToExpand: true,
      loadData: ({ eventKey }) => loadData(eventKey),
    },
    [CategoryTreeType.userQuota]: {
      treeData: [],
      replaceFields: {
        title: 'name',
      },
      blockNode: true,
      clickRowToExpand: true,
      loadData: ({ eventKey }) => loadData(eventKey),
    },
  });
  const loading = reactive({
    [CategoryTreeType.sysQuota]: false,
    [CategoryTreeType.userQuota]: false,
  });
  async function getData(type: QuotaType) {
    loading[treeType.value] = true;
    const expandedKeys = getTreeInstance(treeType.value)?.getExpandedKeys() || null;
    try {
      const res = (await getQuotaTree({ type })) as Partial<CategoryTreeModel & TreeItem>[];
      forEach(res, (item) => {
        item.isLeaf = !item.folder;
        item.icon = item.folder ? 'ant-design:folder-outlined' : 'tabler:letter-q';
        if (expandedKeys && expandedKeys.includes(item.key!) && !item.children) {
          loadData(item.key!);
        }
      });
      treeProps[type].treeData = res;
      createMessage.success(t('sys.api.getOK'));
    } catch (error) {
      createMessage.error(t('sys.api.getFailed'));
    } finally {
      useTimeoutFn(() => {
        loading[treeType.value] = false;
      }, 950);
    }
  }

  const sysTree = ref<TreeActionType>();
  const userTree = ref<TreeActionType>();

  function getTreeInstance(type: QuotaType) {
    if (type === CategoryTreeType.sysQuota && unref(sysTree)) {
      return unref(sysTree);
    }
    if (type === CategoryTreeType.userQuota && unref(userTree)) {
      return unref(userTree);
    }
    throw new Error('tree instance did not inited or mounted!');
  }

  async function loadData(key: number) {
    const type = unref(treeType.value);
    const instance = getTreeInstance(type);
    const res = await getDirQuota({ categoryId: key });
    const { parentNode } = findParentNode(key, type);
    parentNode.children = res.map((item: QuotaItem & TreeItem) => {
      item.icon = 'tabler:letter-q';
      item.isLeaf = true;
      item.key = item.id;
      item.categoryId = key;
      item.name = `[${item.id}]${item.shortName || item.name}`;
      return item;
    });
    instance?.setExpandedKeys(uniq([key, ...instance.getExpandedKeys()]));
  }

  const searchWord = ref('');
  const searchList = ref<searchItemType[]>([]);
  async function search(key) {
    try {
      searchList.value = (await searchQuota({ key })).map((item) => {
        return {
          label: item.shortName || item.name,
          value: `[${item.id}]${item.shortName || item.name}`,
          categoryId: item.categoryId!,
        };
      });
    } catch (error) {
      createMessage.warn(t('common.searchResEmpty'));
    }
  }
  const handleSearch = useDebounceFn(search, 800);
  async function setHighLight(parentNode: TreeItem, id: number) {
    const node = parentNode.children!.find((item) => {
      Reflect.deleteProperty(item, 'class');
      return item.id === id;
    })!;
    node.class = HIGHTLIGHT;
    hightlightList.push(node);
  }
  function findParentNode(id: number, type?: QuotaType) {
    function fn(): [TreeItem | null, TreeActionType] {
      return [
        findNode<TreeItem>(treeProps[type || treeType.value].treeData, (item) => item.id === id),
        getTreeInstance(type || treeType.value)!,
      ];
    }
    let [parentNode, instance] = fn();
    if (!parentNode) {
      treeType.value =
        treeType.value === CategoryTreeType.sysQuota
          ? CategoryTreeType.userQuota
          : CategoryTreeType.sysQuota;
      [parentNode, instance] = fn();
    }
    return { parentNode: parentNode!, instance };
  }
  async function handleSelect(str: string, node: searchItemType) {
    const id = parseInt(str.match(/\[(\d+)\](.+)/i)![1]);
    const { parentNode, instance } = findParentNode(node.categoryId);
    if (parentNode.children && parentNode.children.length > 0) {
      setHighLight(parentNode, id);
    } else {
      await loadData(parentNode.id);
      const path: number[] = findPath(
        treeProps[CategoryTreeType.sysQuota].treeData,
        (item) => item.id === parentNode!.id
      ).map((path) => path.id);
      instance?.setExpandedKeys(uniq([...path, ...instance.getExpandedKeys()]));
      setHighLight(parentNode, id);
    }
  }

  const multiSelectedList = ref<number[]>([]);
  const hightlightList: TreeItem[] = [];
  // 树节点的选择，支持多选
  function handleTreeSelect(
    _,
    e: { nativeEvent: PointerEvent; node: { eventKey: number; $attrs: QuotaItem } }
  ) {
    const instance = getTreeInstance(treeType.value);
    const oldList = unref(multiSelectedList);
    const key = e.node.eventKey;
    const isFolder = Reflect.has(e.node.$attrs, 'folder');
    if (e.nativeEvent.ctrlKey && !isFolder) {
      // Ctrl多选
      const index = oldList.indexOf(key);
      if (index > -1) {
        multiSelectedList.value.splice(index, 1);
      } else {
        multiSelectedList.value.push(key);
      }
    } else if (e.nativeEvent.shiftKey && !isFolder) {
      // Shift多选
      let minIndex = 999;
      let maxIndex = 0;
      const list = findNode<TreeItem>(
        treeProps[treeType.value].treeData!,
        (node) => node.id === e.node.$attrs.categoryId
      )!.children!;
      for (let i = 0; i < multiSelectedList.value.length; i++) {
        minIndex = Math.min(
          list.findIndex((item) => item.key === multiSelectedList.value[i]),
          minIndex
        );
        maxIndex = Math.max(
          list.findIndex((item) => item.key === multiSelectedList.value[i]),
          maxIndex
        );
      }
      const currentIndex = list.findIndex((item) => item.key === key);
      if (currentIndex < minIndex) {
        minIndex = currentIndex;
      }
      if (currentIndex > maxIndex) {
        maxIndex = currentIndex;
      }
      for (let index = minIndex; index <= maxIndex; index++) {
        const key = list[index].key as number;
        if (multiSelectedList.value.indexOf(key) === -1) {
          multiSelectedList.value.push(key);
        }
      }
    } else {
      multiSelectedList.value = [key];
    }
    hightlightList.forEach((item) => {
      Reflect.deleteProperty(item, 'class');
    });
    remove(hightlightList, (_) => _);
    forEach(treeProps[treeType.value].treeData!, (item) => {
      if (multiSelectedList.value.includes(item.key as number)) {
        item.class = HIGHTLIGHT;
        hightlightList.push(item);
      }
    });
    instance?.setSelectedKeys(unref(multiSelectedList));
  }
  onMounted(() => {
    getData(CategoryTreeType.sysQuota);
    getData(CategoryTreeType.userQuota);
  });
</script>

<style lang="less" scoped>
  ::v-deep(.ant-tabs .ant-tabs-top-content) {
    height: calc(100% - 70px);

    .ant-tabs-tabpane {
      position: relative;
    }
  }

  ::v-deep(.select-hightlight) {
    > .ant-tree-node-content-wrapper {
      background-color: @primary-2 !important;
    }
  }

  .tabs {
    height: calc(100% - 32px);
  }

  .refresh-icon {
    position: absolute;
    top: 4px;
    right: 16px;
    font-size: 20px !important;
    z-index: 9;
  }
</style>
