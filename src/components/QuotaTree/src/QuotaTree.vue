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
        <BasicTree
          v-bind="treeProps[CategoryTreeType.sysQuota]"
          ref="sysTree"
          @select="handleTreeSelect"
        />
      </TabPane>
      <TabPane :key="CategoryTreeType.userQuota" :tab="t('quota.userQuota')" class="h-full"
        ><BasicTree
          v-bind="treeProps[CategoryTreeType.userQuota]"
          ref="userTree"
          @select="handleTreeSelect"
      /></TabPane>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref } from 'vue';
  // import type {ComponentPublicInstance} from 'vue';
  import { BasicTree } from '/@/components/Tree/index';
  import type { ReplaceFields, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { Tabs, TabPane, AutoComplete } from 'ant-design-vue';
  import { getQuotaTree, getDirQuota, searchQuota } from '/@/api/quota';
  import type { CategoryTreeModel, QuotaItem } from '/#/quota';
  import { CategoryTreeType } from '/@/enums/quotaEnum';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { findNode, findPath, forEach } from '/@/utils/helper/treeHelper';
  import { useDebounceFn } from '@vueuse/shared';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { remove, uniq } from 'lodash';

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

  async function getData(type: QuotaType) {
    const res = (await getQuotaTree({ type })) as Partial<CategoryTreeModel & TreeItem>[];
    forEach(res, (item) => {
      item.isLeaf = !item.folder;
      item.icon = item.folder ? 'ant-design:folder-outlined' : 'tabler:letter-q';
    });
    treeProps[type].treeData = res;
  }
  getData(CategoryTreeType.sysQuota);
  getData(CategoryTreeType.userQuota);
  const sysTree = ref<TreeActionType>();
  const userTree = ref<TreeActionType>();

  function getTreeInstance(type: QuotaType) {
    if (type === CategoryTreeType.sysQuota && sysTree.value) {
      return unref(sysTree);
    }
    if (type === CategoryTreeType.userQuota && sysTree.value) {
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
    node.class = 'select-hightlight';
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
  function handleTreeSelect(_, e: { nativeEvent: PointerEvent; node: { eventKey: number } }) {
    const instance = getTreeInstance(treeType.value);
    const oldList = unref(multiSelectedList);
    const key = e.node.eventKey;
    console.log(e);

    if (e.nativeEvent.ctrlKey) {
      const index = oldList.indexOf(key);
      if (index > -1) {
        multiSelectedList.value.splice(index, 1);
      } else {
        multiSelectedList.value.push(key);
      }
    } else if (e.nativeEvent.shiftKey) {
      // let minIndex = 0;
      // const parentNode = findNode(treeProps[treeType.value].treeData!, (item) => {
      //   item.key === key;
      // });
      // for (let i = 0; i < multiSelectedList.value.length; i++) {
      // }
    } else {
      multiSelectedList.value = [key];
    }
    hightlightList.forEach((item) => {
      Reflect.deleteProperty(item, 'class');
    });
    remove(hightlightList, (_) => _);
    forEach(treeProps[treeType.value].treeData!, (item) => {
      if (multiSelectedList.value.includes(item.key as number)) {
        item.class = 'select-hightlight';
        hightlightList.push(item);
      }
    });
    instance?.setSelectedKeys(unref(multiSelectedList));
  }
</script>

<style lang="less" scoped>
  ::v-deep(.ant-tabs .ant-tabs-top-content) {
    height: calc(100% - 70px);
  }

  ::v-deep(.select-hightlight) {
    > .ant-tree-node-content-wrapper {
      background-color: @primary-2;
    }
  }

  .tabs {
    height: calc(100% - 32px);
  }
</style>
