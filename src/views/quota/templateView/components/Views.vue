<template>
  <div class="w-full overflow-y-scroll flex flex-wrap no-scrollbar" ref="viewBox">
    <div
      @click="selectTemplate(temp, $event)"
      v-for="temp in templateList"
      :key="temp.uniqId"
      :class="[
        'w-1/2 h-500px border border-gray-100 resize overflow-hidden sortable',
        selectTemplateList.includes(temp.uniqId) ? 'selected' : '',
      ]"
    >
      <Icon
        icon="akar-icons:drag-horizontal"
        class="drag-handler cursor-move pl-1 pt-1 !text-primary"
      />
      <component :is="compTypeMap[temp.version]" :config="temp.config" class="w-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { useMultiSelect, useTemplateListContext } from '../hooks';
  import { TemplateDOM } from '/#/template';
  import { BasicChart } from '/@/components/Chart';
  import Icon from '/@/components/Icon';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useSortable } from '/@/hooks/web/useSortable';
  import { isNullAndUnDef } from '/@/utils/is';
  const templateList = useTemplateListContext();

  const compTypeMap = [BasicChart, BasicChart];
  const viewBox = ref<HTMLDivElement>();

  const [selectTemplateList, { insertSelectKey }] = useMultiSelect(templateList);
  function selectTemplate(temp: TemplateDOM, nativeEvent: PointerEvent) {
    insertSelectKey(temp, nativeEvent);
  }
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
