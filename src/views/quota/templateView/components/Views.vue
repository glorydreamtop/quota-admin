<template>
  <div class="w-full overflow-y-scroll flex flex-wrap no-scrollbar p-2 content-start" ref="viewBox">
    <div
      @click="selectTemplate(temp, $event)"
      v-for="temp in templateList"
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
      <component :is="compTypeMap[temp.version]" :config="temp.config" class="w-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, watch, watchEffect } from 'vue';
  import { Popover } from 'ant-design-vue';
  import { useMultiSelect, useTemplateListContext, TemplateListMapType } from '../hooks';
  import type { TemplateDOM } from '/#/template';
  import { BasicChart } from '/@/components/Chart';
  import Icon from '/@/components/Icon';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useSortable } from '/@/hooks/web/useSortable';
  import { isNullAndUnDef } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMutationObserver, useResizeObserver } from '@vueuse/core';
  import { last } from 'lodash';

  const emit = defineEmits<{
    (event: 'selectTemplate', arr: TemplateDOM[]): void;
  }>();

  const { t } = useI18n();
  const templateList = useTemplateListContext();
  const templateMap: TemplateListMapType = {};
  const compTypeMap = [BasicChart, BasicChart, BasicChart];
  const viewBox = ref<HTMLDivElement>();
  watch(
    templateList,
    (v) => {
      for (let k in templateMap) {
        Reflect.deleteProperty(templateMap, k);
      }
      v.forEach((t) => {
        templateMap[t.uniqId] = t;
      });
    },
    {
      deep: true,
    }
  );
  const [selectTemplateList, { insertSelectKey }] = useMultiSelect(templateList);
  function selectTemplate(temp: TemplateDOM, nativeEvent: PointerEvent) {
    insertSelectKey(temp, nativeEvent);
  }
  watchEffect(() => {
    emit(
      'selectTemplate',
      selectTemplateList.value.map((uniqId) => templateMap[uniqId])
    );
  });
  onMountedOrActivated(() => {
    const boxdom: HTMLDivElement = unref(viewBox.value)!;
    // 支持拖动排序
    const { initSortable } = useSortable(boxdom, {
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
      boxdom,
      (mutation) => {
        last(mutation[0].addedNodes as HTMLElement[])!.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        mutation[0].addedNodes.forEach((node) => {
          useResizeObserver(node, (e) => {
            const target = e[0].target as HTMLElement;
            const dom = templateList.value.find(
              (temp) => temp.uniqId === target.dataset['uniqid']
            )!;
            dom.pageConfig.width = `${target.style.width}px`;
            dom.pageConfig.height = `${target.style.height}px`;
          });
        });
      },
      {
        childList: true,
      }
    );
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
</style>
