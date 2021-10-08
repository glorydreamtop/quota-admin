<template>
  <div class="h-1/3 bg-white p-4 flex relative min-h-56">
    <div class="pr-2 border-r border-gray-300 mr-2 flex flex-col gap-2 w-10">
      <Tooltip placement="left">
        <template #title>添加公式</template>
        <Button @click="addFormula">
          <template #icon>
            <Icon icon="carbon:function-math" size="24" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip placement="left">
        <template #title>删除选中</template>
        <Button @click="clear" ref="rubbish" data-type="delete">
          <template #icon>
            <Icon icon="ant-design:delete-outlined" size="24" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip placement="left">
        <template #title>全选/取消全选</template>
        <Button @click="checkAll">
          <template #icon>
            <Icon icon="ant-design:check-outlined" size="24" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip placement="left">
        <template #title>{{ `切换到${cardUI ? '列表' : '卡片'}视角` }}</template>
        <Button @click="changeUI">
          <template #icon>
            <Icon icon="ant-design:swap-outlined" size="24" />
          </template>
        </Button>
      </Tooltip>
      <Tooltip placement="left">
        <template #title>双击标题或代码可直接复制到剪贴板</template>
        <Button>
          <template #icon>
            <Icon icon="ant-design:question-outlined" size="24" />
          </template>
        </Button>
      </Tooltip>
    </div>
    <!-- 列表start -->
    <transition-group
      tag="div"
      name="quota-list"
      :class="[
        'rounded-md overflow-y-scroll flex-grow relative',
        cardUI ? 'flex gap-4 flex-wrap content-start' : 'w-0',
      ]"
      ref="quotaBox"
    >
      <!-- 一个卡片 -->
      <div
        @click="handleSelected(item)"
        @contextmenu="handleContext($event, item)"
        v-ripple
        :class="[
          item.selected ? 'bg-primary' : 'bg-gray-500',
          cardUI ? 'card-theme' : 'list-theme',
          'text-xs rounded-md flex sortable quota-list-item',
        ]"
        v-for="(item, index) in selectedQuota"
        :key="item.id"
        :data-quotaId="item.id"
      >
        <Icon icon="akar-icons:drag-horizontal" color="#5eead4" class="drag-handler cursor-move" />
        <span v-show="!cardUI" class="text-gray-200">{{ index + 1 }}</span>
        <!-- 全称 -->
        <Tooltip :placement="cardUI ? 'bottomLeft' : 'top'">
          <template #title>{{ item.name }}</template>
          <span class="cursor-default select-none text-white quota-title"
            ><span class="w-fit" @click.stop @dblclick="copy(item.name, 'name')">{{
              item.name
            }}</span></span
          >
        </Tooltip>
        <!-- sourceCode -->
        <span class="text-white cursor-pointer cursor-default select-none quota-sourceCode"
          ><span class="w-fit" @click.stop @dblclick="copy(item.sourceCode, 'sourceCode')">{{
            item.sourceCode
          }}</span></span
        >
        <!-- 单位和来源 -->
        <span class="flex justify-between text-teal-300 quota-unit-sourceType">
          <span class="unit">{{ item.unit }}</span>
          <span class="sourceType">{{ typeFomatter(item.sourceType) }}</span>
        </span>
        <span class="flex justify-between text-teal-300 children:w-fit">
          <span class="whitespace-nowrap w-32">{{
            `${dateFomatter(item.dateLast)} ${item.frequency ? `${item.frequency}更` : ''}`
          }}</span>
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
    <ArrowsAltOutlined
      class="absolute scale z-9 cursor-n-resize"
      :rotate="135"
      :style="{ fontSize: '18px' }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onBeforeUnmount, onDeactivated, ref, unref } from 'vue';
  import { ArrowsAltOutlined } from '@ant-design/icons-vue';
  import type { QuotaItem } from '/#/quota';
  import { Button, Tooltip } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import moment from 'moment';
  import { useWatchArray, typeFomatter } from '/@/utils/helper/commonHelper';
  import { cloneDeep, last, remove } from 'lodash-es';
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
  import { usePointerSlideIn, useDropRemove } from '/@/hooks/web/useAnimation';
  import { useQuotaListContext, useSelectedQuotaListContext } from './hooks';
  import type { SelectedQuotaItem } from './hooks';
  import { domForeach } from '/@/utils/domUtils';
  import QuotaSetting from './QuotaSetting.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getNormalQuotaDefaultSetting } from '../helper';

  let animationFlag = false;
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
  function changeUI() {
    cardUI.value = !cardUI.value;
  }
  function checkAll() {
    const b = selectedQuota.value.every((q) => q.selected);
    selectedQuota.value.forEach((q) => {
      q.selected = !b;
    });
  }
  // 监听数组，新加入的指标默认被选中
  useWatchArray(selectedQuota, (cur, pre) => {
    if (cur.length > pre.length) {
      for (let i = 0; i < cur.length; i++) {
        if (pre.findIndex((quota) => quota.id === cur[i].id) === -1) {
          cur[i].selected = true;
          cur[i].setting = getNormalQuotaDefaultSetting();
        }
      }
      animationFlag = true;
    } else {
      animationFlag = false;
    }
    quotaList.value = cur.filter((item) => item.selected);
  });
  function dateFomatter(str: string) {
    if (str === null) return '暂无数据';
    return moment(str).format('YYYY/MM/DD');
  }

  const [registerEdit, { openModal: openEditModal, setModalProps: setEditModal }] = useModal();

  function addFormula() {
    openEditModal(true, {});
    setEditModal({
      title: '公式编辑',
      minHeight: 300,
      width: '50%',
    });
  }
  function clear() {
    remove(selectedQuota.value, (quota) => quota.selected === true);
    createMessage.success('都扔掉了');
  }
  function handleIcon(item: QuotaItem, type: string) {
    const handler = {
      del: () => {
        remove(selectedQuota.value, (quota) => quota.id === item.id);
      },
    };
    handler[type]();
  }
  function copy(text: string, type) {
    const textType = {
      name: '指标全称',
      id: '指标ID',
      sourceCode: '指标代码',
      shortName: '指标简称',
    };
    const { isSuccessRef } = useCopyToClipboard(text);
    unref(isSuccessRef) && createMessage.success(`${textType[type]}已复制到剪贴板`);
  }
  const [createContextMenu] = useContextMenu();
  function handleContext(e: MouseEvent, item: SelectedQuotaItem) {
    createContextMenu({
      event: e,
      items: [
        {
          label: '编辑指标',
          icon: 'ant-design:edit-outlined',
          handler: () => {
            openEditModal(true, {
              record: item,
              index: selectedQuota.value.findIndex((_item) => item.id === _item.id),
            });
            setEditModal({
              title: t('page.quotaView.quotaSetting.modalTitle'),
              minHeight: 300,
            });
          },
        },
        {
          label: '拷贝指标ID',
          icon: 'ant-design:copy-outlined',
          handler: () => {
            copy(item.id.toString(), 'id');
          },
        },
        {
          label: '拷贝指标简称',
          icon: 'ant-design:copy-outlined',
          handler: () => {
            if (item.shortName) {
              copy(item.shortName.toString(), 'shortName');
            } else {
              createMessage.warning('该指标没有录入简称');
            }
          },
        },
        {
          label: '保存到个人',
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
      ],
    });
  }
  const quotaBox = ref<ComponentRef>();
  const rubbish = ref();
  // 飞入动画的监听器
  async function listener(event: MouseEvent) {
    const boxdom: HTMLDivElement = unref(quotaBox)!.$el;
    if ((event.target as HTMLElement)!.dataset.leafid === undefined || !animationFlag) return;
    await nextTick();
    animationFlag = false;
    // 生成飞入动画
    const dom = last(boxdom.getElementsByClassName('sortable'))! as HTMLElement;
    const [_, { setBeforeAnimate, initAnimation }] = usePointerSlideIn(dom, event);
    setBeforeAnimate((dom) => {
      dom.scrollIntoView({ behavior: 'smooth' });
    });
    initAnimation();
  }

  onMountedOrActivated(async () => {
    await nextTick();
    const boxdom: HTMLDivElement = unref(quotaBox)!.$el;
    const rubbishdom: HTMLDivElement = unref(rubbish)!.$el;
    const { setDragStart, setRemoveFn, initDropRemove } = useDropRemove(boxdom, rubbishdom);
    setDragStart(() => {
      instance.doms = instance.toArray();
    });

    setRemoveFn((event) => {
      remove(quotaList.value, (item) => {
        return item.id === parseInt(event.target.dataset.quotaid);
      });

      instance.sort(instance.doms);
    });
    initDropRemove();
    // 支持拖动排序
    const { initSortable } = useSortable(boxdom, {
      handle: '.drag-handler',
      draggable: '.sortable',
      dataIdAttr: 'data-quotaId',
      dragoverBubble: true,
      onStart: () => {
        domForeach(boxdom.getElementsByClassName('sortable'), (element) => {
          element.classList.remove('quota-list-item');
        });
      },
      setData: (dt) => {
        const d = document.createElement('div');
        dt.setDragImage(d, 2, 2);
      },
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
    const instance = (await initSortable())!;
    window.addEventListener('click', listener);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
  });
  onDeactivated(() => {
    window.removeEventListener('click', listener);
  });
</script>

<style lang="less" scoped>
  .scale {
    right: 50%;
    bottom: -10px;
  }

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
    opacity: 0;
    transform: translateY(-100px);
  }

  .quota-list-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .card-theme {
    @apply w-60 h-32 flex-col pt-1 p-2 shadow-md;

    .drag-handler {
      @apply mb-1;

      font-size: 16px;
    }

    .quota-title {
      @apply text-lg leading-5 font-medium;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .quota-sourceCode {
      @apply w-fit;
    }

    .quota-unit-sourceType {
      @apply mt-auto children:w-fit;
    }
  }

  .list-theme {
    @apply w-auto min-w-700px gap-4 p-2 text-sm mb-1;

    .drag-handler {
      @apply items-center;

      font-size: 16px;
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
</style>
