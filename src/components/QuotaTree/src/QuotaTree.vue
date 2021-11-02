<template>
  <div class="bg-white tail">
    <QuotaSearch v-if="showSearch" @select="handleSelect" />
    <Icon
      v-repeat-click="getData"
      class="refresh-icon"
      icon="ant-design:sync-outlined"
      :spin="loading[CategoryTreeType.sysQuota]"
    />
    <Tabs v-model:activeKey="treeType" class="tabs" centered>
      <TabPane :key="CategoryTreeType.sysQuota" :tab="t('quota.sysQuota')">
        <BasicTree
          v-loading="loading[CategoryTreeType.sysQuota]"
          v-bind="treeProps[CategoryTreeType.sysQuota]"
          ref="sysTree"
          draggable
          @dragstart="dragStart"
          @drop="drop"
          @select="handleTreeSelect"
        >
          <template #title="item">
            <span
              class="w-full"
              :data-folderId="item.folder ? item.key : undefined"
              :data-LeafId="!item.folder ? item.key : undefined"
            >
              <Icon :icon="item.icon" />
              <span
                :data-folderId="item.folder ? item.key : undefined"
                :data-LeafId="!item.folder ? item.key : undefined"
                class="select-none tree-node w-full"
                >{{ nodeFilter(item) }}</span
              >
            </span>
          </template>
        </BasicTree>
      </TabPane>
      <TabPane :key="CategoryTreeType.userQuota" :tab="t('quota.userQuota')">
        <BasicTree
          v-bind="treeProps[CategoryTreeType.userQuota]"
          ref="userTree"
          draggable
          @dragstart="dragStart"
          @drop="drop"
          @select="handleTreeSelect"
        >
          <template #title="item">
            <span
              class="w-full"
              :data-folderId="item.folder ? item.key : undefined"
              :data-LeafId="!item.folder ? item.key : undefined"
            >
              <Icon :icon="item.icon" />
              <span
                :data-folderId="item.folder ? item.key : undefined"
                :data-LeafId="!item.folder ? item.key : undefined"
                class="select-none tree-node w-full"
                >{{ nodeFilter(item) }}</span
              >
            </span>
          </template>
        </BasicTree></TabPane
      >
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, unref, defineEmits, defineProps, toRefs, nextTick } from 'vue';
  import { QuotaSearch } from '../index';
  import { BasicTree } from '/@/components/Tree/index';
  import type { ContextMenuItem } from '/@/components/Tree/index';
  import type { TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { Tabs } from 'ant-design-vue';
  import {
    getQuotaTree,
    getDirQuota,
    requestUpdateQuotaData,
    moveQuota,
    sortQuota,
    updateCategory,
  } from '/@/api/quota';
  import type { CategoryTreeModel, QuotaItem } from '/#/quota';
  import { CategoryTreeType } from '/@/enums/quotaEnum';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Icon from '/@/components/Icon';
  import { findNode, findPath, forEach } from '/@/utils/helper/treeHelper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uniq } from 'lodash-es';
  import { useTimeoutFn } from '/@/hooks/core/useTimeout';
  import { useHighLight, useMultiSelect } from '../hooks';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import type { treeSelectParams, treePropsModel, QuotaType, searchItemType } from '../types';

  const emit = defineEmits<{
    (event: 'selectNode', node: QuotaItem): void;
    (event: 'selectFolder', folder: CategoryTreeModel): void;
  }>();
  const props = defineProps<{
    showSearch: boolean;
  }>();
  const { showSearch } = toRefs(props);
  const HIGHTLIGHT = 'select-hightlight';
  const TabPane = Tabs.TabPane;
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const treeType = ref<QuotaType>(CategoryTreeType.sysQuota);

  const isFolder = (node: QuotaItem | CategoryTreeModel) =>
    Reflect.has(node, 'folder') && (node as CategoryTreeModel).folder;

  function nodeFilter(item: QuotaItem | CategoryTreeModel) {
    if (isFolder(item)) {
      return item.name;
    }
    return `[${item.id}]${(item as QuotaItem).shortName || item.name}`;
  }
  const treeProps: treePropsModel = reactive({
    [CategoryTreeType.sysQuota]: {
      treeData: [],
      replaceFields: {
        title: 'name',
      },
      blockNode: true,
      clickRowToExpand: true,
      loadData: ({ eventKey }) => loadData(eventKey),
      beforeRightClick,
    },
    [CategoryTreeType.userQuota]: {
      treeData: [],
      replaceFields: {
        title: 'name',
      },
      blockNode: true,
      clickRowToExpand: true,
      loadData: ({ eventKey }) => loadData(eventKey),
      beforeRightClick,
    },
  });
  const loading = reactive({
    [CategoryTreeType.sysQuota]: false,
    [CategoryTreeType.userQuota]: false,
  });
  async function getData(type: QuotaType = unref(treeType)) {
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
      }, 960);
    }
  }

  const sysTree = ref<TreeActionType & ComponentRef>();
  const userTree = ref<TreeActionType & ComponentRef>();

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
    const list = res.map((item: QuotaItem & TreeItem) => {
      item.icon = 'tabler:letter-q';
      item.isLeaf = true;
      item.key = item.id;
      item.categoryId = key;
      return item;
    });
    if (parentNode.children) {
      parentNode.children.push(...list);
    } else {
      parentNode.children = list;
    }

    instance?.setExpandedKeys(uniq([key, ...instance.getExpandedKeys()]));
  }
  // 启用高亮Hooks
  const [highLightList, { setHighLight, clearHightLight, insertHightListNode }] =
    useHighLight(HIGHTLIGHT);
  function findParentNode(id: number, type?: QuotaType) {
    function fn(): [TreeItem | null, TreeActionType & ComponentRef] {
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
  // 搜索列表选中回调
  async function handleSelect(str: string, node: searchItemType) {
    const id = parseInt(str.match(/\[(\d+)\](.+)/i)![1]);
    clearHightLight();
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
    await nextTick();
    instance.$el
      .getElementsByClassName(HIGHTLIGHT)[0]
      .scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  // 启用树多选Hooks
  const [__, { insertMultiSelectedKey, clearMultiSelected, setTreeData, getMultiList }] =
    useMultiSelect({
      onSingleSelect: ({ dataRef, allowMultiSelect }) => {
        // 仅在单选情况下直接触发选择事件
        if (!allowMultiSelect) {
          emit('selectFolder', dataRef as CategoryTreeModel);
        } else {
          emit('selectNode', dataRef as QuotaItem);
        }
      },
    });
  // 树节点的选择，支持多选
  async function handleTreeSelect(_, e: treeSelectParams) {
    console.log(e.node.expanded);
    if (
      (e.node.dataRef as CategoryTreeModel).children?.every((item) => item.folder) &&
      e.node.expanded
    ) {
      try {
        await loadData(e.node.eventKey);
      } catch (error) {}
      return;
    }
    const instance = getTreeInstance(treeType.value);
    // 拿到待操作的树数据
    setTreeData(treeProps[treeType.value].treeData);
    const allowMultiSelect = !isFolder(e.node.dataRef);
    // 执行多选
    insertMultiSelectedKey({ e, allowMultiSelect });
    clearHightLight();
    const list = getMultiList();
    forEach(treeProps[treeType.value].treeData!, (item) => {
      if (list.includes(item.key as number)) {
        insertHightListNode(item);
      }
    });
    instance?.setSelectedKeys(list);
  }
  function copy(str: string) {
    const { isSuccessRef } = useCopyToClipboard(str);
    if (isSuccessRef.value) {
      createMessage.success(t('quota.actionsRes.copyOK'));
    } else {
      createMessage.success(t('quota.actionsRes.copyFailed'));
    }
  }
  function beforeRightClick({
    dataRef,
  }: {
    dataRef: QuotaItem | CategoryTreeModel;
  }): ContextMenuItem[] {
    const list = getMultiList();
    if (!list.includes(dataRef.id)) {
      clearMultiSelected();
      clearHightLight();
    }
    const commonActions: ContextMenuItem[] = [
      {
        label: t('quota.actions.copyID'),
        icon: '',
        handler: () => {
          copy(dataRef.id.toString());
        },
      },
      {
        label: t('quota.actions.copyName'),
        icon: '',
        handler: () => copy(dataRef.name),
      },
    ];
    const _isFolder = isFolder(dataRef);
    if (_isFolder) {
      return [...commonActions];
    } else {
      return [
        ...commonActions,
        {
          label: t('quota.actions.multiSelectQuota'),
          icon: '',
          handler: () => {
            console.log(highLightList);
            highLightList.forEach((node) => {
              emit('selectNode', node as QuotaItem);
            });
            clearHightLight();
            getTreeInstance(treeType.value)?.setSelectedKeys([]);
          },
        },
        {
          label: t('quota.actions.multiUpdateQuota'),
          icon: '',
          handler: async () => {
            try {
              // @ts-ignore
              const { msg } = await requestUpdateQuotaData({
                categoryId: (dataRef as QuotaItem).categoryId!,
                indexIdList: list,
              });
              createMessage.success(msg);
            } catch (error) {
              createMessage.error(error);
            } finally {
              clearHightLight();
              getTreeInstance(treeType.value)?.setSelectedKeys([]);
            }
          },
        },
      ];
    }
  }
  function dragStart({ node }: { node: TreeItem }) {
    // 移动非高亮项目则重置高亮数组
    if (!highLightList.some((item) => item.key === node.dataRef.id)) {
      clearHightLight();
      forEach(treeProps[treeType.value].treeData!, (item) => {
        if (item.key === node.dataRef.id) {
          insertHightListNode(item);
        }
      });
    }
  }
  async function drop({ event, node }: { event: DragEvent; node: TreeItem }) {
    // 移动指标
    if (highLightList.every((item) => !item.folder)) {
      if (node.dataRef.folder) {
        // 更换所在目录
        const indexIdList = highLightList.map((item) => item.id);
        await moveQuota({ categoryId: node.dataRef.id, indexIdList });
      } else {
        // 重新排序
        const { top, bottom } = (event.toElement as HTMLElement).getBoundingClientRect();
        // 落点是否在在目标之前
        const before = event.pageY < (bottom + top) / 2;
        const { parentNode } = findParentNode(node.dataRef.categoryId);
        const indexList: number[] = parentNode.children!.map((q) => q.id);
        const idx = indexList!.findIndex((idx) => idx === node.dataRef.id);
        indexList?.splice(before ? idx : idx + 1, 0, ...highLightList.map((q) => q.id));
        await sortQuota({
          categorySortingList: indexList.map((id, sorting) => ({ id, sorting: sorting + 1 })),
          type: treeType.value,
        });
      }
    } else {
      // 移动目录
      if (!node.dataRef.folder) return;
      const { parentNode } = findParentNode(node.dataRef.id);
      await updateCategory({
        id: highLightList[0].id,
        name: highLightList[0].name,
        parentId: parentNode.id,
        parentName: parentNode.name,
      });
    }
    getData();
  }
  onMounted(() => {
    getData(CategoryTreeType.sysQuota);
    getData(CategoryTreeType.userQuota);
  });
</script>

<style lang="less" scoped>
  ::v-deep(.ant-tabs .ant-tabs-top-content) {
    height: calc(100% - 66px);

    .ant-tabs-tabpane {
      overflow-y: scroll;
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
    top: 90px;
    right: 16px;
    font-size: 20px !important;
    z-index: 9;
  }

  ::v-deep(.ant-input-affix-wrapper) {
    border: none !important;

    &-focused {
      box-shadow: none !important;
      border: none !important;
    }
  }

  .tail {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 10%;
      background-image: linear-gradient(
        fade(@white, 5%),
        fade(@white, 30%),
        fade(@white, 50%),
        fade(@white, 70%),
        fade(@white, 90%),
        fade(@white, 100%),
        @white
      );
      pointer-events: none;
    }
  }
</style>
