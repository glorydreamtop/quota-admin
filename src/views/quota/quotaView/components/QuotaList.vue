<template>
  <div class="relative flex h-48 p-4 bg-white shadow-md min-h-48">
    <div
      class="flex flex-wrap w-auto gap-2 pr-2 border-r border-gray-300 write-vertical-left pt-2px"
    >
      <Tooltip placement="left">
        <template #title>{{ t('quotaView.quotaList.formula') }}</template>
        <Button size="small" @click="addFormula">
          <template #icon>
            <Icon icon="carbon:function-math" size="20" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip placement="left">
        <template #title>{{ t('quotaView.quotaList.delChecked') }}</template>
        <Button size="small" @click="clear" data-type="delete" class="delete-shake">
          <template #icon>
            <Icon icon="ant-design:delete-outlined" size="20" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip placement="left">
        <template #title>{{ t('quotaView.quotaList.checkAll') }}</template>
        <Button size="small" @click="checkAll">
          <template #icon>
            <Icon icon="ant-design:check-outlined" size="20" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip placement="left">
        <template #title>{{
          cardUI ? t('quotaView.quotaList.listUI') : t('quotaView.quotaList.cardUI')
        }}</template>
        <Button size="small" @click="changeUI">
          <template #icon>
            <Icon icon="ant-design:swap-outlined" size="20" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip placement="left">
        <template #title>{{ t('quotaView.quotaList.updateQuota') }}</template>
        <Button size="small" @click="updateQuota">
          <template #icon>
            <Icon icon="ant-design:sync-outlined" size="20" />
          </template>
        </Button>
      </Tooltip>
    </div>
    <!-- 列表start -->
    <transition-group
      tag="div"
      name="quota-list"
      :class="[
        'rounded-md overflow-y-scroll flex-grow relative pl-4',
        cardUI ? 'flex gap-4 flex-wrap content-start' : 'w-0',
      ]"
      ref="quotaBox"
    >
      <!-- 一个卡片 -->
      <div
        @click="handleSelected(item)"
        @contextmenu="handleContext($event, item)"
        v-ripple
        v-loading="loading"
        :class="[
          item.selected ? 'bg-linear-primary' : 'bg-notselected',
          cardUI ? 'card-theme' : 'list-theme',
          'text-xs rounded-sm flex sortable quota-list-item',
        ]"
        v-for="(item, index) in selectedQuota"
        :key="item.id"
        :data-quotaId="item.id"
      >
        <span :class="['flex items-center gap-1', cardUI ? 'mb-1' : '']">
          <Icon
            icon="akar-icons:drag-horizontal"
            color="#5eead4"
            class="cursor-move drag-handler"
          />
          <span
            class="text-purple-300 w-4em text-center cursor-pointer select-none"
            @click.stop
            @dblclick="copy(item.id.toString(), 'id')"
            >{{ isFormula(item) ? t('quotaView.quotaCard.formulaWithoutId') : item.id }}</span
          >
        </span>

        <span v-show="!cardUI" class="text-gray-200 text-center">{{
          `${index + 1}`.padStart(2, '0')
        }}</span>

        <!-- 全称 -->
        <Tooltip :placement="cardUI ? 'bottomLeft' : 'top'">
          <template #title>{{ item.name }}</template>
          <span class="text-white cursor-default select-none quota-title"
            ><span class="w-fit" @click.stop @dblclick="copy(item.name, 'name')">{{
              item.name
            }}</span></span
          >
        </Tooltip>
        <!-- sourceCode -->
        <span
          class="max-w-full overflow-x-hidden text-white cursor-default cursor-pointer select-none overflow-ellipsis quota-sourceCode"
          ><span class="w-fit" @click.stop @dblclick="copy(item.sourceCode, 'sourceCode')">{{
            item.sourceCode
          }}</span></span
        >
        <!-- 单位和来源 -->
        <span class="flex justify-between text-purple-100 quota-unit-sourceType">
          <span class="unit" @click.stop>{{ item.unit }}</span>
          <span class="sourceType" @click.stop>{{ typeFomatter(item.sourceType) }}</span>
        </span>
        <span class="flex justify-between text-purple-100 children:w-fit">
          <Tooltip>
            <template #title>
              <span class="text-xs">{{
                !isFormula(item)
                  ? `${t('quotaView.quotaCard.updateOn')}${item.timeLastUpdate}`
                  : t('quotaView.quotaCard.formulaTip')
              }}</span>
            </template>
            <span class="w-fit whitespace-nowrap" @click.stop>{{
              `${dateFomatter(item)} ${item.frequency ? `${item.frequency}更` : ''}`
            }}</span>
          </Tooltip>
          <span class="del-icon">
            <Icon
              @click="handleIcon(item, 'del')"
              class="mr-1 cursor-pointer"
              icon="ant-design:delete-outlined"
            />
          </span>
        </span>
      </div>
    </transition-group>

    <QuotaSetting @register="registerEdit" />
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, ref, unref } from 'vue';
  import type { QuotaItem } from '/#/quota';
  import { Button, Tooltip } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { useWatchArray, typeFomatter } from '/@/utils/helper/commonHelper';
  import { cloneDeep, remove } from 'lodash-es';
  import { Icon } from '/@/components/Icon';
  // import QuotaModal from '/@/views/dataManagement/quotaTree/components/QuotaModal.vue';
  // import Edit from './SeriesEdit.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useSortable } from '/@/hooks/web/useSortable';
  import { isNullAndUnDef } from '/@/utils/is';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import vRipple from '/@/directives/ripple';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  // import { usePointerSlideIn } from '/@/hooks/web/useAnimation';
  import { useQuotaListContext, useSelectedQuotaListContext } from './hooks';
  import type { SelectedQuotaItem } from './hooks';
  import { domForeach } from '/@/utils/domUtils';
  import QuotaSetting from './QuotaSetting.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatToDate } from '/@/utils/dateUtil';
  import { requestUpdateQuotaData } from '/@/api/quota';
  import { SourceTypeEnum } from '/@/enums/quotaEnum';

  // let animationFlag = false;
  // 交付给绘图的指标列表
  const quotaList = useQuotaListContext();
  // 所有从树中选中的指标
  const selectedQuota = useSelectedQuotaListContext();
  const { createMessage } = useMessage();
  const { t } = useI18n();
  function handleSelected(item: SelectedQuotaItem) {
    item.selected = !item.selected;
  }
  const cardUI = ref(true);
  // 切换卡片or列表
  function changeUI() {
    cardUI.value = !cardUI.value;
  }
  // 全选/取消全选
  function checkAll() {
    const b = selectedQuota.value.every((q) => q.selected);
    selectedQuota.value.forEach((q) => {
      q.selected = !b;
    });
  }
  const loading = ref(false);
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
    const arr: Promise<any>[] = [];
    for (let key in obj) {
      arr.push(requestUpdateQuotaData({ categoryId: parseInt(key), indexIdList: obj[key] }));
    }
    try {
      loading.value = true;
      // 并发分组更新请求
      const res = await Promise.allSettled(arr);
      createMessage.success(res[0].value.msg);
    } catch (error) {
      createMessage.error(error);
    } finally {
      loading.value = false;
    }
  }
  // 监听数组，新加入的指标默认被选中
  useWatchArray(selectedQuota, (cur, pre) => {
    if (cur.length > pre.length) {
      for (let i = 0; i < cur.length; i++) {
        if (pre.findIndex((quota) => quota.id === cur[i].id) === -1) {
          cur[i].selected = true;
        }
      }
      // animationFlag = true;
    } else {
      // animationFlag = false;
    }
    quotaList.value = cur.filter((item) => item.selected);
  });
  function isFormula(quota: QuotaItem) {
    return /formula/i.test(quota.id.toString());
  }
  function dateFomatter(quota: QuotaItem) {
    if (isFormula(quota) && quota.sourceType === SourceTypeEnum.formula)
      return t('quotaView.quotaCard.calculate');
    if (quota.dateLast === null) return t('common.noData');
    return formatToDate(quota.dateLast);
  }

  const [registerEdit, { openModal: openEditModal, setModalProps: setEditModal }] = useModal();
  function addFormula() {
    openEditModal(true, {
      record: {},
      index: selectedQuota.value.length,
    });
    setEditModal({
      title: t('quotaView.quotaSetting.formulaModalTitle'),
      minHeight: 300,
      width: '400px',
    });
  }
  function clear() {
    remove(selectedQuota.value, (quota) => quota.selected === true);
    createMessage.success(t('quotaView.quotaCard.alldel'));
  }
  function handleIcon(item: QuotaItem, type: string) {
    const handler = {
      del: () => {
        remove(selectedQuota.value, (quota) => quota.id === item.id);
      },
    };
    handler[type]();
  }
  function copy(text: string, type: string) {
    // 临时公式没有ID
    if (type === 'id' && /formula/i.test(text)) return;
    const textType = {
      name: t('quotaView.quotaCard.name'),
      id: t('quotaView.quotaCard.id'),
      sourceCode: t('quotaView.quotaCard.sourceCode'),
      shortName: t('quotaView.quotaCard.shortName'),
    };
    const { isSuccessRef } = useCopyToClipboard(text);
    unref(isSuccessRef) && createMessage.success(`${textType[type]}已复制到剪贴板`);
  }
  const [createContextMenu] = useContextMenu();
  function handleContext(e: MouseEvent, item: SelectedQuotaItem) {
    const menuList = [
      {
        label: t('quotaView.quotaCard.contextMenu.edit'),
        icon: 'ant-design:edit-outlined',
        handler: () => {
          openEditModal(true, {
            record: item,
            index: selectedQuota.value.findIndex((_item) => item.id === _item.id),
          });
          setEditModal({
            title: t('quotaView.quotaSetting.modalTitle'),
            minHeight: 300,
          });
        },
      },
      {
        label: t('quotaView.quotaCard.contextMenu.copyShortName'),
        icon: 'ant-design:copy-outlined',
        handler: () => {
          if (item.shortName) {
            copy(item.shortName.toString(), 'shortName');
          } else {
            createMessage.warning(t('quotaView.quotaCard.contextMenu.noShortName'));
          }
        },
      },
      {
        label: t('quotaView.quotaCard.contextMenu.saveInMyFolder'),
        icon: 'ant-design:folder-add-outlined',
        handler: () => {
          // setQuotaSave({
          //   title: '添加到我的指标',
          // });
          const clone = cloneDeep(item);
          Reflect.deleteProperty(clone, 'id');
          clone.categoryIdList = [];
          // openQuotaSave(true, clone);
        },
      },
    ];
    createContextMenu({
      event: e,
      items: menuList,
    });
  }
  const quotaBox = ref<ComponentRef>();
  // 飞入动画的监听器
  // async function listener(event: MouseEvent) {
  //   const boxdom: HTMLDivElement = unref(quotaBox)!.$el;
  //   if ((event.target as HTMLElement)!.dataset.leafid === undefined || !animationFlag) return;
  //   await nextTick();
  //   animationFlag = false;
  //   // 生成飞入动画
  //   const dom = last(boxdom.getElementsByClassName('sortable'))! as HTMLElement;
  //   const [_, { setBeforeAnimate, initAnimation }] = usePointerSlideIn(dom, event);
  //   setBeforeAnimate((dom) => {
  //     dom.scrollIntoView({ behavior: 'smooth' });
  //   });
  //   initAnimation();
  // }
  onMountedOrActivated(async () => {
    await nextTick();
    const boxdom: HTMLDivElement = unref(quotaBox)!.$el;
    // 支持拖动排序
    const { initSortable } = useSortable(boxdom, {
      handle: '.drag-handler',
      draggable: '.sortable',
      dataIdAttr: 'data-quotaId',
      dragoverBubble: true,
      onStart: () => {
        domForeach(boxdom.getElementsByClassName('sortable'), (element) => {
          element.classList.remove(
            'quota-list-item',
            'animate__animated',
            'animate__zoomIn',
            'animate__fast',
          );
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
    // window.addEventListener('click', listener);
  });
  // onBeforeUnmount(() => {
  //   window.removeEventListener('click', listener);
  // });
  // onDeactivated(() => {
  //   window.removeEventListener('click', listener);
  // });
</script>

<style lang="less" scoped>
  .quota-list-move {
    transition: transform 0.5s ease;
  }

  .quota-list-item {
    transition-property: transform, background-color;
    transition-duration: 0.8s;
    transition-timing-function: ease;
  }

  .quota-list-leave-active {
    transition: 0.8s ease;
    transition-property: opacity, transform;
    position: absolute !important;
  }

  .quota-list-leave-to {
    opacity: 0%;
    transform: translateY(-100px);
  }

  .quota-list-leave-from {
    opacity: 100%;
    transform: translateY(0);
  }

  .card-theme {
    @apply w-50 flex-col pt-1 p-2 shadow-md overflow-x-hidden;

    aspect-ratio: 1.618/1;

    .quota-title {
      @apply text-lg leading-5 font-medium whitespace-nowrap;

      overflow: hidden;
      text-overflow: ellipsis;
    }

    .quota-sourceCode {
      @apply w-fit text-gray-300;
    }

    .quota-unit-sourceType {
      @apply mt-auto;

      .unit,
      .sourceType {
        @apply w-30 text-center w-fit;
      }
    }
  }

  .list-theme {
    @apply w-auto min-w-700px gap-4 p-2 text-sm mb-1;

    .drag-handler {
      @apply items-center;
    }

    .quota-title {
      @apply w-80  min-w-60 text-center truncate;
    }

    .quota-sourceCode {
      @apply w-40 min-w-30 text-center truncate;
    }

    .quota-unit-sourceType {
      .unit,
      .sourceType {
        @apply w-30 text-center;
      }
    }

    .del-icon {
      @apply ml-8;
    }
  }

  .bg-notselected {
    @apply bg-cool-gray-400;
  }
</style>
