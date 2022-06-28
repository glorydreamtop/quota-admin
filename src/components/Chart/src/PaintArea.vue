<template>
  <div id="chart-paint-mode-area" :class="[paintMode ? '' : 'hidden']">
    <div class="toolbar">
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
    </div>
    <svg ref="paintArea" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
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
  import { ref, toRefs, watch, nextTick } from 'vue';
  import { usePaint, paintTypeEnum } from './mark';
  import Icon from '/@/components/Icon';

  const props = defineProps<{
    paintMode: Boolean;
  }>();

  const [paintArea, paintType, { switchType }] = usePaint();

  const paintMask = ref<HTMLDivElement>();

  const { paintMode } = toRefs(props);

  const clipPath = ref('');

  watch(paintMode, async () => {
    await nextTick();
    const { left, right, top, bottom } = paintArea.value!.getBoundingClientRect();
    const {
      left: left1,
      right: right1,
      top: top1,
      bottom: bottom1,
    } = paintArea.value!.previousElementSibling!.getBoundingClientRect();
    clipPath.value = `polygon(0% 0%,0% 100%,${left}px 100%,${left}px ${top}px,${left1}px ${bottom1}px,${left1}px ${top1}px,${right1}px ${top1}px,${right1}px ${bottom1}px,${right}px ${top}px,${right}px ${bottom}px,${left}px ${bottom}px,${left}px 100%,100% 100%,100% 0%)`;
  });
</script>

<style lang="less" scoped>
  #chart-paint-mode-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 599;
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
    z-index: 100;
  }

  .toolbar {
    @apply border-b border-gray-300;
    position: absolute;
    top: -30px;
    height: 30px;
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

  ::v-deep(.selected-light) {
    &:hover {
      filter: drop-shadow(0px 0px 4px red);
    }
  }
</style>
