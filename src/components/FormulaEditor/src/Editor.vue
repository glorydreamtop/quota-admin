<template>
  <div class="relative overflow-visible">
    <div
      class="formula-editor w-full h-29 absolute z-9 resize-y overflow-hidden"
      ref="formulaEditorRef"
      contenteditable
      @input="formulaChange"
      @blur="updateFormula"
    ></div>
    <pre
      class="language-javascript w-full text-left code pointer-events-none"
      ref="formulaCodeRef"
    ></pre>
    <div
      class="fixed z-19 flex flex-col h-22 bg-white overflow-y-scroll divide-y divide-gray-300"
      :style="{ left: `${rect.left}px`, top: `${rect.top}px` }"
    >
      <span v-for="item in fnList" :key="item">{{ item }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, unref, watch } from 'vue';
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  import 'highlight.js/styles/lioshi.css';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useResizeObserver } from '@vueuse/core';
  import { fnMap } from './token';
  import { parseInt } from 'lodash';
  const props = defineProps({
    formula: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits<{
    (event: 'update:formula', formula: string): void;
  }>();
  // 按照javascript语法高亮
  hljs.registerLanguage('javascript', javascript);
  const formulaCodeRef = ref<HTMLPreElement>();
  const formulaEditorRef = ref<HTMLDivElement>();

  // 文本变化时重新渲染高亮
  function formulaChange(e: InputEvent) {
    const { x, y } = (e.target as HTMLDivElement)!.getBoundingClientRect();
    const endOffset = window.getSelection()!.getRangeAt(0).endOffset;
    rect.left = (endOffset % colNum.value) * 8.8 + 14 + x;
    rect.top = (parseInt(endOffset / colNum.value) + 1) * 24 + y;
    const el = formulaCodeRef.value!;
    const text = (e.target as HTMLDivElement)!.innerText;
    el.innerHTML = `<code>${text}</code>`;
    hljs.highlightBlock(el);
  }
  // 失去焦点时向外传递结果
  function updateFormula(e: FocusEvent) {
    emit('update:formula', (e.target as HTMLDivElement)!.innerText);
  }
  const rect = reactive({
    width: 0,
    height: 0,
    left: 0,
    top: 1,
  });
  const colNum = computed(() => {
    return parseInt(rect.width / 8.8);
  });
  // 允许拖拽编辑器大小
  onMountedOrActivated(() => {
    const el = formulaCodeRef.value!;
    useResizeObserver(unref(formulaEditorRef), (e) => {
      const target = e[0].target as HTMLDivElement;
      rect.width = e[0].contentRect.width;
      rect.height = e[0].contentRect.height;
      el.style.height = target.offsetHeight + 'px';
      el.style.width = target.offsetWidth + 'px';
      el.parentElement!.style.height = target.offsetHeight + 'px';
    });
    hljs.highlightElement(el);
  });
  watch(
    props,
    (v) => {
      // 外部传入公式代码时渲染高亮
      const el = formulaCodeRef.value!;
      formulaEditorRef.value!.innerText = v.formula;
      el.innerHTML = `<code>${v.formula}</code>`;
      hljs.highlightBlock(el);
    },
    { deep: true }
  );

  const fnList = ref(Object.keys(fnMap));
</script>

<style lang="less" scoped>
  .formula-editor {
    caret-color: #b8b8b8;
    padding: 4px 11px;
    font-size: 16px;
    line-height: 24px;
    color: transparent;
    white-space: wrap;
    word-wrap: break-word;
    word-break: break-all;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }

  .code {
    padding: 4px 11px;
    position: absolute;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    font-size: 16px;
    line-height: 24px;
    top: 0;
  }
</style>
