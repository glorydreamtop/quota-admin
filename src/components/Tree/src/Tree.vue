<script lang="tsx">
  import type { ReplaceFields, Keys, CheckKeys, TreeActionType, TreeItem } from './typing';

  import {
    defineComponent,
    reactive,
    computed,
    unref,
    ref,
    watchEffect,
    toRaw,
    watch,
    onMounted,
  } from 'vue';
  import { Tree, Empty } from 'ant-design-vue';

  import { omit, get } from 'lodash-es';
  import { isFunction } from '/@/utils/is';
  import { extendSlots, getSlot } from '/@/utils/helper/tsxHelper';

  import { useTree } from './useTree';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { basicProps } from './props';
  import { CreateContextOptions } from '/@/components/ContextMenu';

  import { CheckEvent } from './typing';

  interface State {
    expandedKeys: Keys;
    selectedKeys: Keys;
    checkedKeys: CheckKeys;
    checkStrictly: boolean;
  }
  export default defineComponent({
    name: 'BasicTree',
    inheritAttrs: false,
    props: basicProps,
    emits: ['update:expandedKeys', 'update:selectedKeys', 'update:value', 'change', 'check'],
    setup(props, { attrs, slots, emit, expose }) {
      const state = reactive<State>({
        checkStrictly: props.checkStrictly,
        expandedKeys: props.expandedKeys || [],
        selectedKeys: props.selectedKeys || [],
        checkedKeys: props.checkedKeys || [],
      });

      const treeDataRef = ref<TreeItem[]>([]);

      const [createContextMenu] = useContextMenu();
      const { prefixCls } = useDesign('basic-tree');

      const getReplaceFields = computed((): Required<ReplaceFields> => {
        const { replaceFields } = props;
        return {
          children: 'children',
          title: 'title',
          key: 'key',
          ...replaceFields,
        };
      });

      const getBindValues = computed(() => {
        let propsData = {
          blockNode: true,
          ...attrs,
          ...props,
          expandedKeys: state.expandedKeys,
          selectedKeys: state.selectedKeys,
          checkedKeys: state.checkedKeys,
          checkStrictly: state.checkStrictly,
          replaceFields: unref(getReplaceFields),
          'onUpdate:expandedKeys': (v: Keys) => {
            state.expandedKeys = v;
            emit('update:expandedKeys', v);
          },
          'onUpdate:selectedKeys': (v: Keys) => {
            state.selectedKeys = v;
            emit('update:selectedKeys', v);
          },
          onCheck: (v: CheckKeys, e: CheckEvent) => {
            state.checkedKeys = v;
            const rawVal = toRaw(v);
            emit('update:value', rawVal);
            emit('check', rawVal, e);
          },
          onRightClick: handleRightClick,
        };
        return omit(propsData, 'treeData', 'class');
      });

      const getTreeData = computed((): TreeItem[] => unref(treeDataRef));

      const getNotFound = computed((): boolean => {
        return !getTreeData.value || getTreeData.value.length === 0;
      });
      const {
        deleteNodeByKey,
        insertNodeByKey,
        insertNodesByKey,
        filterByLevel,
        updateNodeByKey,
        getAllKeys,
        getEnabledKeys,
      } = useTree(treeDataRef, getReplaceFields);

      async function handleRightClick({ event, node }: Recordable) {
        const { rightMenuList: menuList = [], beforeRightClick } = props;
        let contextMenuOptions: CreateContextOptions = { event, items: [] };

        if (beforeRightClick && isFunction(beforeRightClick)) {
          let result = await beforeRightClick(node, event);
          if (Array.isArray(result)) {
            contextMenuOptions.items = result;
          } else {
            Object.assign(contextMenuOptions, result);
          }
        } else {
          contextMenuOptions.items = menuList;
        }
        if (!contextMenuOptions.items?.length) return;
        createContextMenu(contextMenuOptions);
      }

      function setExpandedKeys(keys: Keys) {
        state.expandedKeys = keys;
      }

      function getExpandedKeys() {
        return state.expandedKeys;
      }
      function setSelectedKeys(keys: Keys) {
        state.selectedKeys = keys;
      }

      function getSelectedKeys() {
        return state.selectedKeys;
      }

      function setCheckedKeys(keys: CheckKeys) {
        state.checkedKeys = keys;
      }

      function getCheckedKeys() {
        return state.checkedKeys;
      }

      function checkAll(checkAll: boolean) {
        state.checkedKeys = checkAll ? getEnabledKeys() : ([] as Keys);
      }

      function expandAll(expandAll: boolean) {
        state.expandedKeys = expandAll ? getAllKeys() : ([] as Keys);
      }

      // function onStrictlyChange(strictly: boolean) {
      //   state.checkStrictly = strictly;
      // }

      function handleClickNode(key: string, isLeaf: boolean) {
        if (!props.clickRowToExpand && isLeaf) return;
        if (!state.expandedKeys.includes(key)) {
          setExpandedKeys([...state.expandedKeys, key]);
        } else {
          const keys = [...state.expandedKeys];
          const index = keys.findIndex((item) => item === key);
          if (index !== -1) {
            keys.splice(index, 1);
          }
          setExpandedKeys(keys);
        }
      }

      watchEffect(() => {
        treeDataRef.value = props.treeData as TreeItem[];
      });

      onMounted(() => {
        const level = parseInt(props.defaultExpandLevel);
        if (level > 0) {
          state.expandedKeys = filterByLevel(level);
        } else if (props.defaultExpandAll) {
          expandAll(true);
        }
      });

      watchEffect(() => {
        state.expandedKeys = props.expandedKeys;
      });

      watchEffect(() => {
        state.selectedKeys = props.selectedKeys;
      });

      watchEffect(() => {
        state.checkedKeys = props.checkedKeys;
      });

      watch(
        () => props.value,
        () => {
          state.checkedKeys = toRaw(props.value || []);
        },
      );

      watch(
        () => state.checkedKeys,
        () => {
          const v = toRaw(state.checkedKeys);
          emit('update:value', v);
          emit('change', v);
        },
      );

      // watchEffect(() => {
      //   console.log('======================');
      //   console.log(props.value);
      //   console.log('======================');
      //   if (props.value) {
      //     state.checkedKeys = props.value;
      //   }
      // });

      watchEffect(() => {
        state.checkStrictly = props.checkStrictly;
      });

      const instance: TreeActionType = {
        setExpandedKeys,
        getExpandedKeys,
        setSelectedKeys,
        getSelectedKeys,
        setCheckedKeys,
        getCheckedKeys,
        insertNodeByKey,
        insertNodesByKey,
        deleteNodeByKey,
        updateNodeByKey,
        checkAll,
        expandAll,
        filterByLevel: (level: number) => {
          state.expandedKeys = filterByLevel(level);
        },
      };

      expose(instance);

      function renderTreeNode({ data, level }: { data: TreeItem[] | undefined; level: number }) {
        if (!data) {
          return null;
        }
        return data.map((item) => {
          const { key: keyField, children: childrenField } = unref(getReplaceFields);
          const propsData = omit(item, 'title');
          propsData.dataRef = item;
          const children = get(item, childrenField) || [];
          return (
            <Tree.TreeNode {...propsData} node={toRaw(item)} key={get(item, keyField)}>
              {{
                title: () => (
                  <span
                    class={`${prefixCls}-title`}
                    onClick={handleClickNode.bind(null, item[keyField], item.isLeaf)}
                  >
                    {getSlot(slots, item.slots?.title, item)}
                  </span>
                ),
                default: () => renderTreeNode({ data: children, level: level + 1 }),
              }}
            </Tree.TreeNode>
          );
        });
      }
      return () => {
        return (
          <div class={[prefixCls, attrs.class]}>
            <Tree {...unref(getBindValues)} showIcon={false} v-show={!unref(getNotFound)}>
              {{
                // switcherIcon: () => <DownOutlined />,
                default: () => renderTreeNode({ data: unref(getTreeData), level: 1 }),
                ...extendSlots(slots),
              }}
            </Tree>
            <div v-show={unref(getNotFound)} class="pt-8">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-tree';

  .@{prefix-cls} {
    background-color: @component-background;

    .ant-tree-node-content-wrapper {
      position: relative;

      &:hover {
        border-radius: 2px;
      }

      .ant-tree-title {
        // position: absolute;
        // left: 0;
        // width: 100%;
      }
    }

    &-title {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;

      &:hover {
        .@{prefix-cls}__actions {
          background-color: @white;
        }

        .@{prefix-cls}__action {
          visibility: visible;
        }
      }
    }

    &__content {
      overflow: hidden;
      user-select: none;
    }

    &__actions {
      position: absolute;
      // top: 2px;
      right: 0;
      padding-right: 8px;
      display: flex;
    }

    &__action {
      margin-left: 4px;
      visibility: hidden;
    }
  }
</style>
