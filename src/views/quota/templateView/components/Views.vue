<template>
  <div class="w-full overflow-y-scroll p-2">
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
      v-for="(page, idx) in paginationInfo.pages"
      :key="idx"
      :ref="(el) => viewBoxs.push(el)"
    >
      <div
        @click="selectTemplate(temp, $event)"
        v-for="temp in page"
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
  import { reactive, ref, unref, watchEffect, computed, ComputedRef } from 'vue';
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
  import { last } from 'lodash-es';
  import { useWatchArray } from '/@/utils/helper/commonHelper';

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

  const paginationInfo: { pages: TemplateDOM[][]; totalPage: number } = reactive({
    pages: [[]],
    totalPage: 1,
  });
  useWatchArray(templateList, (v, pre) => {
    if (pre.length < v.length) {
      // const diffNode = differenceBy(v, pre, (node) => node.uniqId);
      // const beforNode = v[findIndex(v, (node) => node.uniqId === diffNode[0].uniqId) - 1];
      // for (let i = 0; i < paginationInfo.pages.length; i++) {
      //   const nodeList = paginationInfo.pages[i];
      //   const idx = nodeList.findIndex((node) => node.uniqId === beforNode.uniqId);
      //   nodeList.splice(idx + 1, 0, diffNode[0]);
      // }

      for (let i = 0; i < paginationInfo.pages.length; i++) {
        const arr = paginationInfo.pages[i];
        if (arr.length < 4) {
          arr.push(last(v)!);
          break;
        }
        if (i === paginationInfo.pages.length - 1 && arr.length === 4) {
          paginationInfo.pages.push([]);
        }
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
  onMountedOrActivated(() => {
    const boxdom: HTMLDivElement[] = unref(viewBoxs.value)!;
    // 支持拖动排序
    boxdom.forEach((dom) => {
      const { initSortable } = useSortable(dom, {
        handle: '.drag-handler',
        draggable: '.sortable',
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
      // 允许每个子元素缩放大小，并收集尺寸信息
      useMutationObserver(
        dom,
        (mutation) => {
          mutation.forEach((m) => {
            if (m.addedNodes.length === 0) return;
            // last(m.addedNodes as HTMLElement[])!.scrollIntoView({
            //   behavior: 'smooth',
            //   block: 'center',
            // });
            m.addedNodes.forEach((node) => {
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
