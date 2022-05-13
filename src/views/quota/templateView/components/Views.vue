<template>
  <div class="w-full overflow-y-scroll p-2" id="page-box">
    <div
      :class="[
        'pages bg-white overflow-hidden shadow-lg shadow-gray-300 flex flex-col items-center gap-4',
        pageSetting.pagination ? 'mb-8' : '',
      ]"
      v-for="(page, pageIdx) in paginationInfo.pages"
      :key="page.id"
      :data-pageid="page.id"
      :style="pageStyle"
      @click.self="clearSelectKey"
    >
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
      <div
        class="flex flex-wrap content-start flex-grow w-full overflow-hidden relative"
        @click.self="clearSelectKey"
      >
        <div
          v-for="element in page.list"
          :key="element.uniqId"
          @click="selectTemplate(element, $event)"
          :data-uniqid="element.uniqId"
          :class="[
            'border rounded-sm overflow-hidden sortable',
            selectedTemplateDOMList.find((node) => node.uniqId === element.uniqId)
              ? 'selected'
              : '',
            pageSetting.showElementborder ? '' : 'border-light-50',
          ]"
          :style="{ width: element.pageConfig.width, height: element.pageConfig.height }"
          v-resizeable:hidden="`xy`"
        >
          <Icon
            icon="akar-icons:drag-horizontal"
            class="drag-handler cursor-move pl-1 pt-1 !text-primary"
          />
          <component
            :is="compTypeMap[element.type]"
            v-model:config="element.config"
            :class="['w-full h-full text-base', element.type === 'Chart' ? 'py-2' : '']"
          />
        </div>
      </div>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed, ref, ComputedRef, watch, nextTick, CSSProperties } from 'vue';
  import {
    useMultiSelect,
    useTemplateListContext,
    useSelectTemplateListContext,
    usePageSettingContext,
  } from '../hooks';
  import type { TemplateDOM } from '/#/template';
  import { DoubleSideChart } from '/@/components/Chart';
  import BasicText from './Text.vue';
  import BasicImg from './Image.vue';
  import Icon from '/@/components/Icon';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  // import { useI18n } from '/@/hooks/web/useI18n';
  import { useMutationObserver, useResizeObserver, useTimeoutFn } from '@vueuse/core';
  import { cloneDeep, differenceBy, findIndex, isNull, remove } from 'lodash-es';
  import { useWatchArray } from '/@/utils/helper/commonHelper';
  import { useUniqueField } from '../../quotaTable/components/helper';
  // import Draggable from 'vuedraggable';
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
          ? '297/210'
          : '210/297'
        : 'unset',
    };
  });
  const reload = ref(false);
  watch(
    () => pageSetting.pagination,
    () => {
      const clone = cloneDeep(templateList.value);
      reload.value = true;
      templateList.value = [];
      paginationInfo.pages = [{ list: [], id: getUniqueField() }];
      reload.value = false;
      for (let i = 0; i < clone.length; i++) {
        useTimeoutFn(() => {
          templateList.value.push(clone[i]);
        }, 30 * i);
      }
    },
  );
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
  const paginationInfo: { pages: { list: TemplateDOM[]; id: string }[]; totalPage: number } =
    reactive({
      pages: [],
      totalPage: 1,
    });
  const { getUniqueField } = useUniqueField();
  useWatchArray(templateList, (v, pre) => {
    // 是切换页面模式导致的重排则不响应
    if (reload.value) return;
    if (pre.length < v.length) {
      // 新增元素时计算插入位置
      const diffNode = differenceBy(v, pre, (node) => node.uniqId);
      for (let i = 0; i < diffNode.length; i++) {
        const nodeIndex = findIndex(v, (node) => node.uniqId === diffNode[i].uniqId);
        if (nodeIndex === 0) {
          paginationInfo.pages[0].list.unshift(diffNode[i]);
        } else {
          const beforNode = v[nodeIndex - 1];
          for (let j = 0; j < paginationInfo.pages.length; j++) {
            const page = paginationInfo.pages[j];
            const idx = page.list.findIndex((node) => node.uniqId === beforNode.uniqId);
            if (idx > -1) {
              page.list.splice(idx + 1, 0, diffNode[i]);
              break;
            }
          }
        }
      }
    } else if (pre.length > v.length) {
      const diffNodeUniqId = differenceBy(pre, v, (node) => node.uniqId).map((node) => node.uniqId);
      for (let i = 0; i < paginationInfo.pages.length; i++) {
        const page = paginationInfo.pages[i];
        remove(page.list, (node) => diffNodeUniqId.includes(node.uniqId));
      }
      remove(paginationInfo.pages, (page) => page.list.length === 0);
      if (paginationInfo.pages.length === 0) {
        paginationInfo.pages = [{ list: [], id: getUniqueField() }];
      }
    }
  });
  function checkOverflow(boxdom: HTMLDivElement) {
    for (let i = 0; i < boxdom.childElementCount; i++) {
      const child = boxdom.children[i] as HTMLElement;
      if (
        child.offsetTop + child.offsetHeight > boxdom.offsetTop + boxdom.offsetHeight ||
        child.offsetLeft + child.offsetWidth > boxdom.offsetLeft + boxdom.offsetWidth
      )
        return i;
    }
    return false;
  }
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
  onMountedOrActivated(() => {
    const boxdom = document.getElementById('page-box') as HTMLDivElement;
    // 监听有新页面加入
    useMutationObserver(
      boxdom,
      (mutation) => {
        mutation.forEach((m) => {
          if (m.addedNodes.length === 0) return;
          // 监听单页面内部新节点加入，并使其可拖拽，可拖拽缩放，并收集尺寸信息
          m.addedNodes.forEach((pagedom: HTMLElement) => {
            // pagedom.style.height = `${pagedom.offsetHeight}px`;
            useMutationObserver(
              pagedom.children[1],
              (mutation2) => {
                mutation2.forEach((m2) => {
                  if (m2.addedNodes.length === 0) return;
                  m2.addedNodes.forEach((node) => {
                    useResizeObserver(node, (e) => {
                      const target = e[0].target as HTMLElement;
                      if (isNull(target.parentElement)) return;
                      const _dom = templateList.value.find(
                        (temp) => temp.uniqId === target.dataset['uniqid'],
                      )!;
                      if (_dom) {
                        _dom.pageConfig.width = target.style.width;
                        _dom.pageConfig.height = target.style.height;
                        // 长图模式下不计算布局分页
                        if (!pageSetting.pagination) return;
                        const overflow = checkOverflow(target.parentElement!);
                        if (overflow) {
                          // 放不下就推到下一页
                          const nextPagedom = pagedom.nextElementSibling as HTMLElement;
                          if (nextPagedom) {
                            for (let i = 0; i < paginationInfo.pages.length; i++) {
                              const page = paginationInfo.pages[i];
                              if (page.id === nextPagedom.dataset['pageid']) {
                                paginationInfo.pages[i].list.unshift(
                                  paginationInfo.pages[i - 1].list.pop()!,
                                );
                                break;
                              }
                            }
                          } else {
                            paginationInfo.pages.push({ list: [], id: getUniqueField() });
                            paginationInfo.totalPage++;
                            // await nextTick();
                            useTimeoutFn(() => {
                              for (let i = 0; i < paginationInfo.pages.length; i++) {
                                const page = paginationInfo.pages[i];
                                if (
                                  page.id ===
                                  (pagedom.nextElementSibling as HTMLElement).dataset['pageid']
                                ) {
                                  paginationInfo.pages[i].list.unshift(
                                    paginationInfo.pages[i - 1].list.pop()!,
                                  );
                                  break;
                                }
                              }
                            }, 96);
                          }
                        }
                      }
                    });
                  });
                });
              },
              {
                childList: true,
              },
            );
          });
        });
      },
      {
        childList: true,
      },
    );
    paginationInfo.pages.push({ list: [], id: getUniqueField() });
  });
</script>

<style lang="less" scoped>
  .no-scrollbar::-webkit-scrollbar {
    width: 0;
  }

  .selected {
    @apply shadow-sm shadow-primary;

    position: relative;
    border-radius: 4px;
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
</style>
