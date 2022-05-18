<template>
  <div class="w-full overflow-y-scroll p-2 relative" id="page-box">
    <div
      :class="[
        'pages bg-white overflow-hidden shadow-lg shadow-gray-300 flex flex-col items-center gap-4',
        pageSetting.pagination ? 'mb-8' : '',
      ]"
      v-for="pageIdx in paginationInfo.totalPage"
      :key="pageIdx"
      :data-pageid="pageIdx"
      :style="pageStyle"
      @click.self="clearSelectKey"
    >
      <!-- 页眉start -->
      <div class="pb-1 border-b page-header" v-show="pageSetting.header.show">
        <span contenteditable @input="pageHeaderChange('left', $event)">{{
          pageSetting.header.left
        }}</span>
        <span class="flex gap-1"
          ><img class="w-3.5 h-3.5" src="http://121.4.186.36:23587/favicon.ico" /><span
            contenteditable
            @input="pageHeaderChange('right', $event)"
            class="text-right"
            >{{ pageSetting.header.right }}</span
          ></span
        >
      </div>
      <!-- 页眉end -->
      <div class="page-main flex-grow"> </div>
      <!-- 页脚start -->
      <div class="pt-1 border-t page-footer">
        <span
          contenteditable
          v-show="pageSetting.footer.show"
          @input="pageFooterChange('left', $event)"
          >{{ pageSetting.footer.left }}</span
        >
        <span class="footer-page-num" v-show="pageSetting.footer.pageNum">{{ pageIdx + 1 }}</span>
        <span v-show="pageSetting.footer.show" class="flex gap-1"
          ><img class="w-3.5 h-3.5" src="http://121.4.186.36:23587/favicon.ico" /><span
            contenteditable
            @input="pageFooterChange('right', $event)"
            >{{ pageSetting.footer.right }}</span
          ></span
        >
      </div>
      <!-- 页脚end -->
    </div>
    <div
      class="flex-grow overflow-hidden absolute grid-line"
      id="grid-container"
      @click.self="clearSelectKey"
      :style="{
        top: `calc(${pageStyle.paddingTop} + 2rem)`,
        left: `calc(${pageStyle.paddingLeft} + 0.5rem)`,
        right: `calc(${pageStyle.paddingRight} + 0.5rem)`,
        bottom: pageStyle.paddingBottom,
      }"
    >
      <div
        v-for="element in templateList"
        :key="element.uniqId"
        @click="selectTemplate(element, $event)"
        :data-uniqid="element.uniqId"
        :class="[
          'border rounded-sm overflow-hidden sortable',
          selectedTemplateDOMList.find((node) => node.uniqId === element.uniqId) ? 'selected' : '',
          pageSetting.showElementborder ? '' : 'border-light-50',
        ]"
        :style="{
          width: element.pageConfig.width,
          height: element.pageConfig.height,
          transform: element.pageConfig.transform,
        }"
      >
        <Icon icon="akar-icons:drag-horizontal" class="drag-handler pl-1 pt-1 !text-primary" />
        <component
          :is="compTypeMap[element.type]"
          v-model:config="element.config"
          :class="['w-full h-full text-base', element.type === 'Chart' ? 'py-2' : '']"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed, ComputedRef, watch, nextTick, CSSProperties } from 'vue';
  import {
    useMultiSelect,
    useTemplateListContext,
    useSelectTemplateListContext,
    usePageSettingContext,
    useDraggable,
  } from '../hooks';
  import type { TemplateDOM } from '/#/template';
  import { DoubleSideChart } from '/@/components/Chart';
  import BasicText from './Text.vue';
  import BasicImg from './Image.vue';
  import Icon from '/@/components/Icon';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  // import { useI18n } from '/@/hooks/web/useI18n';
  import { useMutationObserver } from '@vueuse/core';
  // import { useUniqueField } from '../../quotaTable/components/helper';
  import { InteractEvent } from '@interactjs/types/index';

  // import { useContextMenu } from '/@/hooks/web/useContextMenu';

  // const { t } = useI18n();
  // const [createContextMenu] = useContextMenu();
  const pageSetting = usePageSettingContext();
  const selectedTemplateDOMList = useSelectTemplateListContext();
  const pageStyle: ComputedRef<CSSProperties> = computed(() => {
    return {
      paddingTop: `${pageSetting.paddingTop}px`,
      paddingBottom: `${pageSetting.paddingBottom}px`,
      paddingLeft: `${pageSetting.paddingLeft}px`,
      paddingRight: `${pageSetting.paddingRight}px`,
      aspectRatio: pageSetting.pagination
        ? pageSetting.horizontal
          ? '300/210'
          : '210/300'
        : 'unset',
    };
  });
  const templateList = useTemplateListContext();
  const compTypeMap = {
    Chart: DoubleSideChart,
    Text: BasicText,
    Img: BasicImg,
  };
  const { insertSelectKey, clearSelectKey } = useMultiSelect(templateList, selectedTemplateDOMList);
  function selectTemplate(temp: TemplateDOM, nativeEvent: PointerEvent) {
    insertSelectKey(temp, nativeEvent);
  }
  const paginationInfo: { totalPage: number } = reactive({
    totalPage: 1,
  });
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
  watch(
    () => paginationInfo.totalPage,
    async () => {
      await nextTick();
    },
  );
  function pageHeaderChange(pos: 'left' | 'right', e: InputEvent) {
    pageSetting.header[pos] = (e.target as HTMLSpanElement).innerText;
  }
  function pageFooterChange(pos: 'left' | 'right', e: InputEvent) {
    pageSetting.footer[pos] = (e.target as HTMLSpanElement).innerText;
  }
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
  function getDomConfig(event: InteractEvent) {
    const target = event.target as HTMLElement;
    const _dom = templateList.value.find((temp) => temp.uniqId === target.dataset['uniqid'])!;
    return { target, _dom };
  }
  onMountedOrActivated(() => {
    const boxdom = document.getElementById('grid-container') as HTMLDivElement;
    const gridSize = 40;
    // 监听有新模块加入
    useMutationObserver(
      boxdom,
      (mutation) => {
        if (mutation[0].addedNodes.length === 0) return;
        console.log(mutation);

        useDraggable({
          items: '.sortable',
          handle: '.drag-handler',
          onDraggle: (event) => {
            const { _dom, target } = getDomConfig(event);
            const transform = target.style.transform;
            const reg = /translate\((\-?[0-9]+)px, (\-?[0-9]+)px\)/;
            const match = reg.exec(transform);
            if (match) {
              const x = Number(match[1]) + event.dx;
              const y = Number(match[2]) + event.dy;
              _dom.pageConfig.transform = `translate(${x}px, ${y}px)`;
            }
          },
          onDraggleEnd: (event) => {
            const { _dom, target } = getDomConfig(event);
            const transform = target.style.transform;
            const reg = /translate\((\-?[0-9]+)px, (\-?[0-9]+)px\)/;
            const match = reg.exec(transform);
            if (match) {
              const x = Number(match[1]) + event.dx;
              const y = Number(match[2]) + event.dy;

              _dom.pageConfig.transform = `translate(${Math.round(x / gridSize) * gridSize}px, ${
                Math.round(y / gridSize) * gridSize
              }px)`;
            }
          },
          onResize: (event) => {
            const { _dom } = getDomConfig(event);
            _dom.pageConfig.width = `${event.rect.width}px`;
            _dom.pageConfig.height = `${event.rect.height}px`;
          },
          onResizeEnd: (event) => {
            const { _dom } = getDomConfig(event);
            _dom.pageConfig.width = `${Math.round(event.rect.width / gridSize) * gridSize}px`;
            _dom.pageConfig.height = `${Math.round(event.rect.height / gridSize) * gridSize}px`;
          },
        });
      },
      {
        childList: true,
      },
    );
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

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: @primary-color;
      opacity: 50%;
    }
  }

  .pages {
    width: 100%;
    height: auto;
    min-height: 800px;
  }

  .sortable {
    box-sizing: border-box;
    width: 50%;
    transition: border 0.3s;
    background-color: @white;
    position: absolute;

    ::v-deep(.autohidden-toolbar) {
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
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

  .page-header,
  .page-footer {
    @apply border-gray-200;
    @apply text-sm;
    @apply leading-4;
    @apply px-1;
    @apply text-gray-300;

    position: relative;
    width: 100%;
    height: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      width: fit-content;
      // font-style: italic;
      outline: none;
      overflow: visible;
    }
  }

  .footer-page-num {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  #grid-container {
    // width: calc(100% - 1rem);
  }

  .grid-line {
    @line-color: lighten(@primary-color, 40%);
    @grid-size: 40px;
    background: -webkit-linear-gradient(top, transparent @grid-size - 1, @line-color 0),
      -webkit-linear-gradient(left, transparent @grid-size - 1, @line-color 0);
    background-size: @grid-size @grid-size;
  }
</style>
