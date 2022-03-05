<template>
  <IconifyIcon v-bind="{ ...$attrs, ...$props }" v-if="!park" />
  <IconPark
    v-else
    :class="$attrs.class"
    :type="icon"
    :theme="theme"
    :size="iconSize"
    :spin="spin"
    :fill="fill"
    :strokeWidth="4"
  />
</template>
<script lang="ts" setup>
  import { IconPark } from '@icon-park/vue-next/es/all';
  import { IconThemeEnum } from '/@/enums/appEnum';
  import { computed, toRefs } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import IconifyIcon from './Icon.vue';
  import { isString } from '/@/utils/is';
  import '@icon-park/vue-next/styles/index.css';
  const props = defineProps({
    icon: propTypes.string.isRequired,
    theme: propTypes.oneOf(Object.values(IconThemeEnum)).def(IconThemeEnum.MULLTI),
    size: propTypes.oneOfType([propTypes.string, propTypes.number]).def(20),
    spin: propTypes.bool.def(false),
    fill: propTypes
      .oneOfType([propTypes.arrayOf(propTypes.string), propTypes.string])
      .def(['#309cf6', '#118EF8', '#FFF', '#13f19c']),
    park: propTypes.bool.def(false),
  });
  const { icon, theme, size, spin, fill } = toRefs(props);
  const iconSize = computed(() => {
    console.log(size.value);

    if (isString(size.value)) {
      return /^\d+$/.test(size.value) ? Number(size.value) : size.value;
    } else {
      return size.value;
    }
  });
</script>
<style lang="less"></style>
