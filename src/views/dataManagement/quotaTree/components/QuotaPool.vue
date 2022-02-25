<template>
  <div class="flex-grow w-0 h-full p-4 bg-white shadow-md" ref="loadingRef">
    <div class="flex flex-wrap gap-2 pb-2 border-b border-gray-300 toolbar pt-2px">
      <Button size="small" @click="checkAll">
        <template #icon>
          <Icon icon="ant-design:check-outlined" />
        </template>
        <span>{{ t('quotaView.quotaList.checkAll') }}</span>
      </Button>
      <Button size="small" @click="clear" :disabled="!allowDel" class="delete-shake">
        <template #icon>
          <Icon icon="ant-design:stop-outlined" />
        </template>
        <span>{{ t('quotaView.quotaList.delChecked') }}</span>
      </Button>
      <Button size="small" @click="del" :disabled="!allowDel">
        <template #icon>
          <Icon icon="ant-design:delete-outlined" />
        </template>
        <span>{{ t('quotaView.management.delete') }}</span>
      </Button>
      <Button size="small" @click="updateQuota" :disabled="!allowDel">
        <template #icon>
          <Icon icon="ant-design:sync-outlined" />
        </template>
        <span>{{ t('quotaView.quotaList.updateQuota') }}</span>
      </Button>
      <Button size="small" @click="clearData" :disabled="!allowDel">
        <template #icon>
          <Icon icon="ant-design:clear-outlined" />
        </template>
        <span>{{ t('quotaView.management.clearData.btn') }}</span>
      </Button>
      <Button size="small" :disabled="!allowCalcData" @click="calcData">
        <template #icon>
          <Icon icon="ant-design:calculator-outlined" />
        </template>
        <span>{{ t('quotaView.management.calcData.btn') }}</span>
      </Button>
      <Popover placement="bottom" trigger="click">
        <Button size="small" @click="moveQuotaTo" :disabled="!allowDel">
          <template #icon>
            <Icon icon="ant-design:folder-outlined" />
          </template>
          <span>{{ t('quotaView.management.move.btn') }}</span>
        </Button>
        <template #content>
          <div>
            <TreeSelect
              class="w-90"
              v-model:value="treeProps.val"
              :treeData="treeProps.treeData"
              :replaceFields="{ title: 'name', value: 'id' }"
              optionLabelProp="label"
            />
            <Button
              :disabled="treeProps.val === 0"
              type="primary"
              class="ml-1"
              @click="handleMoveQuota"
              >{{ t('common.okText') }}</Button
            >
          </div>
        </template>
      </Popover>
      <Button size="small" @click="search">
        <template #icon>
          <Icon icon="ant-design:search-outlined" />
        </template>
        <span>{{ t('quotaView.management.search.btn') }}</span>
      </Button>
    </div>
    <!-- 列表start -->
    <transition-group
      tag="div"
      name="quota-list"
      class="relative pt-4 overflow-x-scroll rounded-md list-box"
      ref="quotaBox"
    >
      <!-- 一个卡片 -->
      <div
        @click="handleSelected(item)"
        class="flex items-center mb-1 magictime spaceInDown sortable quota-list-item"
        v-for="(item, index) in selectedQuota"
        :key="item.id"
        :data-quotaId="item.id"
      >
        <div
          :class="[
            item.selected ? 'bg-primary' : 'bg-gray-500',
            'list-theme flex-grow justify-between items-center py-2 text-xs rounded-sm flex',
          ]"
        >
          <span class="flex items-center gap-1">
            <Icon
              icon="akar-icons:drag-horizontal"
              color="#5eead4"
              class="cursor-move drag-handler"
            />
            <span
              class="text-white cursor-pointer select-none"
              @click.stop
              @dblclick="copy(item.id.toString(), 'id')"
              >{{ item.id }}</span
            >
          </span>

          <span class="text-center text-gray-200 w-3em">{{ index + 1 }}</span>
          <span class="flex flex-col">
            <!-- 全称 -->

            <span class="text-lg text-white truncate w-50 min-w-50">
              <Tooltip destroyTooltipOnHide>
                <template #title>{{ item.name }}</template>
                <span class="w-fit" @click.stop @dblclick="copy(item.name, 'name')">{{
                  item.name
                }}</span>
              </Tooltip>
            </span>
            <!-- sourceCode -->
            <span
              class="w-40 max-w-full overflow-x-hidden text-xs text-gray-300 truncate overflow-ellipsis min-w-30"
            >
              <Tooltip>
                <template #title>{{ item.sourceCode }}</template>
                <span class="w-fit" @click.stop @dblclick="copy(item.sourceCode, 'sourceCode')">{{
                  item.sourceCode
                }}</span>
              </Tooltip>
            </span>
          </span>

          <!-- 单位和来源 -->
          <span class="flex justify-between text-white">
            <span class="w-20 text-center" @click.stop>{{ item.unit ?? '暂无单位' }}</span>
          </span>
          <span class="flex flex-col">
            <span class="text-xs text-gray-300 whitespace-nowrap">来自于</span>
            <span class="text-gray-100 w-fit whitespace-nowrap" @click.stop>
              {{ typeFomatter(item.sourceType) }}
            </span>
          </span>
          <span class="flex flex-col">
            <span class="text-xs text-gray-300">更新于</span>
            <span class="text-gray-100 min-w-34 w-34">{{ item.timeLastUpdate ?? '暂未更新' }}</span>
          </span>
          <span class="flex flex-col">
            <span class="text-xs text-gray-300">最新数据</span>
            <span class="text-gray-100 whitespace-nowrap min-w-26 w-26" @click.stop>{{
              `${dateFomatter(item)} ${item.frequency ? `${item.frequency}更` : ''}`
            }}</span>
          </span>
          <span class="flex justify-between text-primary-100 children:w-fit">
            <Tooltip destroyTooltipOnHide>
              <template #title>
                <span class="text-xs">{{ t('quotaView.management.edit') }}</span>
              </template>
              <Icon
                @click.stop="handleIcon(item, 'edit')"
                class="mr-2 cursor-pointer"
                icon="ant-design:edit-outlined"
              />
            </Tooltip>
            <Tooltip destroyTooltipOnHide>
              <template #title>
                <span class="text-xs">{{ t('quotaView.management.update') }}</span>
              </template>
              <Icon
                @click.stop="handleIcon(item, 'update')"
                class="mr-2 cursor-pointer"
                icon="ant-design:sync-outlined"
              />
            </Tooltip>
            <Tooltip destroyTooltipOnHide>
              <template #title>
                <span class="text-xs">{{ t('quotaView.management.clearData.btn') }}</span>
              </template>
              <Icon
                @click.stop="handleIcon(item, 'clearData')"
                class="mr-2 cursor-pointer"
                icon="ant-design:clear-outlined"
              />
            </Tooltip>
            <Tooltip destroyTooltipOnHide>
              <template #title>
                <span class="text-xs">{{ t('quotaView.management.delete') }}</span>
              </template>
              <Icon
                @click.stop="handleIcon(item, 'del')"
                class="!text-red-400 cursor-pointer"
                icon="ant-design:delete-outlined"
              />
            </Tooltip>
          </span>
        </div>
        <div
          :class="[
            item.selected ? 'bg-primary' : 'bg-gray-500',
            'px-1 ml-1 flex items-center rounded-sm',
          ]"
          :style="{ height: itemHeight }"
        >
          <Tooltip destroyTooltipOnHide>
            <template #title>
              <span class="text-xs">{{ t('quotaView.management.remove') }}</span>
            </template>
            <Icon
              @click="handleIcon(item, 'remove')"
              class="cursor-pointer !text-2xl !text-gray-300"
              icon="ant-design:stop-outlined"
            />
          </Tooltip>
        </div>
      </div>
    </transition-group>
    <AdvanceSearch @register="avanceSearchModal" @pushQuota="pushQuota" />
    <ClearModal @register="clearModal" />
    <QuotaEditor @register="registerQuotaEditor" />
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, ref, reactive, unref, watch, computed, h } from 'vue';
  import type { QuotaItem } from '/#/quota';
  import { Button, Tooltip, Modal, Popover, TreeSelect, Input } from 'ant-design-vue';
  import { typeFomatter } from '/@/utils/helper/commonHelper';
  import { remove, cloneDeep } from 'lodash-es';
  import { useLoading } from '/@/components/Loading';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useSortable } from '/@/hooks/web/useSortable';
  import { isNullAndUnDef } from '/@/utils/is';
  import { emitter } from '/@/components/QuotaTree/hooks';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useQuotaListContext } from '../hooks';
  import type { SelectedQuotaItem } from '../hooks';
  import { AdvanceSearch } from '/@/components/QuotaTree';
  import ClearModal from './ClearModal.vue';
  import QuotaEditor from '/@/components/QuotaEditor/src/QuotaEditor.vue';
  import { domForeach } from '/@/utils/domUtils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatToDate, today } from '/@/utils/dateUtil';
  import {
    delQuota,
    delQuotaData,
    getQuotaInfo,
    moveQuota,
    requestUpdateQuotaData,
  } from '/@/api/quota';
  import { SourceTypeEnum } from '/@/enums/quotaEnum';
  import { useModal } from '/@/components/Modal';
  import { useQuotaTreeStore } from '/@/store/modules/quotaTree';
  import { filter } from '/@/utils/helper/treeHelper';
  import { useResizeObserver } from '@vueuse/core';

  // let animationFlag = false;
  // 交付给绘图的指标列表
  const selectedQuota = useQuotaListContext();
  // 所有从树中选中的指标
  const quotaList = ref<SelectedQuotaItem[]>([]);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [avanceSearchModal, { openModal: openAvanceSearchModal }] = useModal();
  const [clearModal, { openModal: openClearModal, setModalProps: setClearModalProps }] = useModal();
  const [registerQuotaEditor, { openModal: openQuotaEditor, setModalProps: setQuotaEditorProps }] =
    useModal();
  const loadingRef = ref();

  function handleSelected(item: SelectedQuotaItem) {
    item.selected = !item.selected;
  }
  // 全选/取消全选
  function checkAll() {
    const b = selectedQuota.value.every((q) => q.selected);
    selectedQuota.value.forEach((q) => {
      q.selected = !b;
    });
  }
  const loading = ref(false);
  const treeProps = reactive({
    treeData: [],
    val: undefined,
  });
  // 更新选中指标
  async function updateQuota() {
    const obj = {};
    // 按目录分组
    selectedQuota.value.forEach((quota) => {
      if (quota.selected && !!quota.id) {
        if (Reflect.has(obj, quota.categoryId!)) {
          obj[quota.categoryId!].push(quota.id);
        } else {
          obj[quota.categoryId!] = [quota.id];
        }
      }
    });
    loading.value = true;
    openLoading();
    const arr: Promise<any>[] = [];
    for (let key in obj) {
      arr.push(requestUpdateQuotaData({ categoryId: parseInt(key), indexIdList: obj[key] }));
    }
    try {
      // 并发分组更新请求
      const res = await Promise.allSettled(arr);
      createMessage.success(res[0].value.msg);
      closeLoading();
    } catch (error) {
      createMessage.error(error);
    } finally {
      loading.value = false;
      closeLoading();
    }
    updateQuotaInfo();
  }
  async function updateQuotaInfo(quota?: QuotaItem) {
    if (quota) {
      try {
        const res = await getQuotaInfo({ indexId: quota.id });
        const q = selectedQuota.value.find((q) => q.id === quota.id)!;
        Object.assign(q, res);
      } catch (error) {
      } finally {
      }
      return;
    }
    const ql = cloneDeep(quotaList.value);
    try {
      for (let index = 0; index < ql.length; index++) {
        const q = ql[index];
        const res = await getQuotaInfo({ indexId: q.id });
        const quota = selectedQuota.value.find((quota) => quota.id === q.id)!;
        Object.assign(quota, res);
      }
      emitter.emit('updateTree');
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }
  // 监听数组，新加入的指标默认被选中
  watch(
    selectedQuota,
    (cur) => {
      quotaList.value = cur.filter((item) => item.selected);
      console.log(document.getElementsByClassName('list-theme')[0]);
      nextTick(() => {
        itemHeight.value = document.getElementsByClassName('list-theme')[0]?.clientHeight + 'px';
      });
    },
    {
      deep: true,
    },
  );
  const itemHeight = ref('');
  function dateFomatter(quota: QuotaItem) {
    if (quota.dateLast === null) return t('common.noData');
    return formatToDate(quota.dateLast);
  }
  function clear() {
    remove(selectedQuota.value, (quota) => quota.selected === true);
    createMessage.success(t('quotaView.quotaCard.alldel'));
  }
  const allowDel = computed(() => {
    return quotaList.value.length > 0;
  });
  function del() {
    Modal.confirm({
      title: t('quotaView.management.deleteConfirmTip'),
      onOk: async () => {
        const pl: any[] = [];
        const ql = cloneDeep(quotaList.value);
        for (let index = 0; index < ql.length; index++) {
          const q = ql[index];
          pl.push(
            delQuota({
              indexId: q.id,
            }),
          );
        }
        try {
          await Promise.allSettled(pl);
          createMessage.success('删除成功');
          remove(selectedQuota.value, (q) => ql.some((_q) => _q.id === q.id));
          emitter.emit('updateTree');
        } catch (error) {
          createMessage.error(error);
        }
      },
    });
  }
  function search() {
    openAvanceSearchModal(true);
  }
  function pushQuota(list: QuotaItem[]) {
    list.forEach((item) => {
      const hasQuota = selectedQuota.value.some((q) => q.id === item.id);
      if (!hasQuota) {
        selectedQuota.value.push(item);
      }
    });
  }
  function handleIcon(item: QuotaItem, type: string) {
    const handler = {
      remove: () => {
        remove(selectedQuota.value, (quota) => quota.id === item.id);
      },
      edit: () => {
        setQuotaEditorProps({
          afterClose: async () => {
            updateQuotaInfo(item);
            // emitter.emit('updateTree');
          },
        });
        openQuotaEditor(true, item);
      },
      del: () => {
        const targetID = ref('');
        const disabled = computed(() => {
          return targetID.value !== item.id.toString();
        });
        Modal.confirm({
          title: t('quotaView.management.deleteConfirmTip'),
          content: h(
            'div',
            {
              className: 'flex items-center flex-col',
            },
            [
              h('span', {}, t('quotaView.management.deleteInputId')),
              h(Input, {
                onInput: (e) => {
                  targetID.value = e.target.value;
                },
              }),
            ],
          ),
          okType: 'danger',
          okText: t('quotaView.management.confirmDel'),
          okButtonProps: {
            disabled: disabled,
          },
          onOk: async () => {
            try {
              delQuota({ indexId: item.id });
              createMessage.success(t('sys.api.delOK'));
              remove(selectedQuota.value, (q) => q.id === item.id);
              emitter.emit('updateTree');
            } catch (error) {
              createMessage.error(error);
            }
          },
        });
      },
      update: async () => {
        openLoading();
        const { msg } = await requestUpdateQuotaData({
          categoryId: item.categoryId,
          indexIdList: [item.id],
        });
        createMessage.success(msg);
        closeLoading();
        updateQuotaInfo(item);
      },
      clearData: (_) => {
        openClearModal(true, cloneDeep([item]));
        setClearModalProps({
          afterClose: () => {
            updateQuotaInfo(item);
          },
        });
      },
    };
    handler[type]();
  }
  // 清除数据
  function clearData() {
    openClearModal(true, cloneDeep(quotaList.value));
    setClearModalProps({
      afterClose: () => {
        updateQuotaInfo();
      },
    });
  }
  const allowCalcData = computed(() => {
    return (
      quotaList.value.length > 0 &&
      quotaList.value.every((item) => item.sourceType === SourceTypeEnum.formula)
    );
  });
  // 重算数据
  async function calcData() {
    try {
      await delQuotaData({
        indexList: quotaList.value.map((q) => q.id).join(','),
        startDate: '2000-01-01',
        endDate: today(),
      });
      await updateQuota();
    } catch (error) {
      createMessage.error(error);
    }
  }
  const store = useQuotaTreeStore();
  // 批量移动
  function moveQuotaTo() {
    treeProps.treeData = filter(
      [...store.geteSysQuotaTree, ...store.geteUserQuotaTree],
      (node) => node.folder,
    );
  }
  async function handleMoveQuota() {
    const res = await moveQuota({
      categoryId: treeProps.val,
      indexIdList: quotaList.value.map((q) => q.id),
    });
    createMessage.success(res);
    updateQuotaInfo();
  }
  function copy(text: string, type) {
    const textType = {
      name: t('quotaView.quotaCard.name'),
      id: t('quotaView.quotaCard.id'),
      sourceCode: t('quotaView.quotaCard.sourceCode'),
      shortName: t('quotaView.quotaCard.shortName'),
    };
    const { isSuccessRef } = useCopyToClipboard(text);
    unref(isSuccessRef) && createMessage.success(`${textType[type]}已复制到剪贴板`);
  }
  const quotaBox = ref<ComponentRef>();
  const [openLoading, closeLoading] = useLoading({
    props: {
      tip: '处理中...',
      absolute: true,
    },
    target: loadingRef,
  });
  onMountedOrActivated(async () => {
    await nextTick();
    const boxdom: HTMLDivElement = unref(quotaBox)!.$el;
    const toolbardom: HTMLDivElement = (loadingRef.value as HTMLElement).getElementsByClassName(
      'toolbar',
    )[0];
    useResizeObserver(toolbardom, () => {
      boxdom.style.height = `calc(100% - ${toolbardom.clientHeight}px)`;
    });
    // 支持拖动排序
    const { initSortable } = useSortable(boxdom, {
      handle: '.drag-handler',
      draggable: '.sortable',
      dataIdAttr: 'data-quotaId',
      dragoverBubble: true,
      onStart: () => {
        domForeach(boxdom.getElementsByClassName('sortable'), (element) => {
          element.classList.remove('quota-list-item', 'spaceInDown', 'magictime');
        });
      },
      // setData: (dt) => {
      //   const d = document.createElement('div');
      //   dt.setDragImage(d, 2, 2);
      // },
      onEnd: (evt) => {
        domForeach(boxdom.getElementsByClassName('sortable'), (element) => {
          element.classList.add('quota-list-item');
        });
        const { oldIndex, newIndex } = evt;
        if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
          return;
        }
        // Sort column
        const columns = selectedQuota.value;
        if (oldIndex > newIndex) {
          columns.splice(newIndex, 0, columns[oldIndex]);
          columns.splice(oldIndex + 1, 1);
        } else {
          columns.splice(newIndex + 1, 0, columns[oldIndex]);
          columns.splice(oldIndex, 1);
        }
      },
    });
    initSortable();
  });
</script>

<style lang="less" scoped>
  .quota-list-move {
    transition: transform 0.5s ease;
  }

  .quota-list-item {
    transition-property: transform, background-color;
    transition-duration: 0.5s;
    transition-timing-function: ease;
  }

  .quota-list-leave-active {
    transition: 0.8s ease;
    transition-property: opacity, transform;
    position: absolute !important;
  }

  .quota-list-leave-to {
    opacity: 0%;
    transform: translateX(-100px);
  }

  .quota-list-leave-from {
    opacity: 100%;
    transform: translateX(0);
  }

  .list-theme {
    @apply w-auto gap-4 px-3 text-sm;

    .drag-handler {
      @apply items-center;
    }

    .quota-unit-sourceType {
      .unit,
      .sourceType {
        @apply w-20 text-center truncate;
      }
    }
  }
</style>
