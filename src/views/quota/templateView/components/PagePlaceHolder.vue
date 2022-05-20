<template>
  <!-- 这个8px是滚动条宽度 -->
  <div
    :style="{
      width: `${pageSetting.paddingLeft + pageSetting.paddingRight + 8 + 1440}px`,
    }"
  >
    <div
      :class="[
        'pages bg-white shadow-lg shadow-gray-300 flex flex-col',
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
      <div class="page-main w-1440px flex-grow"> </div>
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
  </div>
</template>

<script lang="ts" setup>
  import { toRefs, ComputedRef, computed, CSSProperties } from 'vue';
  import { paginationInfoType, usePageSettingContext } from '../hooks';

  const props = defineProps<{
    paginationInfo: paginationInfoType;
  }>();

  const { paginationInfo } = toRefs(props);

  // 页面设置
  const pageSetting = usePageSettingContext();

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

  function pageHeaderChange(pos: 'left' | 'right', e: InputEvent) {
    pageSetting.header[pos] = (e.target as HTMLSpanElement).innerText;
  }
  function pageFooterChange(pos: 'left' | 'right', e: InputEvent) {
    pageSetting.footer[pos] = (e.target as HTMLSpanElement).innerText;
  }
</script>

<style lang="less" scoped>
  .pages {
    // width: 100%;
    height: auto;
    min-height: 1200px;
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
