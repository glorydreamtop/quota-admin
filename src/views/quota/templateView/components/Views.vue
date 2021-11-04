<template>
  <div class="w-full overflow-y-scroll p-2" id="page-box">
    <Draggable
      :class="[
        'flex flex-wrap content-start pages bg-white overflow-hidden shadow-lg shadow-gray-700 list-group',
        pageSetting.pagination ? 'mb-8' : '',
      ]"
      v-for="page in paginationInfo.pages"
      :key="page.id"
      :data-pageid="page.id"
      :list="page.list"
      group="page"
      handle=".drag-handler"
      :animation="200"
      itemKey="uniqId"
      :style="pageStyle"
    >
      <template #header>
        <div class="w-full h-12 border-b border-gray-200 mb-6">
          <span class="float-left italic leading-4 mt-7 ml-2 text-gray-400">笃初诚美 慎终宜令</span>
          <span class="float-right italic leading-4 mt-7 mr-2 text-gray-400 flex gap-1"
            ><img class="w-3.5 h-3.5" src="http://121.4.186.36:23587/favicon.ico" /><span
              >上海笃诚投资管理有限公司</span
            ></span
          >
        </div>
      </template>

      <template #item="{ element }">
        <div
          @click="selectTemplate(element, $event)"
          :data-uniqid="element.uniqId"
          :class="[
            'border border-gray-100 resize overflow-hidden sortable relative',
            selectTemplateList.includes(element.uniqId) ? 'selected' : '',
          ]"
          :style="{ width: element.pageConfig.width, height: element.pageConfig.height }"
        >
          <Icon
            icon="akar-icons:drag-horizontal"
            class="drag-handler cursor-move pl-1 pt-1 !text-primary"
          />
          <component
            :is="compTypeMap[element.type]"
            v-model:config="element.config"
            class="w-full h-full"
          />
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts" setup>
  import {
    reactive,
    watchEffect,
    computed,
    ref,
    ComputedRef,
    watch,
    nextTick,
    CSSProperties,
  } from 'vue';
  import {
    useMultiSelect,
    useTemplateListContext,
    TemplateListMapType,
    usePageSettingContext,
  } from '../hooks';
  import type { TemplateDOM } from '/#/template';
  import { BasicChart } from '/@/components/Chart';
  import BasicText from './Text.vue';
  import BasicImg from './Image.vue';
  import Icon from '/@/components/Icon';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  // import { useI18n } from '/@/hooks/web/useI18n';
  import { useMutationObserver, useResizeObserver, useTimeoutFn } from '@vueuse/core';
  import { cloneDeep, differenceBy, findIndex, isNull, remove } from 'lodash-es';
  import { useWatchArray } from '/@/utils/helper/commonHelper';
  import { useUniqueField } from '../../quotaTable/components/helper';
  import Draggable from 'vuedraggable';

  const emit = defineEmits<{
    (event: 'selectTemplate', arr: TemplateDOM[]): void;
  }>();

  // const { t } = useI18n();
  const pageSetting = usePageSettingContext();
  const pageStyle: ComputedRef<CSSProperties> = computed(() => {
    return {
      paddingTop: `${pageSetting.paddingTop}px`,
      paddingBottom: `${pageSetting.paddingBottom}px`,
      paddingLeft: `${pageSetting.paddingLeft}px`,
      paddingRight: `${pageSetting.paddingRight}px`,
      aspectRatio: pageSetting.pagination ? '210/297' : 'unset',
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
    }
  );
  const templateList = useTemplateListContext();
  const templateMap: ComputedRef<TemplateListMapType> = computed(() => {
    const obj = {};
    templateList.value.forEach((t) => {
      obj[t.uniqId] = t;
    });
    return obj;
  });
  const compTypeMap = {
    Chart: BasicChart,
    Text: BasicText,
    Img: BasicImg,
  };
  const [selectTemplateList, { insertSelectKey }] = useMultiSelect(templateList);
  function selectTemplate(temp: TemplateDOM, nativeEvent: PointerEvent) {
    insertSelectKey(temp, nativeEvent);
  }
  watchEffect(() => {
    emit(
      'selectTemplate',
      selectTemplateList.value.map((uniqId) => templateMap.value[uniqId])
    );
  });

  const paginationInfo: { pages: { list: TemplateDOM[]; id: string }[]; totalPage: number } =
    reactive({
      pages: [],
      totalPage: 1,
    });
  const { getUniqueField } = useUniqueField();
  useWatchArray(templateList, (v, pre) => {
    if (reload.value) return;
    if (pre.length < v.length) {
      const diffNode = differenceBy(v, pre, (node) => node.uniqId);
      const nodeIndex = findIndex(v, (node) => node.uniqId === diffNode[0].uniqId);
      if (nodeIndex === 0) {
        paginationInfo.pages[0].list.unshift(diffNode[0]);
      } else {
        const beforNode = v[nodeIndex - 1];
        for (let i = 0; i < paginationInfo.pages.length; i++) {
          const page = paginationInfo.pages[i];
          const idx = page.list.findIndex((node) => node.uniqId === beforNode.uniqId);
          if (idx > -1) {
            page.list.splice(idx + 1, 0, diffNode[0]);
            break;
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
    }
  );
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
            useMutationObserver(
              pagedom,
              (mutation2) => {
                mutation2.forEach((m2) => {
                  if (m2.addedNodes.length === 0) return;
                  m2.addedNodes.forEach((node) => {
                    useResizeObserver(node, (e) => {
                      const target = e[0].target as HTMLElement;
                      if (isNull(target.parentElement)) return;
                      const _dom = templateList.value.find(
                        (temp) => temp.uniqId === target.dataset['uniqid']
                      )!;
                      if (_dom) {
                        _dom.pageConfig.width = target.style.width;
                        _dom.pageConfig.height = target.style.height;
                        const overflow = checkOverflow(target.parentElement!);
                        if (overflow) {
                          const nextPagedom = pagedom.nextElementSibling as HTMLElement;
                          if (nextPagedom) {
                            for (let i = 0; i < paginationInfo.pages.length; i++) {
                              const page = paginationInfo.pages[i];
                              if (page.id === nextPagedom.dataset['pageid']) {
                                paginationInfo.pages[i].list.unshift(
                                  paginationInfo.pages[i - 1].list.pop()!
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
                                    paginationInfo.pages[i - 1].list.pop()!
                                  );
                                  break;
                                }
                              }
                            }, 100);
                          }
                        }
                      }
                    });
                  });
                });
              },
              {
                childList: true,
              }
            );
          });
        });
      },
      {
        childList: true,
      }
    );
    paginationInfo.pages.push({ list: [], id: getUniqueField() });
    // useResizeObserver(boxdom.getElementsByClassName('sortable')[0], (e) => {
    //   console.log(e);
    // });
  });
</script>

<style lang="less" scoped>
  .no-scrollbar::-webkit-scrollbar {
    width: 0;
  }

  .drag-handler {
    position: absolute;
    z-index: 9;
  }

  .selected {
    position: relative;
    border-color: @primary-color;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: @primary-color;
      opacity: 0.5;
    }
  }

  .pages {
    width: 100%;
    height: auto;
    min-height: 800px;
  }
</style>
