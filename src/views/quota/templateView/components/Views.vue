<template>
  <div class="overflow-scroll p-2 relative flex flex-col items-center">
    <PagePlaceHolder id="pagePlaceHolder" :pagination-info="paginationInfo" />
    <div
      class="w-1440px overflow-hidden absolute grid-line flex flex-wrap justify-start content-start"
      ref="gridContainer"
      @click.self="clearSelectKey"
      :style="gridAreaStyle"
    >
      <div
        v-for="element in templateList"
        :key="element.uniqId"
        @click="insertSelectKey(element, $event)"
        @mouseenter="handleEnter"
        :data-uniqid="element.uniqId"
        :class="[
          'border rounded-sm overflow-hidden sortable  m-0',
          selectedTemplateDOMList.find((node) => node.uniqId === element.uniqId) ? 'selected' : '',
          pageSetting.showElementborder ? '' : 'border-light-50',
        ]"
        :style="{
          width: element.pageConfig.width,
          height: element.pageConfig.height,
        }"
      >
        <Icon icon="akar-icons:drag-horizontal" class="drag-handler pl-1 pt-1 !text-primary" />
        <component
          :is="compTypeMap[element.type]"
          v-model:config="element.config"
          :class="[
            'w-full h-full text-base',
            element.type === 'Chart' ? 'py-1' : '',
            dragStatus ? 'pointer-events-none' : '',
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    unref,
    reactive,
    computed,
    ComputedRef,
    nextTick,
    CSSProperties,
    onMounted,
  } from 'vue';
  import {
    useMultiSelect,
    useTemplateListContext,
    useSelectTemplateListContext,
    usePageSettingContext,
    useDraggable1,
    paginationInfoType,
  } from '../hooks';
  import PagePlaceHolder from './PagePlaceHolder.vue';
  import { DoubleSideChart } from '/@/components/Chart';
  import BasicText from './Text.vue';
  import BasicImg from './Image.vue';
  import Icon from '/@/components/Icon';
  // import { useI18n } from '/@/hooks/web/useI18n';
  import { useResizeObserver } from '@vueuse/core';
  // import { useUniqueField } from '../../quotaTable/components/helper';
  import { getRem } from '/@/utils/domUtils';
  import { useSortable } from '/@/hooks/web/useSortable';
  import { isNullAndUnDef } from '/@/utils/is';
  import { once, on } from '/@/utils/domUtils';

  // import { useContextMenu } from '/@/hooks/web/useContextMenu';

  // const { t } = useI18n();
  // const [createContextMenu] = useContextMenu();
  // 页面设置
  const pageSetting = usePageSettingContext();
  const gridAreaStyle: ComputedRef<CSSProperties> = computed(() => {
    return {
      top: `calc(${pageSetting.paddingTop}px + 1.75rem)`,
      left: `calc(${pageSetting.paddingLeft}px + 50% - ${
        (pageSetting.paddingLeft + pageSetting.paddingRight + 8 + 1440) / 2
      }px)`,
      minHeight: `900px`,
    };
  });
  // 选中的模块
  const selectedTemplateDOMList = useSelectTemplateListContext();

  const templateList = useTemplateListContext();
  const compTypeMap = {
    Chart: DoubleSideChart,
    Text: BasicText,
    Img: BasicImg,
  };
  const { insertSelectKey, clearSelectKey } = useMultiSelect(templateList, selectedTemplateDOMList);
  const paginationInfo: paginationInfoType = reactive({
    totalPage: 1,
  });
  const GRIDSIZE = 40;
  function handleEnter(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const temp = templateList.value.find((el) => el.uniqId === target.getAttribute('data-uniqid'))!;
    let resizeStatus = false;
    on(target, 'mouseup', () => {
      if (resizeStatus) {
        temp.pageConfig.width = `${Math.round(target.offsetWidth / GRIDSIZE) * GRIDSIZE}px`;
        temp.pageConfig.height = `${Math.round(target.offsetHeight / GRIDSIZE) * GRIDSIZE}px`;
        resizeStatus = false;
      }
    });
    const { stop } = useResizeObserver(target, ([{ contentRect }]) => {
      const { width, height } = contentRect;
      temp.pageConfig.width = `${width + 2}px`;
      temp.pageConfig.height = `${height + 2}px`;
      resizeStatus = true;
    });
    once(target, 'mouseleave', () => {
      stop();
    });
  }
  // const { getUniqueField } = useUniqueField();

  // function checkOverflow(boxdom: HTMLDivElement) {
  //   for (let i = 0; i < boxdom.childElementCount; i++) {
  //     const child = boxdom.children[i] as HTMLElement;
  //     if (
  //       child.offsetTop + child.offsetHeight > boxdom.offsetTop + boxdom.offsetHeight ||
  //       child.offsetLeft + child.offsetWidth > boxdom.offsetLeft + boxdom.offsetWidth
  //     )
  //       return i;
  //   }
  //   return false;
  // }
  // function dragHandleMenu(event: MouseEvent) {
  //   createContextMenu({
  //     event,
  //     items: [
  //       {
  //         label: t('templateView.view.dragHandleMenu.wholeLine'),
  //       },
  //       {
  //         label: t('templateView.view.dragHandleMenu.notWholeLine'),
  //       },
  //     ],
  //   });
  // }
  function getDomConfig(event) {
    const target = event.target as HTMLElement;
    const _dom = templateList.value.find((temp) => temp.uniqId === target.dataset['uniqid'])!;
    return { target, _dom };
  }
  const gridContainer = ref<HTMLElement>();
  onMounted(async () => {
    await nextTick();
    const boxdom = unref(gridContainer)!;
    const pagePlaceHolder = document.getElementById('pagePlaceHolder') as HTMLDivElement;
    useResizeObserver(pagePlaceHolder, (entries) => {
      const { height } = entries[0].contentRect;
      // getRem()*4是页面之间的gap
      boxdom.style.height = `${
        height - pageSetting.paddingBottom - pageSetting.paddingTop - getRem() * 5
      }px`;
    });
    // 支持拖动排序
    const { initSortable } = useSortable(boxdom, {
      handle: '.drag-handler',
      draggable: '.sortable',
      dataIdAttr: 'data-uniqid',
      dragoverBubble: true,
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
          return;
        }
        // Sort column
        const columns = templateList.value;
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
  .no-scrollbar::-webkit-scrollbar {
    width: 0;
  }

  .selected {
    @apply shadow-sm shadow-primary;

    z-index: 9;
    border: 1px solid;
    border-color: @primary-color;
    // position: absolute;

    // &::after {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   bottom: 0;
    //   right: 0;
    //   background-color: @primary-color;
    //   opacity: 50%;
    // }
  }

  .sortable {
    box-sizing: border-box;
    transition: border 0.3s;
    background-color: @white;
    // position: absolute;

    ::v-deep(.autohidden-toolbar) {
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      resize: both;
      .drag-handler {
        opacity: 1;
      }

      ::v-deep(.autohidden-toolbar) {
        opacity: 1;
      }
    }

    .drag-handler {
      opacity: 0;
      position: absolute;
      z-index: 9;
      transition: opacity 0.2s;
    }
  }

  .move {
    position: absolute;
  }

  #grid-container {
    // width: calc(100% - 1rem);
  }

  .grid-line {
    @line-color: #f2f2f2;
    @grid-size: 40px;
    background: -webkit-linear-gradient(top, transparent @grid-size - 1, @line-color 0),
      -webkit-linear-gradient(left, transparent @grid-size - 1, @line-color 0);
    background-size: @grid-size @grid-size;
  }
</style>
