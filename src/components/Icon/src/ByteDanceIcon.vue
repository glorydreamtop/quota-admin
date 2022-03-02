<template>
  <IconifyIcon v-bind="{ ...$attrs, ...$props }" v-if="!park" />
  <IconPark
    v-else
    :class="$attrs.class"
    :type="icon"
    :theme="theme"
    :size="size"
    :spin="spin"
    :fill="fill"
  />
</template>
<script lang="ts" setup>
  import { IconPark } from '@icon-park/vue-next/es/all';
  import { IconThemeEnum } from '/@/enums/appEnum';
  import { toRefs } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import IconifyIcon from './Icon.vue';

  const props = defineProps({
    icon: propTypes.string.isRequired,
    theme: propTypes.oneOf(Object.values(IconThemeEnum)).def(IconThemeEnum.FILLED),
    size: propTypes.oneOfType([propTypes.string, propTypes.number]).def(16),
    spin: propTypes.bool.def(false),
    fill: propTypes.string,
    park: propTypes.bool.def(false),
  });
  const { icon, theme, size, spin, fill } = toRefs(props);
</script>
<style lang="less"></style>
