<template>
  <div id="chart-paint-mode-area" :class="[paintMode ? '' : 'hidden']">
    <div class="toolbar" ref="toolbar">
      <div
        title="选择"
        @click="switchType(paintTypeEnum.select)"
        :class="[paintType === paintTypeEnum.select ? '!text-primary bg-primary-100' : '']"
      >
        <Icon size="20" icon="clarity:cursor-arrow-line" />
      </div>
      <div
        title="直线"
        @click="switchType(paintTypeEnum.line)"
        :class="[paintType === paintTypeEnum.line ? '!text-primary bg-primary-100' : '']"
      >
        <Icon style="transform: rotate(45deg)" size="24" icon="ci:line-xl" />
      </div>
      <div
        title="箭头"
        @click="switchType(paintTypeEnum.arrow)"
        :class="[paintType === paintTypeEnum.arrow ? '!text-primary bg-primary-100' : '']"
      >
        <Icon style="transform: rotate(-45deg)" size="22" icon="entypo:arrow-long-right" />
      </div>
      <div
        title="文字"
        @click="switchType(paintTypeEnum.text)"
        :class="[paintType === paintTypeEnum.text ? '!text-primary bg-primary-100' : '']"
      >
        <Icon size="26" icon="carbon:text-font" />
      </div>
      <div
        title="自由曲线"
        @click="switchType(paintTypeEnum.pencil)"
        :class="[paintType === paintTypeEnum.pencil ? '!text-primary bg-primary-100' : '']"
      >
        <Icon size="20" icon="majesticons:edit-pen-4-line" />
      </div>
      <div
        title="矩形"
        @click="switchType(paintTypeEnum.rect)"
        :class="[paintType === paintTypeEnum.rect ? '!text-primary bg-primary-100' : '']"
      >
        <Icon size="24" icon="cil:rectangle" />
      </div>
      <div title="清除画布" @click="clearAll">
        <Icon size="20" icon="ic:baseline-cleaning-services" />
      </div>
    </div>
    <svg
      ref="paintArea"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      shape-rendering="geometricPrecision"
    >
      <defs>
        <marker
          id="arrow"
          markerWidth="14"
          markerHeight="20"
          refX="4"
          refY="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L4,10 L0,20 L14,10  z" fill="#f00" />
        </marker>
      </defs>
    </svg>
  </div>
  <Teleport to="body">
    <div
      ref="paintMask"
      id="chart-paint-mode-mask"
      :style="{ clipPath }"
      :class="[paintMode ? '' : 'hidden']"
    ></div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { ref, watch, nextTick } from 'vue';
  import { usePaint, paintTypeEnum } from './mark';
  import Icon from '/@/components/Icon';

  const props = defineProps<{
    paintMode: Boolean;
  }>();

  const [{ paintArea, paintType, toolbar }, { switchType, removeGroup, clearAll }] = usePaint();

  const paintMask = ref<HTMLDivElement>();

  const clipPath = ref('');

  watch(
    () => props.paintMode,
    async () => {
      await nextTick();
      const { left, right, top, bottom } = paintArea.value!.getBoundingClientRect();
      clipPath.value = `polygon(0% 0%,0% 100%,${left}px 100%,${left}px ${top}px,${right}px ${top}px,${right}px ${bottom}px,${left}px ${bottom}px,${left}px 100%,100% 100%,100% 0%)`;
    },
  );
</script>

<style lang="less" scoped>
  #chart-paint-mode-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.3);
    animation: colorchange 0.3s;
    // display: none;
  }

  @keyframes colorchange {
    0% {
      background-color: rgba(0, 0, 0, 0);
    }

    100% {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  #chart-paint-mode-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }

  .toolbar {
    @apply border border-gray-300;
    position: absolute;
    height: 32px;
    left: 30%;
    background-color: @white;
    z-index: 101;
    display: flex;

    & > div {
      @apply text-gray-600;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;

      &:hover {
        @apply bg-gray-200;
      }
    }
  }

  ::v-deep(.border-animation) {
    transition: border 0.3s;
  }

  @mark-color: #f22;
  @hover-mark-color: #ff2222dc;

  @hover-stroke-width: 4;
  @stroke-width: 1;

  ::v-deep(.hover-light) {
    transition: stroke-width 0.2s;

    &:hover {
      filter: drop-shadow(0px 0px 4px #f66);
    }
  }

  ::v-deep(.mark-selected) {
    transition: stroke-width 0.2s;
    filter: drop-shadow(0px 0px 4px #f66);
  }

  ::v-deep(.arrow-line) {
    stroke-width: 0;
    fill: @hover-mark-color;
  }

  ::v-deep(.arrow-line-shadow) {
    stroke-width: 10;
    stroke: transparent;
  }

  ::v-deep(.arrow-arrow),
  ::v-deep(.arrow-path) {
    fill: @mark-color;
    stroke-width: 0;
  }

  ::v-deep(.line) {
    stroke-width: @stroke-width;
    stroke: @mark-color;
  }

  ::v-deep(.line-shadow) {
    stroke-width: 4;
    stroke: transparent;
  }

  ::v-deep(.rect) {
    stroke-width: @stroke-width;
    stroke: @mark-color;
    fill: none;
  }

  ::v-deep(.rect-shadow) {
    stroke-width: 4;
    stroke: transparent;
    fill: none;
  }

  ::v-deep(.pencil) {
    stroke-width: @stroke-width;
    stroke: @mark-color;
    fill: none;
  }

  ::v-deep(.pencil-shadow) {
    stroke-width: 4;
    stroke: transparent;
    fill: none;
  }

  ::v-deep(.text-shadow) {
    stroke-width: @stroke-width;
    stroke: transparent;
    fill: transparent;
  }
</style>
