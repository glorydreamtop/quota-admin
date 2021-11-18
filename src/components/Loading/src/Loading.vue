<template>
  <section class="full-loading" :class="{ absolute }" v-show="loadingRef" ref="loadingEl">
    <!-- <Spin v-bind="$attrs" :tip="tip" :size="size" :spinning="loadingRef" /> -->
    <div class="loader-inner pacman">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </section>
</template>
<script lang="ts">
  import { PropType, ref, toRefs, watch } from 'vue';
  import { defineComponent } from 'vue';
  import { SizeEnum } from '/@/enums/sizeEnum';

  export default defineComponent({
    name: 'Loading',
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
      theme: {
        type: String as PropType<'dark' | 'light'>,
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
    background-color: rgb(240 242 245 / 40%);
    opacity: 100%;
    transition: opacity 10%s ease;

    &.absolute {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 300;
    }
  }

  html[data-theme='dark'] {
    .full-loading:not(.light) {
      background-color: @modal-mask-bg;
    }
  }

  .full-loading.dark {
    background-color: @modal-mask-bg;
  }
  @-webkit-keyframes rotate_pacman_half_up {
    0% {
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
    }
    50% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
    100% {
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
    }
  }

  @keyframes rotate_pacman_half_up {
    0% {
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
    }
    50% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
    100% {
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
    }
  }

  @-webkit-keyframes rotate_pacman_half_down {
    0% {
      -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
    }
    50% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
    }
  }

  @keyframes rotate_pacman_half_down {
    0% {
      -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
    }
    50% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
    }
  }

  @-webkit-keyframes pacman-balls {
    75% {
      opacity: 0.7;
    }
    100% {
      -webkit-transform: translate(-100px, -6.25px);
      transform: translate(-100px, -6.25px);
    }
  }

  @keyframes pacman-balls {
    75% {
      opacity: 0.7;
    }
    100% {
      -webkit-transform: translate(-100px, -6.25px);
      transform: translate(-100px, -6.25px);
    }
  }

  .pacman {
    position: relative;
  }
  .pacman > div:nth-child(2) {
    animation: pacman-balls 1s -0.99s infinite linear;
  }
  .pacman > div:nth-child(3) {
    animation: pacman-balls 1s -0.66s infinite linear;
  }
  .pacman > div:nth-child(4) {
    animation: pacman-balls 1s -0.33s infinite linear;
  }
  .pacman > div:nth-child(5) {
    -webkit-animation: pacman-balls 1s 0s infinite linear;
    animation: pacman-balls 1s 0s infinite linear;
  }
  .pacman > div:first-of-type {
    width: 0px;
    height: 0px;
    border-right: 25px solid transparent;
    border-top: 25px solid lighten(@primary-color, 10%);
    border-left: 25px solid lighten(@primary-color, 10%);
    border-bottom: 25px solid lighten(@primary-color, 10%);
    border-radius: 25px;
    animation: rotate_pacman_half_up 0.5s 0s infinite;
    position: relative;
    left: -30px;
  }
  .pacman > div:nth-child(2) {
    width: 0px;
    height: 0px;
    border-right: 25px solid transparent;
    border-top: 25px solid lighten(@primary-color, 10%);
    border-left: 25px solid lighten(@primary-color, 10%);
    border-bottom: 25px solid lighten(@primary-color, 10%);
    border-radius: 25px;
    animation: rotate_pacman_half_down 0.5s 0s infinite;
    margin-top: -50px;
    position: relative;
    left: -30px;
  }
  .pacman > div:nth-child(3),
  .pacman > div:nth-child(4),
  .pacman > div:nth-child(5),
  .pacman > div:nth-child(6) {
    background-color: lighten(@primary-color, 10%);
    width: 15px;
    height: 15px;
    border-radius: 100%;
    margin: 2px;
    width: 10px;
    height: 10px;
    position: absolute;
    transform: translate(0, -6.25px);
    top: 25px;
    left: 70px;
  }
</style>
