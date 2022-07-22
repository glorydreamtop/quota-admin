<template>
  <!-- 4px是减去半个滚动条 -->
  <div class="ruler-top" :style="{ left: `calc(${left} - 4px)` }"></div>
  <div
    class="ruler-left"
    :style="{ top: `calc(${top} + 2rem)`, left: `calc(${left} - 2.9rem)` }"
  ></div>
</template>

<script lang="ts" setup>
  import { computed, CSSProperties } from 'vue';
  import { usePageSettingContext } from '../../hooks';

  defineProps<{
    left: CSSProperties['left'];
    top: CSSProperties['top'];
  }>();

  const pageSetting = usePageSettingContext();

  const style = computed(() => {
    const scale = pageSetting.scale / 100;
    const { paddingLeft, paddingRight } = pageSetting;
    const width = paddingLeft + paddingRight + 1200;
    return { scaleX: scale, translateX: `${(width * (1 - scale)) / 2}px` };
  });
</script>

<style lang="less" scoped>
  @line-color: #f2f2f2;
  @grid-size: 40px;
  @ruler-color: darken(@line-color, 30%);

  .ruler-top {
    top: 1.4rem;
    width: 1200px;
    height: 6px;
    // border-right: 1px solid @ruler-color;
    background-image: -webkit-linear-gradient(left, transparent @grid-size - 1, @ruler-color 0),
      -webkit-linear-gradient(top, transparent 5px, @ruler-color 0);
    background-size: @grid-size;
    transform: scaleX(v-bind('style.scaleX'));
  }

  .ruler-left {
    width: 6px;
    height: 100%;
    // border-top: 1px solid @ruler-color;
    // border-bottom: 1px solid @ruler-color;
    background-image: -webkit-linear-gradient(top, transparent @grid-size - 1, @ruler-color 0),
      -webkit-linear-gradient(left, transparent 5px, @ruler-color 0);
    background-size: @grid-size @grid-size;
    transform: translateX(v-bind('style.translateX'));
  }

  .ruler-left,
  .ruler-top {
    position: absolute;
    z-index: 9;
    transition: transform 0.2s;
  }
</style>
