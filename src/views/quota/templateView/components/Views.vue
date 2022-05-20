<template>
  <div class="overflow-scroll p-2 relative flex flex-col items-center">
    <PagePlaceHolder id="pagePlaceHolder" :pagination-info="paginationInfo" />
    <div
      class="w-1440px overflow-hidden absolute grid-line"
      id="grid-container"
      @click.self="clearSelectKey"
      :style="gridAreaStyle"
    >
      <div
        v-for="element in templateList"
        :key="element.uniqId"
        @click="insertSelectKey(element, $event)"
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
  import { ref, reactive, computed, ComputedRef, nextTick, CSSProperties, onMounted } from 'vue';
  import {
    useMultiSelect,
    useTemplateListContext,
    useSelectTemplateListContext,
    usePageSettingContext,
    useDraggable,
    paginationInfoType,
  } from '../hooks';
  import PagePlaceHolder from './PagePlaceHolder.vue';
  import { DoubleSideChart } from '/@/components/Chart';
  import BasicText from './Text.vue';
  import BasicImg from './Image.vue';
  import Icon from '/@/components/Icon';
  // import { useI18n } from '/@/hooks/web/useI18n';
  import { useMutationObserver, useResizeObserver } from '@vueuse/core';
  // import { useUniqueField } from '../../quotaTable/components/helper';
  import { InteractEvent } from '@interactjs/types/index';
  import { getRem } from '/@/utils/domUtils';

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
  function getDomConfig(event: InteractEvent) {
    const target = event.target as HTMLElement;
    const _dom = templateList.value.find((temp) => temp.uniqId === target.dataset['uniqid'])!;
    return { target, _dom };
  }
  onMounted(async () => {
    await nextTick();
    const boxdom = document.getElementById('grid-container') as HTMLDivElement;
    const pagePlaceHolder = document.getElementById('pagePlaceHolder') as HTMLDivElement;

    useResizeObserver(pagePlaceHolder, (entries) => {
      const { height } = entries[0].contentRect;
      // getRem()*4是页面之间的gap
      boxdom.style.height = `${
        height - pageSetting.paddingBottom - pageSetting.paddingTop - getRem() * 5
      }px`;
    });
    const gridSize = 40;
    // 监听有新模块加入
    useMutationObserver(
      boxdom,
      (mutation) => {
        if (mutation[0].addedNodes.length === 0) return;
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
