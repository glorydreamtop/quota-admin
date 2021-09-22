<template>
  <section class="full-loading" :class="{ absolute }" v-show="loadingRef" ref="loadingEl">
    <Spin v-bind="$attrs" :tip="tip" :size="size" :spinning="loadingRef" />
  </section>
</template>
<script lang="ts">
  import { PropType, ref, toRefs, watch } from 'vue';
  import { defineComponent } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { SizeEnum } from '/@/enums/sizeEnum';

  export default defineComponent({
    name: 'Loading',
    components: { Spin },
    props: {
      tip: {
        type: String as PropType<string>,
        default: '',
      },
      size: {
        type: String as PropType<SizeEnum>,
        default: SizeEnum.LARGE,
        validator: (v: SizeEnum): boolean => {
          return [SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE].includes(v);
        },
      },
      absolute: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      loading: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      background: {
        type: String as PropType<string>,
      },
    },
    setup(props) {
      const loadingEl = ref<HTMLElement>();
      const loadingRef = ref(false);
      const { loading } = toRefs(props);
      watch(loading, (v) => {
        if (v) {
          loadingEl.value!.style.opacity = '1';
          loadingRef.value = v;
        } else {
          loadingEl.value!.style.opacity = '0';
          setTimeout(() => {
            loadingRef.value = false;
          }, 200);
        }
      });
      return {
        loadingEl,
        loadingRef,
      };
    },
  });
</script>
<style lang="less" scoped>
  .full-loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(240, 242, 245, 0.4);
    opacity: 1;
    transition: opacity 0.2s ease;

    &.absolute {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 300;
    }
  }

  html[data-theme='dark'] {
    .full-loading {
      background-color: @modal-mask-bg;
    }
  }
</style>
