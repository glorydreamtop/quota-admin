<template>
  <div class="w-full overflow-y-scroll p-2" id="page-box">
    <div
      class="
        flex flex-wrap
        content-start
        mb-8
        p-8
        pages
        bg-white
        overflow-hidden
        shadow shadow-gray-700
      "
      v-for="page in paginationInfo.pages"
      :key="page.id"
      :ref="(el) => viewBoxs.push(el)"
      :data-pageid="page.id"
    >
      <div
        @click="selectTemplate(temp, $event)"
        v-for="temp in page.list"
        :key="temp.uniqId"
        :data-uniqid="temp.uniqId"
        :class="[
          'border border-gray-100 resize overflow-hidden sortable relative',
          selectTemplateList.includes(temp.uniqId) ? 'selected' : '',
        ]"
        :style="{ width: temp.pageConfig.width, height: temp.pageConfig.height }"
      >
        <Popover placement="rightTop">
          <template #title>
            <span>{{ t('templateView.view.tempInfoTitle') }}</span>
          </template>
          <Icon
            icon="akar-icons:drag-horizontal"
            class="drag-handler cursor-move pl-1 pt-1 !text-primary"
          />
        </Popover>
        <component :is="compTypeMap[temp.type]" :config="temp.config" class="w-full h-full" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, watchEffect, computed, ComputedRef, watch, nextTick } from 'vue';
  import { Popover } from 'ant-design-vue';
  import { useMultiSelect, useTemplateListContext, TemplateListMapType } from '../hooks';
  import type { TemplateDOM } from '/#/template';
  import { BasicChart } from '/@/components/Chart';
  import BasicText from './Text.vue';
  import BasicImg from './Image.vue';
  import Icon from '/@/components/Icon';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useSortable } from '/@/hooks/web/useSortable';
  import { isNullAndUnDef } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMutationObserver, useResizeObserver } from '@vueuse/core';
  import { differenceBy, findIndex } from 'lodash-es';
  import { useWatchArray } from '/@/utils/helper/commonHelper';
  import { useUniqueField } from '../../quotaTable/components/helper';

  const emit = defineEmits<{
    (event: 'selectTemplate', arr: TemplateDOM[]): void;
  }>();

  const { t } = useI18n();
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
  const viewBoxs = ref<HTMLDivElement[]>([]);
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

      // for (let i = 0; i < paginationInfo.pages.length; i++) {
      //   const arr = paginationInfo.pages[i];
      //   if (arr.length < 4) {
      //     arr.push(last(v)!);
      //     break;
      //   }
      //   if (i === paginationInfo.pages.length - 1 && arr.length === 4) {
      //     paginationInfo.pages.push([]);
      //     paginationInfo.totalPage++;
      //   }
      // }
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
          m.addedNodes.forEach((page) => {
            // 支持拖动排序
            const { initSortable } = useSortable(page, {
              handle: '.drag-handler',
              draggable: '.sortable',
              onEnd: (evt) => {
                const { oldIndex, newIndex } = evt;
                if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
                  return;
                }
                // Sort column
                const columns = paginationInfo.pages.find(
                  (_page) => _page.id === page.dataset.pageid
                ).list;
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
            useMutationObserver(
              page,
              (mutation2) => {
                mutation2.forEach((m2) => {
                  if (m2.addedNodes.length === 0) return;
                  m2.addedNodes.forEach((node) => {
                    useResizeObserver(node, (e) => {
                      const target = e[0].target as HTMLElement;
                      const _dom = templateList.value.find(
                        (temp) => temp.uniqId === target.dataset['uniqid']
                      )!;
                      if (_dom) {
                        _dom.pageConfig.width = `${target.style.width}px`;
                        _dom.pageConfig.height = `${target.style.height}px`;
                        const overflow = checkOverflow(target.parentElement!);
                        if (overflow) {
                        } else {
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
    aspect-ratio: 210/297;
  }
</style>
